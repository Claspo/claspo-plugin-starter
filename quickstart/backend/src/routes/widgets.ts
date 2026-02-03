import { Router, Request, Response } from 'express';
import {
  getWidget,
  createWidget,
  updateWidget,
  resetTempStorage,
} from '../repository/widget-repository';

const router = Router();

// GET /api/simplified/widget/:id - Get widget by ID
router.get('/widget/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const widget = getWidget(id);
  res.json(widget);
});

// POST /api/simplified/widget - Create widget
// Request body: { name, variant, publishStatus? }
// Response: { variant, appearances }
router.post('/widget', (req: Request, res: Response) => {
  const { name, variant, publishStatus } = req.body;
  const widget = createWidget({
    name,
    config: variant,
    publishStatus: publishStatus || 'DRAFT',
    appearances: variant.appearances,
  });
  res.status(201).json({
    variant: widget.config,
    appearances: widget.appearances,
  });
});

// PUT /api/simplified/widget/:id - Update widget
router.put('/widget/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const widget = updateWidget(id, req.body);
  res.json(widget);
});

// POST /api/simplified/reset - Reset temp storage to reference data
router.post('/reset', (_req: Request, res: Response) => {
  resetTempStorage();
  res.json({ message: 'Storage reset to reference data' });
});

export default router;
