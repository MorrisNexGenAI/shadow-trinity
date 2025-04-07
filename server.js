import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

async function startServer() {
  try {
    // Create a Vite server in middleware mode
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: 5000,
        hmr: {
          clientPort: 443
        },
      },
      appType: 'spa'
    });

    // Use Vite's connect instance as middleware
    app.use(vite.middlewares);

    // Ensure directory paths exist before serving static files
    app.use(express.static(path.join(__dirname, '.')));

    // Handle the root route for SPA
    app.get('/', async (req, res) => {
      try {
        const url = req.originalUrl;

        // Try to read the index.html file
        let template;
        try {
          // Attempt to read the existing index.html file
          const indexPath = path.resolve(__dirname, 'index.html');
          const indexContent = await fs.readFile(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(url, indexContent);
        } catch (e) {
          // If reading fails, use a fallback template
          template = await vite.transformIndexHtml(
            url,
            `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <link rel="icon" type="image/svg+xml" href="/generated-icon.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Shadow OS Alpha</title>
              </head>
              <body>
                <div id="root"></div>
                <script type="module" src="/src/main.jsx"></script>
              </body>
            </html>`
          );
        }

        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        console.error('Error serving index.html:', e);
        res.status(500).send('Server error');
      }
    });

    // Start the server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Shadow OS Dev Server running at http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error(`Error starting server: ${e.message}`);
    console.error(e.stack);
  }
}

// Start the server
startServer();
