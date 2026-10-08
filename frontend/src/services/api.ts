/**
 * CBZ Holdings — Production Django API Client
 * Configured with credentialed cookie forwarding and CSRF token management.
 */

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (import.meta as any).env?.VITE_API_URL ||
  "http://localhost:8000/api";

let csrfTokenCache: string | null = null;

/**
 * Fetches the CSRF token from the Django backend and caches it in memory.
 */
export async function getCsrfToken(): Promise<string> {
  if (csrfTokenCache) return csrfTokenCache;
  try {
    const res = await fetch(`${API_BASE_URL}/csrf/`, {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      csrfTokenCache = data.csrfToken;
      return data.csrfToken;
    }
  } catch (err) {
    console.error("Failed to retrieve CSRF token from backend", err);
  }
  return "";
}

/**
 * Core HTTP fetch wrapper with credentials (cookies) and CSRF header.
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const method = (options.method || "GET").toUpperCase();

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Attach CSRF token on mutating requests (POST, PUT, PATCH, DELETE)
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    const token = await getCsrfToken();
    if (token) {
      headers["X-CSRFToken"] = token;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Essential for HttpOnly JWT and CSRF cookies
  });

  if (!response.ok) {
    let errorDetail = "An unexpected server error occurred.";
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || JSON.stringify(errJson);
    } catch {}
    throw new Error(errorDetail);
  }

  return response.json();
}

// ============================================================
// API Service Methods
// ============================================================

export const cbzApi = {
  // Health
  checkHealth: () => request<{ status: string; database: string }>("/health/"),

  // Authentication & Onboarding
  auth: {
    login: (payload: { username: string; password: string; portal_type?: string }) =>
      request<{ message: string; user: any }>("/auth/login/", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    register: (payload: Record<string, any>) =>
      request<{ message: string; user: any }>("/auth/register/", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    refresh: () =>
      request<{ detail: string }>("/auth/refresh/", {
        method: "POST",
      }),
    logout: () =>
      request<{ detail: string }>("/auth/logout/", {
        method: "POST",
      }),
    getMe: () => request<any>("/auth/me/"),
  },

  accounts: {
    onboard: (payload: {
      service: string;
      ref?: string;
      profile: {
        firstName: string;
        surname: string;
        nationalId: string;
        dateOfBirth: string;
        phone: string;
        email: string;
        address: string;
      };
      answers: Record<string, any>;
    }) =>
      request<{
        status: string;
        reference_code: string;
        service: string;
        message: string;
        created_at: string;
      }>("/accounts/onboard/", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  // Countries
  countries: {
    getAll: () => request<any[]>("/countries/"),
    getByCode: (code: string) => request<any>(`/countries/${code}/`),
  },

  // Subsidiaries & Corporate Structure
  subsidiaries: {
    getAll: () => request<any[]>("/subsidiaries/"),
    getById: (id: string) => request<any>(`/subsidiaries/${id}/`),
    getAudiences: () => request<any[]>("/subsidiaries/audiences/"),
    getLifeStages: () => request<any[]>("/subsidiaries/life-stages/"),
    getGoals: () => request<any[]>("/subsidiaries/goals/"),
  },

  // Products
  products: {
    getAll: (params?: { subsidiary?: string; category?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<any[]>(`/products/${query ? `?${query}` : ""}`);
    },
    getGrouped: (subsidiary: string) =>
      request<Record<string, any[]>>(`/products/grouped/?subsidiary=${subsidiary}`),
  },

  // Billers
  billers: {
    getAll: () => request<any[]>("/billers/"),
  },

  // Branches & ATMs
  branches: {
    find: (params?: { lat?: number; lng?: number; city?: string; type?: string; search?: string }) => {
      const cleanParams: Record<string, string> = {};
      if (params?.lat !== undefined) cleanParams.lat = String(params.lat);
      if (params?.lng !== undefined) cleanParams.lng = String(params.lng);
      if (params?.city) cleanParams.city = params.city;
      if (params?.type) cleanParams.type = params.type;
      if (params?.search) cleanParams.search = params.search;
      const query = new URLSearchParams(cleanParams).toString();
      return request<any[]>(`/branches/${query ? `?${query}` : ""}`);
    },
  },

  // Insurance Options & Quote Engine
  insurance: {
    getOptions: () =>
      request<{ assets: any[]; covers: any[]; addons: any[] }>("/insurance/options/"),
    calculateQuote: (payload: {
      asset_id: string;
      cover_id: string;
      selected_addons?: string[];
      vehicle_make?: string;
      vehicle_model?: string;
      vehicle_year?: number;
      vehicle_value_usd?: number;
      reg_number?: string;
      overnight_location?: string;
      country_code?: string;
    }) =>
      request<{
        totalMonthlyUSD: number;
        totalAnnualUSD: number;
        localCurrency: any;
        breakdown: any;
        coverObj: any;
        activeAddonsList: any[];
      }>("/insurance/quote/", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  // Calculators
  calculators: {
    standAffordability: (payload: {
      monthly_income: number;
      existing_debt?: number;
      deposit_amount?: number;
      loan_term_years?: number;
      interest_rate_percent?: number;
    }) =>
      request<{
        qualifies: boolean;
        monthlyRepayment: number;
        maxLoanAmount: number;
        depositAmount: number;
        maxAffordablePrice: number;
        debtToIncomeRatio: number;
        totalInterest: number;
        totalRepayment: number;
        loanTermYears: number;
        interestRate: number;
        message: string;
      }>("/calculators/stand-affordability/", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    seasonalBudget: (payload: {
      crop_type: string;
      hectares: number;
      input_cost_per_ha?: number;
      expected_yield_per_ha?: number;
      expected_price_per_ton?: number;
      include_insurance?: boolean;
    }) =>
      request<{
        crop: string;
        hectares: number;
        costPerHectare: number;
        expectedYieldPerHa: number;
        expectedPricePerTon: number;
        totalYieldTons: number;
        totalInputCost: number;
        insuranceCost: number;
        totalOperatingCost: number;
        totalGrossRevenue: number;
        grossProfit: number;
        returnOnInvestment: number;
        breakEvenYieldPerHa: number;
        breakEvenPricePerTon: number;
      }>("/calculators/seasonal-budget/", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    investmentPathway: (payload: {
      initial_investment: number;
      monthly_contribution?: number;
      horizon_years?: number;
      risk_profile?: string;
    }) =>
      request<{
        riskProfile: string;
        strategy: string;
        strategyDescription: string;
        annualizedReturnPercent: number;
        horizonYears: number;
        totalContributed: number;
        projectedValue: number;
        estimatedGrowth: number;
        milestones: any[];
        recommendedFunds: any[];
      }>("/calculators/investment-pathway/", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  // Chatbot
  chatbot: {
    sendMessage: (payload: { message: string; session_id?: string; language?: string }) =>
      request<{ reply: string; sessionId: string }>("/chatbot/message/", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    getHistory: (sessionId: string) => request<any>(`/chatbot/history/${sessionId}/`),
  },

  // Corporate Communications & Announcements
  announcements: {
    getAll: (params?: { category?: string; urgent?: boolean }) => {
      const cleanParams: Record<string, string> = {};
      if (params?.category) cleanParams.category = params.category;
      if (params?.urgent !== undefined) cleanParams.urgent = String(params.urgent);
      const query = new URLSearchParams(cleanParams).toString();
      return request<any[]>(`/announcements/${query ? `?${query}` : ""}`);
    },
    getUrgent: () => request<any[]>("/announcements/urgent/"),
  },

  // Contact Channels
  contactChannels: {
    getAll: () => request<any[]>("/contact-channels/"),
  },

  // Corporate Facts & Metadata
  facts: {
    getAll: () => request<any[]>("/facts/"),
  },
};
