import type {ClDocumentI} from '@claspo/common/document/Document.interface';
import {WidgetInitConfigI} from '@claspo/common/WidgetInitConfig.interface';
import {SimplifiedWidgetModelI} from '../../../shared/types';

const STATIC_RESOURCES_URL = import.meta.env.VITE_STATIC_RESOURCES_URL || 'http://localhost:9590/';
const API_URL = '/';

export function createRendererConfig(widget: SimplifiedWidgetModelI): WidgetInitConfigI {
  const documentModel = JSON.parse(widget.appearances[0].document) as ClDocumentI;

  return {
    layoutType: widget.config.config.type,
    widgetType: widget.config.type,
    documentModel,
    hostUrl: API_URL,
    subscribeContactUrl: `${API_URL}/subscribe`,
    staticResourcesUrl: STATIC_RESOURCES_URL,
    disableGlobalScroll: true,
  };
}
