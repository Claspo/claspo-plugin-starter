import express from 'express';
import cors from 'cors';
import widgetRoutes from './routes/widgets';
import { initializeTempStorage } from './repository/widget-repository';

const app = express();
const PORT = process.env.PORT || 3101;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/simplified', widgetRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend-simplified' });
});

// Initialize temp storage on startup
initializeTempStorage();

app.listen(PORT, () => {
  console.log(`Simplified backend running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log(`  GET    /api/simplified/widget/:id`);
  console.log(`  POST   /api/simplified/widget`);
  console.log(`  PUT    /api/simplified/widget/:id`);
  console.log(`  POST   /api/simplified/reset`);
});
