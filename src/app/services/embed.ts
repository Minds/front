export class EmbedService {

  static _() {
    return new EmbedService();
  }

  getIframeFromObject(object: any) {
    if (typeof object !== 'object') {
      return '';
    }

    let embeddable = ['object:video'];

    if (embeddable.indexOf(`${object.type}:${object.subtype}`) > -1) {
      return this.getIframe(object.guid);
    }

    if (object.custom_type === 'video') {
      return this.getIframe(object.custom_data.guid);
    }

    return '';
  }

  getIframe(guid: string, opts: any = {}) {
    if (!guid) {
      return '';
    }

    let width = opts.width || 640,
      height = opts.height || 320;

    return `<iframe src="${this.getUrl(guid)}" width="${width}" height="${height}" frameborder="0" allowfullscreen="1"></iframe>`;
  }

  getUrl(guid: string) {
    return `${window.Minds.site_url}api/v1/embed/${guid}`;
  }

}
