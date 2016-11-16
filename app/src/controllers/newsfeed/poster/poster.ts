import { Component, EventEmitter, ViewChild } from '@angular/core';

import { Client, Upload } from '../../../services/api';
import { MindsActivityObject } from '../../../interfaces/entities';
import { SessionFactory } from '../../../services/session';

import { AttachmentService } from '../../../services/attachment';
import { ThirdPartyNetworksSelector } from '../../../components/third-party-networks/selector';

@Component({
  moduleId: module.id,
  selector: 'minds-newsfeed-poster',
  inputs: [ '_container_guid: containerGuid', 'accessId', 'message'],
  outputs: ['load'],
  templateUrl: 'poster.html'
})

export class Poster {

  content = '';
  session = SessionFactory.build();
  minds;
  load: EventEmitter<any> = new EventEmitter();
  inProgress : boolean = false;

  canPost: boolean = true;

  @ViewChild('thirdPartyNetworksSelector') thirdPartyNetworksSelector: ThirdPartyNetworksSelector;

  constructor(public client: Client, public upload: Upload, public attachment: AttachmentService){
    this.attachment = AttachmentService._(client, upload); //use a new instance
    this.minds = window.Minds;
  }

  set _container_guid(guid: any){
    this.attachment.setContainer(guid);
  }

  set accessId(access_id: any){
    this.attachment.setAccessId(access_id);
  }

  set message(value : any){
    if(value){
      value = decodeURIComponent((value).replace(/\+/g, '%20'));
      this.content = value;
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

    data = this.thirdPartyNetworksSelector.inject(data);

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
      file.value = null;
    })
    .catch(e => {
      console.error(e);
      this.inProgress = false;
      this.canPost = true;
      file.value = null;
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
