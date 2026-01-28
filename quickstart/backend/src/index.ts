import express from 'express';
import cors from 'cors';
import widgetsRouter from './routes/widgets.js';
import { initializeDefaultData } from './repository/widget-repository.js';

const app = express();
const PORT = 3100;

// Initialize default data on startup
initializeDefaultData();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API routes
app.use('/api', widgetsRouter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
