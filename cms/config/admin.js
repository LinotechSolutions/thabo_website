module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'cbz_admin_jwt_secret_production_2026_super_secure'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'cbz_api_token_salt_production_2026'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'cbz_transfer_token_salt_2026'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
  },
});
