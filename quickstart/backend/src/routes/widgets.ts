import {type Request, type Response, Router} from 'express';
import {v4 as uuidv4} from 'uuid';
import {WidgetAppearanceI, WidgetModelI, WidgetVariantDtoI, WidgetPublishStatus, WidgetRevisionI} from '@claspo/editor';
import {
  addRevision,
  addUserImage,
  createWidget,
  getAppearances,
  getDropdownOptions,
  getIcons,
  getImageLibrary,
  getLanguages,
  getNextIds,
  getProjectConfigs,
  getRevisionByUuid,
  getRevisions,
  getUserImages,
  getWidget,
  getWidgets,
  removeUserImage,
  saveAppearances,
  updateWidget,
} from '../repository/widget-repository.js';

const router = Router();

// GET /languages - List of languages for multilingual support
router.get('/dropdown-options', (_req: Request, res: Response) => {
  res.json(getDropdownOptions());
});

// GET /languages - List of languages for multilingual support
router.get('/languages', (_req: Request, res: Response) => {
  res.json(getLanguages());
});

// GET /widgets - Get list of widgets
router.get('/widgets', (req: Request, res: Response) => {
  const { search, offset = '0', limit = '10', layoutTypes } = req.query;

  let widgets = getWidgets().filter(w => w.config?.type !== 'TEASER');

  // Handle search parameter
  if (search && typeof search === 'string') {
    const searchLower = search.toLowerCase();
    const idMatch = search.match(/^id:(\d+)$/);
    if (idMatch) {
      const searchId = parseInt(idMatch[1], 10);
      widgets = widgets.filter(w => w.id === searchId);
    } else {
      widgets = widgets.filter(w => w.name.toLowerCase().includes(searchLower));
    }
  }

  // Filter by layout types
  if (layoutTypes) {
    const types = Array.isArray(layoutTypes) ? layoutTypes : [layoutTypes];
    widgets = widgets.filter(w => types.includes(w.config?.config?.type));
  }

  const offsetNum = parseInt(offset as string, 10) || 0;
  const limitNum = parseInt(limit as string, 10) || 10;
  const paginatedWidgets = widgets.slice(offsetNum, offsetNum + limitNum);

  res.json({ totalCount: widgets.length, items: paginatedWidgets });
});

// GET /widget/:id - Get widget details
router.get('/widget/:id', (req: Request, res: Response) => {
  const widget = getWidget(+req.params.id);
  if (!widget) {
    res.status(404).json({ error: 'Widget not found' });
    return;
  }
  res.json(widget);
});

// PATCH /widget/:id - Partial update widget
router.patch('/widget/:id', (req: Request, res: Response) => {
  const widgetId = +req.params.id;
  const widget = getWidget(widgetId);

  if (!widget) {
    res.status(404).json({ error: 'Widget not found' });
    return;
  }

  const updates = req.body;
  const updatedFields: Partial<WidgetModelI> = {};

  if (updates.publishStatus !== undefined) {
    updatedFields.publishStatus = updates.publishStatus;
  }

  if (updates.name !== undefined) {
    updatedFields.name = updates.name;
  }

  if (updates.config !== undefined) {
    updatedFields.config = {
      ...widget.config,
      ...updates.config,
      config: updates.config.config
        ? { ...widget.config.config, ...updates.config.config }
        : widget.config.config
    } as WidgetVariantDtoI;

    // Update variants array
    const variantIndex = widget.variants.findIndex(v => v.id === widget.config.id);
    if (variantIndex !== -1) {
      updatedFields.variants = [...widget.variants];
      updatedFields.variants[variantIndex] = updatedFields.config;
    }
  }

  const updated = updateWidget(widgetId, updatedFields);
  res.json(updated);
});

// GET /widget/:id/appearances - Get widget appearances
router.get('/widget/:id/appearances', (req: Request, res: Response) => {
  const widget = getWidget(+req.params.id);
  if (!widget) {
    res.status(404).json({ error: 'Widget not found' });
    return;
  }
  res.json(getAppearances(+req.params.id));
});

// PUT /widget/:id/appearances - Update widget appearances
router.put('/widget/:id/appearances', (req: Request, res: Response) => {
  const widgetId = +req.params.id;
  const widget = getWidget(widgetId);

  if (!widget) {
    res.status(404).json({ error: 'Widget not found' });
    return;
  }

  if (!req.body || !Array.isArray(req.body)) {
    res.status(400).json({ error: 'Invalid request body: appearances array required' });
    return;
  }

  saveAppearances(widgetId, req.body);

  // Update appearance references in widget config
  const appearances = req.body as WidgetAppearanceI[];
  updateWidget(widgetId, {
    config: {
      ...widget.config,
      appearances: appearances.map(app => ({ id: app.id, language: app.language, origin: app.origin }))
    } as WidgetVariantDtoI
  });

  res.json({ success: true });
});

// GET /widget/:id/revision - Get revisions list for widget
router.get('/widget/:id/revision', (req: Request, res: Response) => {
  const { offset = '0', limit = '10' } = req.query;
  const widget = getWidget(+req.params.id);

  if (!widget) {
    res.status(404).json({ error: 'Widget not found' });
    return;
  }

  const revisions = getRevisions(+req.params.id);
  const offsetNum = parseInt(offset as string, 10) || 0;
  const limitNum = parseInt(limit as string, 10) || 10;

  res.json(revisions.slice(offsetNum, offsetNum + limitNum));
});

// POST /widget/:id/revision - Create new revision for widget
router.post('/widget/:id/revision', (req: Request, res: Response) => {
  const widgetId = +req.params.id;
  const widget = getWidget(widgetId);

  if (!widget) {
    res.status(404).json({ error: 'Widget not found' });
    return;
  }

  const revisionUuid = uuidv4();
  const appearances = getAppearances(widgetId);

  const newRevision: WidgetRevisionI = {
    uuid: revisionUuid,
    createdDate: new Date().toISOString(),
    widgetId,
    userId: 1,
    published: false,
    changesSaved: true,
    payload: {
      type: widget.config.type,
      presentation: {
        type: widget.config.config?.type,
      },
      prizePoolIds: widget.config.config?.prizePoolIds || [],
      linkedTo: widget.config.linkedToVariantId ?? null,
      appearances: appearances.map(app => ({
        id: app.id,
        origin: app.origin,
        lang: app.language,
        translations: null,
        document: null,
        sync: null
      }))
    }
  };

  addRevision(widgetId, newRevision);
  updateWidget(widgetId, {
    config: { ...widget.config, revision: revisionUuid } as WidgetVariantDtoI
  });

  res.status(201).json(newRevision);
});

// GET /widget/revision/:revisionId - Get revision by UUID
router.get('/widget/revision/:revisionId', (req: Request, res: Response) => {
  const revision = getRevisionByUuid(req.params.revisionId);
  if (!revision) {
    res.status(404).json({ error: 'Revision not found' });
    return;
  }
  res.json(revision);
});

// POST /widget - Create new widget
router.post('/widget', (req: Request, res: Response) => {
  const payload = req.body;

  if (!payload.name || !payload.variant) {
    res.status(400).json({ error: 'Missing required fields: name and variant' });
    return;
  }

  const ids = getNextIds();
  const now = new Date().toISOString();
  const revisionUuid = uuidv4();

  const variant: WidgetVariantDtoI = {
    id: ids.variantId,
    formId: ids.variantId,
    config: payload.variant.config,
    appearances: payload.variant.appearances?.map((app, index: number) => ({
      id: ids.appearanceId + index,
      language: app.language,
      origin: app.origin
    })) || [],
    type: payload.variant.type,
    revision: revisionUuid,
    publishedRevision: revisionUuid,
    linkedToVariantId: payload.variant.linkedToVariantId || null
  } as WidgetVariantDtoI;

  const newWidget = createWidget({
    name: payload.name,
    publishStatus: payload.publishStatus || WidgetPublishStatus.DEBUG,
    createdDate: now,
    updatedDate: now,
    config: variant,
    variants: [variant]
  }, ids.widgetId);

  const appearances = payload.variant.appearances?.map((app, index: number) => ({
    ...app,
    id: ids.appearanceId + index
  })) || [];

  saveAppearances(newWidget.id, appearances);

  res.status(201).json({ variant, appearances });
});

// GET /project/configs - Get project configs
router.get('/project/configs', (_req: Request, res: Response) => {
  res.json(getProjectConfigs());
});

// GET /icons - Get icons by type
router.get('/icons', (req: Request, res: Response) => {
  const type = req.query.type as string | undefined;
  res.json(getIcons(type));
});

// GET /image-library - Get Image Library with paging and filters
router.get('/image-library', (req: Request, res: Response) => {
  const { search, page = '1', limit = '10', type } = req.query;

  let images = getImageLibrary();

  if (search && typeof search === 'string') {
    const searchLower = search.toLowerCase();
    images = images.filter(img => img.url.toLowerCase().includes(searchLower));
  }

  if (type === 'IMAGE') {
    images = images.filter(img => img.url.match(/\.(jpg|jpeg|png|gif|webp)$/i));
  } else if (type === 'ICON') {
    images = images.filter(img => img.url.match(/\.(svg|ico)$/i));
  }

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 10;
  const offset = (pageNum - 1) * limitNum;

  res.json({ data: images.slice(offset, offset + limitNum), total: images.length });
});

// GET /user-images - Get user uploaded images
router.get('/user-images', (req: Request, res: Response) => {
  const { page = '1', limit = '10' } = req.query;

  const images = getUserImages();
  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 10;
  const offset = (pageNum - 1) * limitNum;

  res.json({ items: images.slice(offset, offset + limitNum), total: images.length });
});

// POST /upload/image/url - Upload image by URL
router.post('/upload/image/url', (req: Request, res: Response) => {
  const { url, widgetId } = req.body;

  if (!url) {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  addUserImage(url);
  res.status(201).json({ url });
});

// POST /copy-image - Copy image by URL
router.post('/copy-image', (req: Request, res: Response) => {
  const { imageUrl, widgetId, type } = req.body;

  if (!imageUrl) {
    res.status(400).json({ error: 'Image URL is required' });
    return;
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const filename = `${uuidv4()}.jpg`;
  const newUrl = type
    ? `${baseUrl}/uploads/${type}/${filename}`
    : `${baseUrl}/uploads/${filename}`;

  addUserImage(newUrl);
  res.status(201).json({ url: newUrl });
});

// POST /translate - Mock translation service
router.post('/translate', (req: Request, res: Response) => {
  const { json, sourceLanguage, targetLanguage } = req.body;

  if (!json || !sourceLanguage || !targetLanguage) {
    res.status(400).json({ error: 'Missing required fields: json, sourceLanguage, targetLanguage' });
    return;
  }

  // Mock: prefix values with target language code
  const translateObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return `[${targetLanguage.toUpperCase()}] ${obj}`;
    }
    if (Array.isArray(obj)) {
      return obj.map(translateObject);
    }
    if (obj && typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = translateObject(value);
      }
      return result;
    }
    return obj;
  };

  res.json({ response: translateObject(json) });
});

// DELETE /file - Delete a file
router.delete('/file', (req: Request, res: Response) => {
  const { fileUrl, widgetId } = req.query;

  if (!fileUrl || typeof fileUrl !== 'string') {
    res.status(400).json({ error: 'File URL is required' });
    return;
  }

  removeUserImage(fileUrl);
  res.json({ success: true, message: 'File deleted successfully' });
});

export default router;
