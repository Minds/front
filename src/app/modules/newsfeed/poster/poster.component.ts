import { Component, EventEmitter, ViewChild } from '@angular/core';
import { Session } from '../../../services/session';

import { AttachmentService } from '../../../services/attachment';
import { ThirdPartyNetworksSelector } from '../../third-party-networks/selector';
import { Upload } from '../../../services/api/upload';
import { Client } from '../../../services/api/client';
import { HashtagsSelectorComponent } from '../../hashtags/selector/selector.component';
import { Tag } from '../../hashtags/types/tag';

@Component({
  moduleId: module.id,
  selector: 'minds-newsfeed-poster',
  inputs: ['_container_guid: containerGuid', 'accessId', 'message'],
  outputs: ['load'],
  providers: [
    {
      provide: AttachmentService,
      useFactory: AttachmentService._,
      deps: [Session, Client, Upload]
    }
  ],
  templateUrl: 'poster.component.html',
})

export class PosterComponent {

  content = '';
  meta: any = {
    message : '',
    wire_threshold: null
  };
  tags = [];  
  minds;
  load: EventEmitter<any> = new EventEmitter();
  inProgress: boolean = false;

  canPost: boolean = true;
  validThreshold: boolean = true;
  tooManyTags: boolean = false;

  errorMessage: string = null;

  @ViewChild('thirdPartyNetworksSelector') thirdPartyNetworksSelector: ThirdPartyNetworksSelector;
  @ViewChild('hashtagsSelector') hashtagsSelector: HashtagsSelectorComponent;

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
      this.showTagsError();
      this.getPostPreview({ value: value }); //a little ugly here!
    }
  }

  onMessageChange($event) {
    this.errorMessage = "";
    this.meta.message = $event;

    const regex = /(^|\s||)#(\w+)/gim;
    this.tags = [];
    let match;

    while ((match = regex.exec(this.meta.message)) !== null) {
      this.tags.push(match[2]);
    }
  }

  onTagsChange(tags: string[]) {
    if (this.hashtagsSelector.tags.length > 5) {
      this.errorMessage = "You can only select up to 5 hashtags";
      this.tooManyTags = true;
    } else {
      this.tooManyTags = false;
      if (this.errorMessage === "You can only select up to 5 hashtags") {
        this.errorMessage = '';
      }
    }
  }

  showTagsError() {
    if (this.tags.length > 5) {
      this.errorMessage = 'You can only select up to 5 hashtags';
      this.tooManyTags = true;
    } else {
      this.tooManyTags = false;
    }
  }

  onTagsAdded(tags: Tag[]) {
    for (let tag of tags) {
      this.meta.message += ` #${tag.value}`;
    }
  }

  onTagsRemoved(tags: Tag[]) {
    for (let tag of tags) {
      this.meta.message = this.meta.message.replace('#' + tag.value, tag.value);
    }
  }

  /**
   * Post to the newsfeed
   */
  post() {
    if (!this.meta.message && !this.attachment.has()) {
      return;
    }
    if (this.hashtagsSelector.tags.length > 5) {
      this.showTagsError();
      return;
    }

    this.errorMessage = "";

    let data = Object.assign(this.meta, this.attachment.exportMeta());

    data = this.thirdPartyNetworksSelector.inject(data);
    data.tags = this.tags;

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
          if (this.attachment.isPendingDelete()) {
            this.removeAttachment(file);
          }
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

  removeRichEmbed() {
    this.attachment.reset();
  }

  removeAttachment(file: HTMLInputElement) {
    if (this.inProgress) {
      this.attachment.abort();
      this.canPost = true;
      this.inProgress = false;
      this.errorMessage = '';
      return;
    }
    // if we're not uploading a file right now
    this.attachment.setPendingDelete(false);
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

  async findTrendingHashtags(searchText: string) {
    const response: any = await this.client.get('api/v2/search/suggest/tags', { q: searchText });
    return response.tags
      .filter(item => item.toLowerCase().includes(searchText.toLowerCase()))
      .slice(0, 5);
  }

  getChoiceLabel(text: string) {
    return `#${text}`;
  }
}
