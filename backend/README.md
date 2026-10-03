# CBZ Holdings Corporate Website — Django REST Framework Backend

Production-grade, secure, multi-tenant Python/Django backend serving the CBZ Holdings conglomerate web platform (Banking, Insurance, Life, Investments, Properties, Agro-Yield, and Microfinance).

---

## 1. Quick Start & Setup

### Prerequisites
- Python 3.11+
- PostgreSQL 14+ (or Docker)
- Redis 7+ (or Docker)

### Installation

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. (Optional but recommended) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # Linux/macOS:
   source venv/bin/activate
   ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your PostgreSQL credentials, Redis URL, and a cryptographically random `DJANGO_SECRET_KEY` (minimum 50 characters).

5. Apply migrations:
   ```bash
   python manage.py migrate
   ```

6. Seed initial master data (Countries, Subsidiaries, Lifecycle Stages, Products, Billers, Insurance Options, and Branches):
   ```bash
   python manage.py seed_cbz_data
   ```

7. Run the development server:
   ```bash
   python manage.py runserver 8000
   ```

8. Run test suite:
   ```bash
   python manage.py test
   ```

9. Verify production deployment readiness check:
   ```bash
   python manage.py check --deploy
   ```

---

## 2. Docker & Containerized Orchestration

### Run Full Stack (PostgreSQL, Redis, Django API, Frontend):
From the root workspace directory:
```bash
docker compose up -d --build
```
This automatically boots:
- `db`: PostgreSQL 16 on port 5432
- `redis`: Redis 7 on port 6379
- `backend`: Django Gunicorn API on port 8000 (applies migrations and seeds data)
- `web`: Next.js / Vite React frontend on port 3000

---

## 3. Architecture & Domain Apps

| Django App | Domain & Description | Key Endpoints |
|---|---|---|
| `core` | Health checks, CSRF token distribution, global throttles, fail-secure exception handler, and PII redacting logging | `GET /api/health/`<br>`GET /api/csrf/` |
| `accounts` | Custom User model (`AbstractUser`), Argon2 password hashing, cookie-based JWT authentication, role permission classes | `POST /api/auth/register/`<br>`POST /api/auth/login/`<br>`POST /api/auth/refresh/`<br>`POST /api/auth/logout/`<br>`GET /api/auth/me/` |
| `audit` | Queryable security audit trail recording IP address, user agent, action, and timestamps with PII redaction | Django Admin (`AuditLog`) |
| `countries` | Regional operation data (ZW, ZM, KE, TZ) with currencies, FX rates, and regulatory details | `GET /api/countries/`<br>`GET /api/countries/{code}/` |
| `subsidiaries` | 9 CBZ subsidiaries, 5-stage lifecycles, audience segments, life stages, and strategic goals | `GET /api/subsidiaries/`<br>`GET /api/subsidiaries/audiences/`<br>`GET /api/subsidiaries/life-stages/`<br>`GET /api/subsidiaries/goals/` |
| `products` | Product catalog for retail/corporate accounts, cards, loans, funds, agro facilities, and properties | `GET /api/products/`<br>`GET /api/products/grouped/?subsidiary={id}` |
| `billers` | Integrated utility billers (ZESA, Econet, NetOne, Municipalities, ZINARA) | `GET /api/billers/` |
| `branches` | Branch, Agency, and ATM finder with Haversine distance calculations and location filtering | `GET /api/branches/?lat={lat}&lng={lng}&city={city}` |
| `insurance` | Asset options, cover tiers, add-ons, and real actuarial quote calculation engine | `GET /api/insurance/options/`<br>`POST /api/insurance/quote/` |
| `calculators` | Stand affordability (Properties), Seasonal budget/yield (Agro-Yield), and Investment pathway guide (Datvest) | `POST /api/calculators/stand-affordability/`<br>`POST /api/calculators/seasonal-budget/`<br>`POST /api/calculators/investment-pathway/` |
| `chatbot` | Server-side Gemini LLM proxy with site context injection, multilingual detection (English, Shona, Ndebele, Swahili), and streaming SSE | `POST /api/chatbot/message/`<br>`GET /api/chatbot/history/{sessionId}/` |

---

## 4. Security Implementation Matrix

| Security Requirement | Implementation Detail & Code Location |
|---|---|
| **HTTPS / TLS Everywhere** | `SECURE_SSL_REDIRECT = True`, `SECURE_HSTS_SECONDS = 31536000`, `SECURE_HSTS_INCLUDE_SUBDOMAINS = True`, `SECURE_HSTS_PRELOAD = True` in `cbz_backend/settings.py` (L140-145). `python manage.py check --deploy` passes with 0 warnings. |
| **Server-Side Validation** | DRF Serializers on every mutating endpoint (`RegisterSerializer`, `LoginSerializer`, `InsuranceQuoteRequestSerializer`, `StandAffordabilityInputSerializer`, `SeasonalBudgetInputSerializer`, `InvestmentPathwayInputSerializer`, `ChatbotMessageRequestSerializer`). |
| **ORM-Only Queries** | 100% Django ORM querysets (`objects.filter()`, `select_related()`, `prefetch_related()`). Zero raw SQL or concatenated SQL strings. |
| **Argon2 Password Hashing** | `Argon2PasswordHasher` configured first in `PASSWORD_HASHERS` in `cbz_backend/settings.py` (L108-113). Automatically enforced on user creation. |
| **JWT Cookie Hardening** | `CookieTokenObtainPairView` sets short-lived `access_token` and rotating `refresh_token` as `HttpOnly`, `Secure` (in prod), `SameSite=Strict` cookies. Tokens are NEVER returned in JSON body or stored in `localStorage`. Implemented in `accounts/views.py` (L15-46) & `accounts/authentication.py`. |
| **Token Rotation & Blacklisting** | `ROTATE_REFRESH_TOKENS = True` and `BLACKLIST_AFTER_ROTATION = True` in `SIMPLE_JWT`. Old refresh tokens blacklisted upon rotation and logout. Implemented in `accounts/views.py` (L150-180) & `cbz_backend/settings.py` (L180-195). |
| **CSRF Protection on Mutating Requests** | `CookieJWTAuthentication` implements `enforce_csrf(request)` via Django's `CSRFCheck` for all state-changing methods on cookie-authenticated requests. CSRF token exposed via `GET /api/csrf/` and validated via `X-CSRFToken` header. Tested in `accounts/tests.py`. |
| **Server-Side Role Checks** | DRF permissions (`IsPersonalUser`, `IsCorporateUser`, `IsBusinessUser`, `IsStaffRoleUser`) in `accounts/permissions.py`. Server derives and checks user role from database, never trusting client-claimed roles. |
| **Rate Limiting** | DRF throttle classes (`AnonGlobalThrottle`, `UserGlobalThrottle`, `AuthRateThrottle`, `ChatbotRateThrottle`) backed by Redis/cache. Auth throttled strictly to 5-10/min, Chatbot to 10-20/min. Implemented in `core/throttling.py` & `cbz_backend/settings.py`. |
| **Secure HTTP Headers** | `SECURE_CONTENT_TYPE_NOSNIFF = True`, `SECURE_BROWSER_XSS_FILTER = True`, `X_FRAME_OPTIONS = "DENY"` in `cbz_backend/settings.py`. |
| **Explicit CORS Allow-List** | `django-cors-headers` configured with explicit origins (`http://localhost:3000`, `http://localhost:5173`, etc.) — never `*`. `CORS_ALLOW_CREDENTIALS = True` for cookie transmission. Implemented in `cbz_backend/settings.py` (L120-135). |
| **Fail-Secure Error Handling** | `DEBUG = False` default in production. App refuses to boot if `DJANGO_SECRET_KEY` is missing. Custom exception handler in `core/exceptions.py` catches 500 errors, logs full trace server-side, and returns generic error messages to client. |
| **Obscured Admin Path** | `ADMIN_URL_PATH` environment variable moves Django admin off `/admin/` (default `/cbz-secure-admin/`). Hitting `/admin/` returns 404 Not Found. Tested in `core/tests.py`. |
| **Audit Logging** | `AuditLog` model in `audit/models.py` records IP address, user agent, action, status, and metadata for all registration, login, logout, and token operations. Signals in `accounts/signals.py` and service in `audit/services.py`. Records are immutable. |
| **Structured Log Redaction** | `RedactingFilter` in `core/logging.py` strips passwords, bearer tokens, API keys, and authorization headers before logging. |
| **Chatbot Server-Side Proxy** | Gemini API key never sent to browser; proxy lives in `chatbot/services.py`. Sensitive PII (national IDs, phone numbers, credit card patterns) sanitized from conversation logs before saving. |

---

## 5. Step 0 Ambiguities & Resolutions Note

| Discrepancy / Ambiguity | Codebase Finding | Resolution & Decision |
|---|---|---|
| **Brand Colors** | Master prompt mentioned `--red #ba0013` and `--navy #0b2c4d`, but frontend CSS tokens in `src/index.css` and components use `--cbz-red: #E4002B` and `--cbz-navy: #002554`. | Adopted active production tokens (`#E4002B` and `#002554`) to maintain 100% visual fidelity with current live assets. |
| **Subsidiary Count** | Prompt mentioned 10 subsidiaries; `cbzData.ts` contained 9 distinct subsidiaries (`bank`, `insurance`, `life`, `datvest`, `capital`, `properties`, `agri`, `risk`, `micro`). | Modeled all 9 subsidiaries faithfully in `subsidiaries/models.py`. "Red Sphere" is categorized as `micro` (Microfinance) and "CBZ Life" as `life`. |
| **Frontend Framework** | Prompt referenced Next.js / shadcn; repo is actually Vite + React 19 + TypeScript + Tailwind 4. | Kept standard REST/JSON endpoints decoupled from frontend framework, ensuring compatibility with any client SPA or SSR framework. |
| **Portal Roles** | Frontend `LoginModal.tsx` defines 3 portal types (`personal`, `corporate`, `self-service`), while prompt mentioned "diaspora". | Custom `UserRole` supports `personal`, `business`, `corporate`, `diaspora`, `self_service`, and `staff`. |
| **Insurance Pricing** | Frontend had a static price formula (`basePriceUSD + addons`). | Implemented realistic actuarial engine in `insurance/services.py`: `max(basePrice, round(vehicleValue * rate / 12)) + addons + 5% statutory levy` with vehicle age loading and annual discounts. |
| **Calculators** | Stand-affordability, seasonal budget, and investment pathway calculators did not exist on server. | Created dedicated domain services in `calculators/services.py` respecting Zimbabwean banking regulations (40% DTI, standard crop inputs, compound yield models). |
