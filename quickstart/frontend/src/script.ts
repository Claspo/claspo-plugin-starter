import StaticDocumentConnector from '@claspo/document-connector/StaticDocumentConnector';
import type { ClDocumentI } from '@claspo/common/document/Document.interface';
import { createRendererConfig } from './config/renderer-config';
import {WidgetAppearanceI, WidgetModelI} from '@claspo/editor';

const WIDGET_ID = 1;

type ConnectorEventData = {
  data?: unknown;
};

async function loadAppearances(): Promise<WidgetAppearanceI[]> {
  const response = await fetch(`/api/widget/${WIDGET_ID}/appearances`);
  if (!response.ok) {
    throw new Error(`Failed to load widget: ${response.status}`);
  }
  return response.json();
}

async function loadWidget(): Promise<WidgetModelI> {
  const response = await fetch(`/api/widget/${WIDGET_ID}`);
  if (!response.ok) {
    throw new Error(`Failed to load widget: ${response.status}`);
  }
  return response.json();
}

async function initRenderer(): Promise<void> {
  try {
    const appearances = await loadAppearances();
    const widget = await loadWidget();
    const documentModel = JSON.parse(appearances[0].document) as ClDocumentI;

    const config = createRendererConfig(widget, documentModel);
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
