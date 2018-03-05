export class AnchorPosition {
  static getFixed(element: HTMLElement, anchor: string[]) {
    if (!element.getClientRects().length) {
      // dettached DOM element
      return false;
    }

    let rect = element.getBoundingClientRect();

    if (typeof rect.top === 'undefined') {
      return false;
    }

    let result: any = {
        top: 'auto',
        right: 'auto',
        bottom: 'auto',
        left: 'auto'
      };

    if (anchor.indexOf('right') > -1) {
      result.right = window.innerWidth - rect.right;
    } else { // Default: 'left'
      result.left = rect.left;
    }

    if (anchor.indexOf('top') > -1) {
      result.bottom = window.innerHeight - rect.top;
    } else { // Default: 'bottom'
      result.top = rect.top + rect.height;
    }

    return result;
  }
}
