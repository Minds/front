import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { Client, Upload } from '../../../../../services/api';
import { MindsActivityObject } from '../../../../../interfaces/entities';
import { Session } from '../../../../../services/session';

import { AttachmentService } from '../../../../../services/attachment';
import { ThirdPartyNetworksSelector } from '../../../../../modules/third-party-networks/selector';

@Component({
  moduleId: module.id,
  selector: 'minds-newsfeed-poster',
  inputs: [ '_container_guid: containerGuid', 'accessId', 'message' ],
  outputs: [ 'load' ],
  providers: [
    {
      provide: AttachmentService,
      useFactory: AttachmentService._,
      deps: [ Session, Client, Upload ]
    }
  ],
  templateUrl: 'poster.html'
})

export class Poster {

  content = '';
  meta: any = {
    wire_threshold: null
  };
  minds;
  load: EventEmitter<any> = new EventEmitter();
  inProgress: boolean = false;

  canPost: boolean = true;
  validThreshold: boolean = true;

  errorMessage: string = null;

  @ViewChild('thirdPartyNetworksSelector') thirdPartyNetworksSelector: ThirdPartyNetworksSelector;

  constructor(public session: Session, public client: Client, public upload: Upload, public attachment: AttachmentService) {
    this.minds = window.Minds;
  }

  set _container_guid(guid: any) {
    this.attachment.setContainer(guid);
  }

  set accessId(access_id: any) {
    this.attachment.setAccessId(access_id);
  }

  set message(value: any) {
    if (value) {
      value = decodeURIComponent((value).replace(/\+/g, '%20'));
      this.meta.message = value;
      this.getPostPreview({ value: value }); //a little ugly here!
    }
  }

  /**
   * Post to the newsfeed
   */
  post() {
    if (!this.meta.message && !this.attachment.has()) {
      return;
    }

    let data = Object.assign(this.meta, this.attachment.exportMeta());

    data = this.thirdPartyNetworksSelector.inject(data);

    this.inProgress = true;
    this.client.post('api/v1/newsfeed', data)
      .then((data: any) => {
        data.activity.boostToggle = true;
        this.load.next(data.activity);
        this.attachment.reset();
        this.meta = { wire_threshold: null };
        this.inProgress = false;
      })
      .catch((e) => {
        this.inProgress = false;
        alert(e.message);
      });
  }

  uploadAttachment(file: HTMLInputElement, event) {
    if (file.value) { // this prevents IE from executing this code twice
      this.canPost = false;
      this.inProgress = true;
      this.errorMessage = null;

      this.attachment.upload(file)
        .then(guid => {
          this.inProgress = false;
          this.canPost = true;
          file.value = null;
        })
        .catch(e => {
          if (e && e.message) {
            this.errorMessage = e.message;
          }
          this.inProgress = false;
          this.canPost = true;
          file.value = null;
          this.attachment.reset();
        });
    }
  }

  removeAttachment(file: HTMLInputElement) {
    this.canPost = false;
    this.inProgress = true;

    this.errorMessage = '';

    this.attachment.remove(file).then(() => {
      this.inProgress = false;
      this.canPost = true;
      file.value = '';
    }).catch(e => {
      console.error(e);
      this.inProgress = false;
      this.canPost = true;
    });
  }

  getPostPreview(message) {
    if (!message.value) {
      return;
    }

    this.attachment.preview(message.value);
  }
}
