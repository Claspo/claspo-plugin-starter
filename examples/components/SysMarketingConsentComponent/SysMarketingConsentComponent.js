import ComponentManifest from "./SysMarketingConsent.manifest";
import SysConsentComponent from "../SysConsentComponent/SysConsentComponent";

export default class SysMarketingConsentComponent extends SysConsentComponent {
  static define = {
    name: 'sys-marketing-consent',
    model: ComponentManifest.name,
    manifest: ComponentManifest,
  };
  manifest = ComponentManifest;
}
