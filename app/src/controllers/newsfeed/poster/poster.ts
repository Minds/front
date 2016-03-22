import { Component, EventEmitter } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { ROUTER_DIRECTIVES } from 'angular2/router';

import { Client, Upload } from '../../../services/api';
import { MDL_DIRECTIVES } from '../../../directives/material';
import { AutoGrow } from '../../../directives/autogrow';
import { InfiniteScroll } from '../../../directives/infinite-scroll';
import { MindsActivityObject } from '../../../interfaces/entities';
import { SessionFactory } from '../../../services/session';

import { AttachmentService } from '../../../services/attachment';

@Component({
  selector: 'minds-newsfeed-poster',
  inputs: [ '_container_guid: containerGuid', 'accessId', 'message'],
  outputs: ['load'],
  templateUrl: 'src/controllers/newsfeed/poster/poster.html',
  directives: [ MDL_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES, AutoGrow, InfiniteScroll ],
  bindings: [ AttachmentService ]
})

export class Poster {

  content = '';
  session = SessionFactory.build();
  minds;
  load: EventEmitter<any> = new EventEmitter();
  inProgress : boolean = false;

  canPost : boolean = true;

  constructor(public client: Client, public upload: Upload, public attachment: AttachmentService){
    this.minds = window.Minds;
  }

  set _container_guid(guid: any){
    this.attachment.setContainer({ guid });
  }

  set accessId(access_id: any){
    this.attachment.setAccessId(access_id);
  }

  set message(value : any){
    if(value){
      value = decodeURIComponent((value).replace(/\+/g, '%20'));
      this.postMeta.message = value;
      this.getPostPreview({value: value}); //a little ugly here!
    }
  }

	/**
	 * Post to the newsfeed
	 */
	post(){
    if (!this.content && !this.attachment.has()) {
      return;
    }

    let data = this.attachment.exportMeta();
    data['message'] = this.content;

    this.inProgress = true;
    this.client.post('api/v1/newsfeed', data)
    .then((data : any) => {
      data.activity.boostToggle = true;
      this.load.next(data.activity);
      this.attachment.reset();
      this.content = '';
      this.inProgress = false;
    })
    .catch(function(e){
      this.inProgress = false;
    });
  }

  uploadAttachment(file: HTMLInputElement) {
    this.canPost = false;
    this.inProgress = true;

    this.attachment.upload(file)
    .then(guid => {
      this.inProgress = false;
      this.canPost = true;
    })
    .catch(e => {
      console.error(e);
      this.inProgress = false;
      this.canPost = true;
    });
  }

  removeAttachment(file: HTMLInputElement) {
    this.canPost = false;
    this.inProgress = true;

    this.attachment.remove(file).then(() => {
      this.inProgress = false;
      this.canPost = true;
      file.value = "";
    }).catch(e => {
      console.error(e);
      this.inProgress = false;
      this.canPost = true;
    });
  }

  getPostPreview(message){
    if (!message.value) {
      return;
    }

    this.attachment.preview(message.value);
  }
}
