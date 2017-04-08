import { Component, EventEmitter, ViewChild } from '@angular/core';

import { Client, Upload } from '../../../services/api';
import { MindsActivityObject } from '../../../interfaces/entities';
import { SessionFactory } from '../../../services/session';
import { GunDB } from '../../../services/gun';
import { Draft } from '../../../services/draft';

import { AttachmentService } from '../../../services/attachment';
import { ThirdPartyNetworksSelector } from '../../../components/third-party-networks/selector';

@Component({
  moduleId: module.id,
  selector: 'minds-newsfeed-poster',
  inputs: [ '_container_guid: containerGuid', 'accessId', 'message'],
  outputs: ['load'],
  providers: [ 
    { 
      provide: AttachmentService,
      useFactory: AttachmentService._, 
      deps: [ Client, Upload ]
    } 
  ],
  templateUrl: 'poster.html'
})

export class Poster {

  content = '';
  meta : any = {
    paywall : false
  };
  session = SessionFactory.build();
  minds;
  load: EventEmitter<any> = new EventEmitter();
  inProgress : boolean = false;

  canPost: boolean = true;

  @ViewChild('thirdPartyNetworksSelector') thirdPartyNetworksSelector: ThirdPartyNetworksSelector;

  constructor(public client: Client, public upload: Upload, public attachment: AttachmentService, public gun: GunDB, public draft: Draft){
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
      this.meta.message = value;
      this.getPostPreview({value: value}); //a little ugly here!
    }
  }

  ngOnInit(){
    var gun = this.gun;
    gun.read('draft.status', (message) => {
      if(this.draft && this.draft.writing){ return }
      this.meta.message = message;
    });
  }

	/**
	 * Post to the newsfeed
	 */
	post(){
    if (!this.meta.message && !this.attachment.has()) {
      return;
    }

    let data = Object.assign(this.meta, this.attachment.exportMeta());

    data = this.thirdPartyNetworksSelector.inject(data);

    this.inProgress = true;
    this.client.post('api/v1/newsfeed', data)
    .then((data : any) => {
      data.activity.boostToggle = true;
      this.load.next(data.activity);
      this.attachment.reset();
      this.meta = { monetized : false };
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

  saveDraft(message){
    var gun = this.gun;
    var draft = this.draft;
    clearTimeout(draft.debounce);
    draft.writing = true;
    draft.debounce = setTimeout(() => {
      gun.write('draft.status', message.value);
      draft.writing = false;
    }, draft.throttle);
  }
}
