import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static assets from 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all routes to index.html for Single Page Application behavior
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running in production on host 0.0.0.0 and port ${PORT}`);
});
