const engineSecure = Boolean(parseInt(process.env['ENGINE_SECURE']) || 0);
const engineHost = process.env['ENGINE_HOST'] || 'localhost';
const enginePort = process.env['ENGINE_PORT'] || (engineSecure ? 443 : 80);

const PROXY_CONFIG = [
  {
    context: [
      '/api',
      '/fs',
      '/icon',
      '/carousel',
    ],
    target: {
      protocol: engineSecure ? 'https:' : 'http:',
      host: engineHost,
      port: enginePort,
    },
    secure: false,
    changeOrigin: true,
    withCredentials: true,
    logLevel: process.env['PROXY_LOG_LEVEL'] || 'info',
  }
];

module.exports = PROXY_CONFIG;
