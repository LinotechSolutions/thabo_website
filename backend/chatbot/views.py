from django.http import StreamingHttpResponse
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from chatbot.models import ChatMessage, ChatSession
from chatbot.serializers import ChatbotMessageRequestSerializer, ChatSessionSerializer
from chatbot.services import ChatbotService, detect_language, sanitize_pii
from core.throttling import ChatbotRateThrottle


def _get_or_create_session(request, session_id, language):
    """Retrieves an existing ChatSession by ID, or creates a new one."""
    session = None
    if session_id:
        session = ChatSession.objects.filter(session_id=session_id).first()
    if not session:
        session = ChatSession.objects.create(
            user=request.user if request.user.is_authenticated else None,
            language=language,
        )
    elif session.language != language and language != "en":
        # Update stored language if user explicitly switched
        session.language = language
        session.save(update_fields=["language"])
    return session


class ChatbotMessageView(APIView):
    """
    Full-site AI concierge endpoint.

    POST /api/chatbot/message/

    Handles:
    - Language auto-detection from message content (English / Shona / Ndebele)
    - Explicit language override via 'language' field
    - Conversation continuity via session_id across page navigations
    - Server-side Gemini proxy (API key never leaves the server)
    - Streaming SSE via stream=true
    - CSRF-protected (same pattern as all other mutating routes)
    """
    permission_classes = [AllowAny]
    throttle_classes = [ChatbotRateThrottle]

    def post(self, request):
        serializer = ChatbotMessageRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        user_message: str = data["message"]
        session_id = data.get("session_id")
        explicit_lang: str = data.get("language", "")
        stream_mode: bool = data.get("stream", False)

        # Auto-detect language; explicit override wins
        detected_lang = detect_language(user_message)
        language = explicit_lang if explicit_lang in ("en", "sn", "nd", "sw") else detected_lang

        # Retrieve or create session (reload-safe; stored server-side)
        session = _get_or_create_session(request, session_id, language)

        # Persist user message (PII-scrubbed for QA logs; raw message used for LLM)
        sanitized_user_msg = sanitize_pii(user_message)
        ChatMessage.objects.create(
            session=session,
            role="user",
            content=sanitized_user_msg,
        )

        # Build conversation history for context window (last 10 messages)
        past_msgs = list(session.messages.order_by("-created_at")[:10])
        history_list = [
            {"role": m.role, "content": m.content}
            for m in reversed(past_msgs)
        ]

        # ── Streaming path ───────────────────────────────────────────────────
        if stream_mode:
            def _event_stream():
                full_reply_parts = []
                gen = ChatbotService.generate_response(
                    message=user_message,
                    history=history_list,
                    detected_language=language,
                    stream=True,
                )
                for chunk_sse in gen:
                    yield chunk_sse
                    # Collect full reply from done event for logging
                    if '"done": true' in chunk_sse or '"done":true' in chunk_sse:
                        import json
                        try:
                            payload = json.loads(chunk_sse.removeprefix("data: ").strip())
                            full_reply = payload.get("fullReply", "")
                            if full_reply:
                                ChatMessage.objects.create(
                                    session=session,
                                    role="assistant",
                                    content=sanitize_pii(full_reply),
                                )
                        except Exception:
                            pass

                # Inject session ID as final event so the client can store it
                import json
                yield f"data: {json.dumps({'sessionId': str(session.session_id), 'language': language})}\n\n"

            http_response = StreamingHttpResponse(
                _event_stream(),
                content_type="text/event-stream; charset=utf-8",
            )
            http_response["Cache-Control"] = "no-cache, no-store"
            http_response["X-Accel-Buffering"] = "no"
            http_response["Access-Control-Allow-Origin"] = request.META.get("HTTP_ORIGIN", "*")
            http_response["Access-Control-Allow-Credentials"] = "true"
            return http_response

        # ── Non-streaming path ───────────────────────────────────────────────
        reply_text = ChatbotService.generate_response(
            message=user_message,
            history=history_list,
            detected_language=language,
            stream=False,
        )

        ChatMessage.objects.create(
            session=session,
            role="assistant",
            content=sanitize_pii(reply_text),
        )

        return Response(
            {
                "reply": reply_text,
                "sessionId": str(session.session_id),
                "language": language,
            },
            status=status.HTTP_200_OK,
        )


class ChatSessionHistoryView(APIView):
    """
    Reload-safe conversation history retrieval.
    GET /api/chatbot/history/{session_id}/
    """
    permission_classes = [AllowAny]

    def get(self, request, session_id):
        session = ChatSession.objects.filter(session_id=session_id).first()
        if not session:
            return Response(
                {"detail": "Chat session not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = ChatSessionSerializer(session)
        return Response(serializer.data, status=status.HTTP_200_OK)
