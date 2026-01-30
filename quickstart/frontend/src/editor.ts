import {EditorI} from '@claspo/editor';
import {createEditorConfig, EDITOR_SCRIPTS_URL} from './config/editor-config';
import {showSnackbar} from './utils/snackbar';
import {SimplifiedWidgetModelI} from "../../shared/types";

const WIDGET_ID = 1;

declare global {
  interface Window {
    ClaspoEditor: EditorI;
  }
}

async function loadWidget(widgetId: number): Promise<SimplifiedWidgetModelI> {
  const response = await fetch(`/api/simplified/widget/${widgetId}`);

  if (!response.ok) {
    throw new Error(`Failed to load widget: ${response.status}`);
  }

  return await response.json();
}

try {
  const widget = await loadWidget(WIDGET_ID);
  const teaser = widget.config.linkedToVariantId
    && await loadWidget(widget.config.linkedToVariantId);

  const containerElement = document.getElementById('editorContainerElement');

  if (!containerElement) {
    throw new Error('Editor container element not found');
  }

  const config = createEditorConfig(
    containerElement,
    widget,
    teaser,
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
