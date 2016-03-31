import { Inject } from 'angular2/core';
import { Client, Upload } from './api';
import { SessionFactory } from './session';

export class AttachmentService {

  private meta: any = {};
  private attachment: any = {};

  private container: any = {};
  private accessId: any = 2;

  private previewTimeout: any = null;

  public session = SessionFactory.build();

  constructor(@Inject(Client) public clientService: Client, @Inject(Upload) public uploadService: Upload) {
    this.reset();
  }

  load(object: any) {
    if (!object) {
      return;
    }

    this.reset();

    if (object.perma_url) {
      this.meta.is_rich = true;
      this.meta.thumbnail = object.thumbnail_src || '';
      this.meta.title = object.title || '';
      this.meta.url = object.perma_url || '';
      this.meta.description = object.description || '';
    }

    if (object.attachment_guid) {
      this.meta.attachment_guid = object.attachment_guid;

      if (object.custom_data && object.custom_data.thumbnail_src) {
        this.attachment.preview = object.custom_data.thumbnail_src;
      }

      if (object.custom_data && object.custom_data[0] && object.custom_data[0].src) {
        this.attachment.preview = object.custom_data[0].src;
      }
    }

    this.meta.mature = this.parseMaturity(object);
  }

  setContainer(container: any) {
    if ((typeof container === 'string') || typeof container === 'number') {
      this.container = { guid: container };
    } else {
      this.container = container;
    }

    this.meta.container_guid = this.container.guid;

    return this;
  }

  getContainer() {
    return this.container;
  }

  setAccessId(access_id) {
    this.accessId = access_id;

    return this;
  }

  getAccessId() {
    return this.accessId;
  }

  setMature(mature) {
    this.meta.mature = !!mature;

    return this;
  }

  isMature() {
    return !!this.meta.mature;
  }

  toggleMature() {
    return this.setMature(!this.isMature());
  }

  upload(fileInput: HTMLInputElement) {
    this.attachment.progress = 0;
    this.attachment.mime = '';

    let file = fileInput ? fileInput.files[0] : null;

    if (!file) {
      return Promise.reject(null);
    }

    // Preview
    if (file.type && file.type.indexOf('video/') === 0){
      this.attachment.mime = 'video';
    } else if (file.type && file.type.indexOf('image/') === 0) {
      this.attachment.mime = 'image';
    } else {
      this.attachment.mime = 'unknown';
    }

    let reader = new FileReader();
    reader.onloadend = () => {
      this.attachment.preview = reader.result;
    };
    reader.readAsDataURL(file);

    // Upload and return the GUID
    return this.uploadService.post('api/v1/archive', [ file ], this.meta, (progress) => {
      this.attachment.progress = progress;
    })
    .then((response: any) => {
      this.meta.attachment_guid = response.guid ? response.guid : null;

      if (!this.meta.attachment_guid) {
        throw 'No GUID';
      }

      return this.meta.attachment_guid;
    })
    .catch(e => {
      this.meta.attachment_guid = null;
      this.attachment.progress = 0;
      this.attachment.preview = null;

      throw e;
    });
  }

  remove(fileInput: HTMLInputElement) {
    this.attachment.progress = 0;
    this.attachment.preview = null;

    if (!this.meta.attachment_guid) {
      return Promise.reject('No GUID');
    }

    return this.clientService.delete('api/v1/archive/' + this.meta.attachment_guid)
    .then(() => {
      this.meta.attachment_guid = null;
    })
    .catch(e => {
      this.meta.attachment_guid = null;

      throw e;
    });
  }

  has() {
    return !!this.meta.attachment_guid;
  }

  hasFile() {
    return !!this.attachment.preview || this.getMime() == 'video';
  }

  getUploadProgress() {
    return this.attachment.progress ? this.attachment.progress : 0;
  }

  getPreview() {
    return this.attachment.preview;
  }

  getMime() {
    return this.attachment.mime;
  }

  isRich() {
    return !!this.meta.is_rich;
  }

  getMeta() {
    return this.meta;
  }

  exportMeta() {
    let result = {};

    for (var prop in this.meta) {
      if (this.meta.hasOwnProperty(prop)) {
        result[prop] = this.meta[prop];
      }
    }

    return result;
  }

  reset() {
    this.attachment = {
      preview: null,
      progress: 0,
      mime: '',
      richUrl: null
    };

    this.meta = {
      is_rich: false,
      title: '',
      description: '',
      thumbnail: '',
      url: '',
      attachment_guid: null,
      mature: false,
      container_guid: this.getContainer().guid,
      access_id: this.getAccessId()
    };
  }

  resetRich() {
    this.meta.is_rich = false;
    this.meta.thumbnail = '';
    this.meta.title = '';
    this.meta.url = '';
    this.meta.description = '';
  }

  preview(content: string) {

    let match = content.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig),
      url;

    if (!match) {
      return;
    }

    if (match instanceof Array) {
      url = match[0];
    } else {
      url = match;
    }

    if (!url.length) {
      return;
    }

    if (url == this.attachment.richUrl) {
      return;
    }

    this.meta.is_rich = true;

    if (this.previewTimeout) {
      clearTimeout(this.previewTimeout);
    }

    this.attachment.richUrl = url;

    this.previewTimeout = window.setTimeout(() => {
      this.resetRich();
      this.meta.is_rich = true;

      this.clientService.get('api/v1/newsfeed/preview', { url })
      .then((data: any) => {

        if (!data) {
          this.resetRich();
          return;
        }

        this.meta.title = data.meta.title;
        this.meta.url = data.meta.canonical;
        this.meta.description = data.meta.description;

        for (var link of data.links) {
          if (link.rel.indexOf('thumbnail') > -1) {
            this.meta.thumbnail = link.href;
          }
        }
      })
      .catch(e => {
        this.resetRich();
      });
    }, 600);
  }

  parseMaturity(object: any) {

    if (typeof object === 'undefined') {
      return false;
    }

    if (typeof object.mature !== 'undefined') {
      return !!object.mature;
    }

    if (typeof object.flags !== 'undefined') {
      return !!object.flags.mature;
    }

    if (typeof object.custom_data !== 'undefined' && typeof object.custom_data[0] !== 'undefined') {
      return !!object.custom_data[0].mature;
    }

    if (typeof object.custom_data !== 'undefined') {
      return !!object.custom_data.mature;
    }

    return false;
  }

  isForcefullyShown(object: any) {
    if (!object) {
      return false;
    }

    if (object.mature_visibility) {
      return true;
    }

    return false;
  }

  shouldBeBlurred(object: any) {

    if (!object) {
      return false;
    }

    if (typeof object.mature_visibility === 'undefined') {
      let user = this.session.getLoggedInUser();

      if (
        user &&
        this.parseMaturity(object) &&
        (user.mature || user.guid == object.owner_guid)
      ) {
        object.mature_visibility = true;
      }
    }

    if (this.isForcefullyShown(object)) {
      return false;
    }

    return this.parseMaturity(object);
  }
}
