import ComponentManifest from "./SysDataConsent.manifest";
import SysConsentComponent from "../SysConsentComponent/SysConsentComponent";

export default class SysDataConsentComponent extends SysConsentComponent {
  static define = {
    name: 'sys-data-consent',
    model: ComponentManifest.name,
    manifest: ComponentManifest,
  };
  manifest = ComponentManifest;
}
