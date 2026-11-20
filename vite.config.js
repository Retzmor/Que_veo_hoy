import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import recommendHandler from './api/recommend.js'

function localApiRecommendPlugin(env) {
  return {
    name: 'local-api-recommend-middleware',
    configureServer(server) {
      server.middlewares.use('/api/recommend', async (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'POST') {
          return next();
        }
        req.youtubeApiKey = env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
        try {
          await recommendHandler(req, res);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(
            JSON.stringify({
              error: 'DEV_MIDDLEWARE_ERROR',
              message: err?.message || 'Error interno en middleware local.',
            })
          );
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss(), localApiRecommendPlugin(env)],
    resolve: {
      preserveSymlinks: true,
    },
  };
})
