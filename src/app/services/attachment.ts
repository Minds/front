import { Inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, tap, last } from 'rxjs/operators';

import { Client, Upload } from './api';
import { Session } from './session';
import { ConfigsService } from '../common/services/configs.service';
import { TextParserService } from '../common/services/text-parser.service';
import { VIDEO_PERMISSIONS_ERROR_MESSAGE } from '../common/services/permissions.service';
import { PermissionsEnum } from '../../graphql/generated.engine';
import { PermissionIntentsService } from '../common/services/permission-intents.service';

@Injectable()
export class AttachmentService {
  readonly maxVideoFileSize: number;
  readonly maxVideoLength: number;

  public meta: any = {};
  private attachment: any = {};

  public progress: BehaviorSubject<number> = new BehaviorSubject(0);
  public response: BehaviorSubject<HttpEvent<any>>;
  private uploadSubscription: Subscription;

  private container: any = {};
  private accessId: any = 2;

  private previewTimeout: any = null;

  private pendingDelete: boolean = false;

  private xhr: XMLHttpRequest = null;
  private previewRequests: string[] = [];

  constructor(
    public session: Session,
    public clientService: Client,
    public uploadService: Upload,
    private http: HttpClient,
    public textParser: TextParserService,
    private permissionIntentsService: PermissionIntentsService,
    configs: ConfigsService
  ) {
    this.maxVideoFileSize = configs.get('max_video_file_size');
    this.maxVideoLength = configs.get('max_video_length');
    this.reset();
  }

  load(object: any) {
    if (!object) {
      return;
    }

    this.reset();

    if (object.perma_url) {
      this.meta.is_rich = 1;
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

      if (
        object.custom_data &&
        object.custom_data[0] &&
        object.custom_data[0].src
      ) {
        this.attachment.preview = object.custom_data[0].src;
      }
    }

    this.meta.mature = this.parseMaturity(object);
  }

  setContainer(container: any) {
    if (typeof container === 'string' || typeof container === 'number') {
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

  isPendingDelete() {
    return this.pendingDelete;
  }

  setPendingDelete(value: boolean) {
    this.pendingDelete = value;
  }

  setAccessId(access_id) {
    this.accessId = access_id;
    this.meta.access_id = access_id;
    return this;
  }

  getAccessId() {
    return this.accessId;
  }

  setHidden(hidden) {
    this.meta.hidden = hidden ? 1 : 0;
  }

  isHidden() {
    return !!this.meta.hidden;
  }

  setMature(mature) {
    this.meta.mature = mature ? 1 : 0;

    return this;
  }

  isMature() {
    return !!this.meta.mature;
  }

  toggleMature() {
    return this.setMature(!this.isMature());
  }

  setNSFW(nsfw) {
    this.meta.nsfw = nsfw.map((reason) => reason.value);
  }

  async upload(file: HTMLInputElement | File, detectChangesFn?: Function) {
    this.reset();

    this.progress.next(0);
    this.attachment.progress = 0;
    this.attachment.mime = '';

    file = file instanceof HTMLInputElement ? file.files[0] : file;

    if (!file) {
      return Promise.reject(null);
    }

    if (this.xhr) {
      this.xhr.abort();
    }
    this.xhr = new XMLHttpRequest();

    // Set the mimetype of the attachment (this.attachment.mime)
    await this.checkFileType(file);

    try {
      if (this.attachment.mime === 'video') {
        let response = await (<any>this.uploadToS3(file));
        this.meta.attachment_guid = response.guid ? response.guid : null;
      } else {
        // Upload and return the GUID
        let response = await (<any>this.uploadService.post(
          'api/v1/media',
          [file],
          this.meta,
          (progress) => {
            this.attachment.progress = progress;
            this.progress.next(progress);
            if (detectChangesFn) {
              detectChangesFn();
            }
          },
          this.xhr
        ));
        this.meta.attachment_guid = response.guid ? response.guid : null;
      }

      if (!this.meta.attachment_guid) {
        throw 'No GUID';
      }

      return this.meta.attachment_guid;
    } catch (e) {
      this.meta.attachment_guid = null;
      this.attachment.progress = 0;
      this.progress.next(0);
      this.attachment.preview = null;

      return Promise.reject(e);
    }
  }

  async uploadToS3(file) {
    // Prepare the upload
    let { lease } = await (<any>(
      this.clientService.put(
        `api/v2/media/upload/prepare/${this.attachment.mime}`
      )
    ));

    const headers = new HttpHeaders({
      'Content-Type': file.type,
      'Ngsw-Bypass': '1',
    });
    const req = new HttpRequest('PUT', lease.presigned_url, file, {
      headers: headers,
      reportProgress: true, //This is required for track upload process
    });

    // Upload directly to S3
    const upload$ = this.http.request(req);

    // Track upload progress &&
    const uploadProgress$ = upload$.pipe(
      map((event: HttpEvent<any>, file) => {
        switch (event.type) {
          case HttpEventType.Sent:
            return 0;
          case HttpEventType.UploadProgress:
            return Math.round((100 * event.loaded) / event.total);
          case HttpEventType.Response:
            return 100;
          default:
            return -1;
        }
      })
    );

    if (this.uploadSubscription) this.uploadSubscription.unsubscribe();

    this.uploadSubscription = uploadProgress$.subscribe((pct) => {
      if (pct >= 0) this.progress.next(pct);
    });

    // wait for completion
    await uploadProgress$.pipe(last()).toPromise();

    await this.clientService.put(
      `api/v2/media/upload/complete/${lease.media_type}/${lease.guid}`
    );
    return lease;
  }

  abort() {
    if (this.xhr) {
      if (this.uploadSubscription) {
        this.uploadSubscription.unsubscribe();
      }
      this.xhr.abort();
      this.xhr = null;

      this.progress.next(0);
      this.attachment.progress = 0;
      this.attachment.mime = '';
      this.attachment.preview = null;
    }
  }

  remove() {
    this.progress.next(0);
    this.attachment.progress = 0;
    this.attachment.mime = '';
    this.attachment.preview = null;

    if (!this.meta.attachment_guid) {
      return Promise.reject('No GUID');
    }

    return this.clientService
      .delete('api/v1/media/' + this.meta.attachment_guid)
      .then(() => {
        this.meta.attachment_guid = null;
      })
      .catch((e) => {
        this.meta.attachment_guid = null;

        throw e;
      });
  }

  has() {
    return !!this.meta.attachment_guid || this.isRich();
  }

  hasFile() {
    return !!this.attachment.preview || this.getMime() === 'video';
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
    this.progress.next(0);
    this.attachment = {
      preview: null,
      progress: 0,
      mime: '',
      richUrl: null,
    };

    this.meta = {
      is_rich: 0,
      title: '',
      description: '',
      thumbnail: '',
      url: '',
      attachment_guid: null,
      mature: 0,
      container_guid: this.getContainer().guid,
      access_id: this.getAccessId(),
      nsfw: this.meta.nsfw,
    };
  }

  resetRich() {
    this.meta.is_rich = 0;
    this.meta.thumbnail = '';
    this.meta.title = '';
    this.meta.url = '';
    this.meta.description = '';
  }

  /**
   * Resets preview requests to null.
   */
  resetPreviewRequests(): AttachmentService {
    this.previewRequests = [];
    return this;
  }

  /**
   * Returns preview requests.
   */
  getPreviewRequests(): string[] {
    return this.previewRequests;
  }

  /**
   * Adds a new preview request.
   * @param { string } url -
   */
  addPreviewRequest(url: string): AttachmentService {
    this.previewRequests.push(url);
    return this;
  }

  /**
   * Gets attachment preview from content.
   * @param { string } content - Content to be parsed for preview URL.
   * @param { Function } detectChangesFn - Function to be ran on change emission.
   * @returns void.
   */
  preview(content: string, detectChangesFn?: Function): void {
    let match = this.textParser.extractUrls(content),
      url;

    if (!match) {
      return;
    }

    if (this.attachment.preview) {
      return;
    }

    if (match instanceof Array) {
      url = match[0];
    } else {
      url = match;
    }

    if (!url || !url.length) {
      return;
    }

    url = this.textParser.prependHttps(url);

    if (url === this.attachment.richUrl) {
      return;
    }

    this.meta.is_rich = 1;

    if (this.previewTimeout) {
      clearTimeout(this.previewTimeout);
    }

    this.attachment.richUrl = url;
    this.addPreviewRequest(url);

    if (detectChangesFn) detectChangesFn();

    this.previewTimeout = window.setTimeout(() => {
      this.resetRich();
      this.meta.is_rich = 1;

      if (detectChangesFn) detectChangesFn();

      this.clientService
        .get('api/v1/newsfeed/preview', { url })
        .then((data: any) => {
          if (!data || this.getPreviewRequests().length < 1) {
            this.resetRich();
            if (detectChangesFn) detectChangesFn();
            return;
          }

          if (data.meta) {
            this.meta.url = url;
            this.meta.title = data.meta.title || this.meta.url;
            this.meta.description = data.meta.description || '';
          } else {
            this.meta.url = url;
            this.meta.title = url;
          }

          if (data.links && data.links.thumbnail && data.links.thumbnail[0]) {
            this.meta.thumbnail = data.links.thumbnail[0].href;
          }

          if (detectChangesFn) detectChangesFn();
        })
        .catch((e) => {
          this.resetRich();
          if (detectChangesFn) detectChangesFn();
        });
    }, 600);
  }

  parseMaturity(object: any) {
    if (typeof object === 'undefined') {
      return false;
    }

    if (typeof object.nsfw !== 'undefined') {
      let res = [1, 2, 4].filter((nsfw) => {
        return object.nsfw.indexOf(nsfw) > -1;
      }).length;
      if (res) return true;
    }

    if (typeof object.flags !== 'undefined') {
      return !!object.flags.mature;
    }

    if (typeof object.mature !== 'undefined') {
      return !!object.mature;
    }

    if (
      typeof object.custom_data !== 'undefined' &&
      typeof object.custom_data[0] !== 'undefined'
    ) {
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

      if (user && this.parseMaturity(object) && user.mature) {
        object.mature_visibility = true;
      }
    }

    if (this.isForcefullyShown(object)) {
      return false;
    }

    return this.parseMaturity(object);
  }

  private checkFileType(file): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      if (file.type && file.type.indexOf('video/') === 0) {
        if (
          !this.permissionIntentsService.checkAndHandleAction(
            PermissionsEnum.CanUploadVideo
          )
        ) {
          throw new Error(VIDEO_PERMISSIONS_ERROR_MESSAGE);
        }

        const maxFileSize = this.maxVideoFileSize;
        if (file.size > maxFileSize) {
          throw new Error(
            `File exceeds ${
              maxFileSize / Math.pow(1000, 3)
            }GB maximum size. Please try compressing your file.`
          );
        }

        this.attachment.mime = 'video';

        this.checkVideoDuration(file)
          .then((duration: number) => {
            let maxVideoLength = this.maxVideoLength;
            if (this.session.getLoggedInUser().plus) {
              maxVideoLength = this.maxVideoLength * 3; // Hacky
            }
            if (duration > maxVideoLength) {
              return reject({
                message:
                  'Error: Video duration exceeds ' +
                  this.maxVideoLength / 60 +
                  ' minutes',
              });
            }

            resolve();
          })
          .catch((error) => {
            resolve(); //resolve regardless and forward to backend job
            //reject(error);
          });
      } else if (file.type && file.type.indexOf('image/') === 0) {
        this.attachment.mime = 'image';

        let reader = new FileReader();

        reader.onloadend = () => {
          this.attachment.preview = reader.result;
          resolve();
        };
        reader.readAsDataURL(file);
      } else {
        this.attachment.mime = 'unknown';
        reject({ message: 'Invalid file type' });
      }
    });
  }

  private checkVideoDuration(file) {
    return new Promise((resolve, reject) => {
      const videoElement = document.createElement('video');
      let timeout: number = 0;
      videoElement.preload = 'metadata';
      videoElement.onloadedmetadata = function () {
        if (timeout !== 0) window.clearTimeout(timeout);

        window.URL.revokeObjectURL(videoElement.src);
        resolve(videoElement.duration);
      };
      videoElement.addEventListener('error', function (error) {
        if (timeout !== 0) window.clearTimeout(timeout);

        window.URL.revokeObjectURL(this.src);
        reject({ message: 'Error: Video format not supported' });
      });

      videoElement.src = URL.createObjectURL(file);

      // bypass the 'onloadendmetadata' event, which sometimes does never get called in IE
      timeout = window.setTimeout(() => {
        resolve(0); // 0 so it's less windows.Minds.max_video_length
      }, 5000);
    });
  }
}
