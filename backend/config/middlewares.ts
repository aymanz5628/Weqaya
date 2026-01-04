export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:', 'http:'],
          'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.tiny.cloud'],
          'frame-src': ["'self'", 'https://cdn.tiny.cloud'],
          'img-src': ["'self'", 'data:', 'blob:', 'https://sp.tinymce.com', 'https:'],
          'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.tiny.cloud', 'https://fonts.googleapis.com'],
          'font-src': ["'self'", 'https://fonts.gstatic.com', 'https://cdn.tiny.cloud'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
