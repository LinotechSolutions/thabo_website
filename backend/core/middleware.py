class SecurityHeadersMiddleware:
    """
    Middleware attaching defense-in-depth security headers (CSP, Permissions-Policy,
    strict frame protection, referrer policy) to all API and web responses.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Content-Security-Policy
        csp_directives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https://images.unsplash.com http://localhost:1337 https://cms.cbz.co.zw",
            "font-src 'self' data: https://fonts.gstatic.com",
            "connect-src 'self' http://localhost:8000 http://127.0.0.1:8000 http://localhost:1337 https://*.cbz.co.zw https://api.cbz.co.zw https://cms.cbz.co.zw",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ]
        response["Content-Security-Policy"] = "; ".join(csp_directives)

        # Permissions-Policy
        response["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=()"

        # Referrer-Policy
        response["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Frame Options
        response["X-Frame-Options"] = "DENY"

        # Content-Type Sniffing Protection
        response["X-Content-Type-Options"] = "nosniff"

        return response
