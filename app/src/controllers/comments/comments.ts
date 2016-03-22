import { Component } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { RouterLink } from "angular2/router";

import { Client } from '../../services/api';
import { SessionFactory } from '../../services/session';
import { MDL_DIRECTIVES } from '../../directives/material';
import { AutoGrow } from '../../directives/autogrow';
import { InfiniteScroll } from '../../directives/infinite-scroll';
import { CommentCard } from '../../controllers/cards/comment/comment';
import { TagsPipe } from '../../pipes/tags';
import { SignupModalService } from '../../components/modal/signup/service';

import { AttachmentService } from '../../services/attachment';

@Component({
  selector: 'minds-comments',
  inputs: ['_object : object', '_reversed : reversed', 'limit'],
  templateUrl: 'src/controllers/comments/list.html',
  directives: [ CORE_DIRECTIVES, MDL_DIRECTIVES, RouterLink, FORM_DIRECTIVES, CommentCard, InfiniteScroll, AutoGrow ],
  pipes: [ TagsPipe ],
  bindings: [ AttachmentService ]
})

export class Comments {

  minds;
  object;
  guid: string = "";
  parent: any;
  comments : Array<any> = [];
  content = '';
  reversed : boolean = false;
  session = SessionFactory.build();

  editing : boolean = false;

  showModal : boolean = false;

  limit : number = 5;
  offset : string = "";
  inProgress : boolean = false;
  canPost: boolean = true;
  moreData : boolean = true;

	constructor(public client: Client, public attachment: AttachmentService, private modal : SignupModalService){
    this.minds = window.Minds;
	}

  set _object(value: any) {
    this.object = value;
    this.guid = this.object.guid;
    if(this.object.entity_guid)
      this.guid = this.object.entity_guid;
    this.parent = this.object;
    this.load();
  }

  set _reversed(value: boolean){
    if(value)
      this.reversed = true;
    else
      this.reversed = false;
  }

  load(refresh = false){
    var self = this;
    this.client.get('api/v1/comments/' + this.guid, { limit: this.limit, offset: this.offset, reversed: true })
      .then((response : any) => {
        if(!response.comments){
          self.moreData = false;
          self.inProgress = false;
          return false;
        }

        self.comments = response.comments.concat(self.comments);

        self.offset = response['load-previous'];
        if(!self.offset || self.offset == null)
          self.moreData = false;
        self.inProgress = false;
      })
      .catch((e) => {

      });
  }

  post(e){
    e.preventDefault();

    if (!this.content && !this.attachment.has()) {
      return;
    }

    let data = this.attachment.exportMeta();
    data['comment'] = this.content;

    this.inProgress = true;
    this.client.post('api/v1/comments/' + this.guid, data)
    .then((response : any) => {
      this.attachment.reset();
      this.content = '';
      this.comments.push(response.comment);
      this.inProgress = false;
    })
    .catch((e) => {
      this.inProgress = false;
    });
  }

  isLoggedIn(){
    if(!this.session.isLoggedIn()){
      this.modal.setSubtitle("You need to have channel in order to comment").open();
    }
  }


  delete(index : number){
    this.comments.splice(index, 1);
  }

  edited(index: number, $event) {
    this.comments[index] = $event.comment;
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
