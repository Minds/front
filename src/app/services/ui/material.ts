export class Material {
  static rebuild() {
    window.componentHandler.upgradeDom();
  }
  static updateElement(element: any) {
    if (window.componentHandler)
      window.componentHandler.upgradeElement(element);
  }
}
