/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "true" enables simulated demo flows. Never set in production. */
  readonly VITE_ENABLE_DEMO?: string;
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
