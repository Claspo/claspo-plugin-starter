import {EditorI, WidgetAppearanceI, WidgetModelI} from '@claspo/editor';
import {createEditorConfig, EDITOR_SCRIPTS_URL} from './config/editor-config';
import {showSnackbar} from './utils/snackbar';

const WIDGET_ID = 1;

declare global {
  interface Window {
    ClaspoEditor: EditorI;
  }
}

async function loadWidget(widgetId: number): Promise<WidgetModelI> {
  const response = await fetch(`/api/widget/${widgetId}`);

  if (!response.ok) {
    throw new Error(`Failed to load widget: ${response.status}`);
  }

  return await response.json();
}

async function loadWidgetAppearances(widgetId: number): Promise<WidgetAppearanceI[]> {
  const response = await fetch(`/api/widget/${widgetId}/appearances`);

  if (!response.ok) {
    throw new Error(`Failed to load widget appearances: ${response.status}`);
  }

  return await response.json();
}

try {
  const widget = await loadWidget(WIDGET_ID);
  const teaser = widget.config.linkedToVariantId
    && await loadWidget(widget.config.linkedToVariantId);
  const widgetAppearances = await loadWidgetAppearances(WIDGET_ID);
  const teaserAppearances = widget.config.linkedToVariantId
    && await loadWidgetAppearances(widget.config.linkedToVariantId);

  const containerElement = document.getElementById('editorContainerElement');

  if (!containerElement) {
    throw new Error('Editor container element not found');
  }

  const config = createEditorConfig(
    containerElement,
    widget,
    widgetAppearances,
    teaser,
    teaserAppearances,
  );

  const script = document.createElement('script');
  script.src = `${EDITOR_SCRIPTS_URL}/activator.js`;
  script.onload = () => {
    window.ClaspoEditor.init(
      config,
      () => {
        console.log('Editor loaded');
        showSnackbar('Editor loaded', 'success');
      },
      (...args: unknown[]) => {
        console.log('Editor load failed', ...args);
        showSnackbar('Editor load failed', 'error');
      }
    );
  };

  document.body.appendChild(script);
} catch (error) {
  console.error('Failed to initialize editor:', error);
  showSnackbar('Failed to load widget data', 'error');
}
