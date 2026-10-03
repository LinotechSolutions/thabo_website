from django.urls import path
from chatbot.views import ChatbotMessageView, ChatSessionHistoryView

app_name = "chatbot"

urlpatterns = [
    path("message/", ChatbotMessageView.as_view(), name="chat-message"),
    path("history/<uuid:session_id>/", ChatSessionHistoryView.as_view(), name="chat-history"),
]
