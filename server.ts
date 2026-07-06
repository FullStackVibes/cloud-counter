import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { createServer as createViteServer } from 'vite';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000; // Required container ingress port

  app.use(cors());
  app.use(express.json());

  // Mount the Milestone 1 backend API server directly onto container ingress (port 3000)
  const backendApp = require('./cloud-counter/backend/server.js');
  app.use(backendApp);

  // Also boot the standalone Milestone 1 backend server on port 5000 for strict specification compliance
  try {
    const server5000 = backendApp.listen(5000, '0.0.0.0', () => {
      console.log('[CloudCounter] Standalone Milestone 1 backend server also listening on port 5000');
    });
    server5000.on('error', (err: any) => {
      console.log('[CloudCounter] Note: Port 5000 busy or unavailable, continuing on port 3000:', err.message);
    });
  } catch (e: any) {
    console.log('[CloudCounter] Note: Port 5000 server start check:', e.message || e);
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const mainServer = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CloudCounter] Main Container Ingress Server running on http://0.0.0.0:${PORT}`);
  });
  mainServer.on('error', (err: any) => {
    console.error(`[CloudCounter] Server error on port ${PORT}:`, err.message);
  });
}

startServer();
