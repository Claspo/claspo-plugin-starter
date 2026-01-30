import { WidgetPublishStatus, WidgetVariantDtoI, WidgetAppearanceI } from '@claspo/editor';

export type SimplifiedWidgetConfigI = Omit<WidgetVariantDtoI, 'appearances'>;

export interface SimplifiedWidgetModelI {
  id: number;
  name: string;
  publishStatus: WidgetPublishStatus;
  createdDate: string;
  updatedDate: string;
  config: SimplifiedWidgetConfigI;
  appearances: WidgetAppearanceI[];
}
