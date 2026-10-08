module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', [
      'cbz_app_key_alpha_2026',
      'cbz_app_key_beta_2026',
      'cbz_app_key_gamma_2026',
      'cbz_app_key_delta_2026',
    ]),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
