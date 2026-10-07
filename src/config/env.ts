/**
 * Demo mode keeps simulated flows (sample customer, fake payments, offline chatbot
 * answers, illustrative countries) available for stakeholder walkthroughs.
 *
 * It is OFF unless the build sets VITE_ENABLE_DEMO=true. Production builds must not
 * set it. Gate demo-only code with `if (DEMO_MODE)` and load demo data with a dynamic
 * import inside that branch so it is stripped from production bundles.
 */
export const DEMO_MODE: boolean = import.meta.env.VITE_ENABLE_DEMO === 'true';
