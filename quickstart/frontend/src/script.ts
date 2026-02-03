import StaticDocumentConnector from '@claspo/document-connector/StaticDocumentConnector';
import type { ClDocumentI } from '@claspo/common/document/Document.interface';
import { createRendererConfig } from './config/renderer-config';
import {SimplifiedWidgetModelI} from '../../shared/types';

const WIDGET_ID = 1;

type ConnectorEventData = {
  data?: unknown;
};

async function loadWidget(widgetId: number): Promise<SimplifiedWidgetModelI> {
  const response = await fetch(`/api/simplified/widget/${widgetId}`);
  if (!response.ok) {
    throw new Error(`Failed to load widget: ${response.status}`);
  }
  return response.json();
}

async function initRenderer(): Promise<void> {
  try {
    const widget = await loadWidget(WIDGET_ID);
    const config = createRendererConfig(widget);
    const connector = new StaticDocumentConnector(config);

    await connector.connect(document.body);

    const destroyPreview = () => connector.disconnect();

    connector.on('CLOSE_WIDGET', destroyPreview);
    connector.on('CLOSE_ICON_CLICKED', destroyPreview);
    connector.on('CONTACT_DATA_SUBMIT', ({ data }: ConnectorEventData) => {
      console.log('CONTACT_DATA_SUBMIT', data);
    });
  } catch (error) {
    console.error('Failed to initialize renderer:', error);
  }
}

initRenderer();
