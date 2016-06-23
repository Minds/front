import { Component, EventEmitter } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { RouterLink } from "@angular/router-deprecated";

import { Client } from '../../services/api';
import { SessionFactory } from '../../services/session';
import { MDL_DIRECTIVES } from '../../directives/material';
import { AutoGrow } from '../../directives/autogrow';
import { InfiniteScroll } from '../../directives/infinite-scroll';
import { CommentCard } from '../../controllers/cards/comment/comment';
import { TagsPipe } from '../../pipes/tags';
import { SignupModalService } from '../../components/modal/signup/service';

import { AttachmentService } from '../../services/attachment';
import { MindsRichEmbed } from '../../components/rich-embed/rich-embed';
import { SocketsService } from '../../services/sockets';

import { CommentsScrollDirective } from './scroll';
import { ScrollLock } from '../../directives/scroll-lock';

@Component({
  selector: 'minds-comments',
  inputs: ['_object : object', '_reversed : reversed', 'limit'],
  templateUrl: 'src/controllers/comments/list.html',
  directives: [ CORE_DIRECTIVES, MDL_DIRECTIVES, RouterLink, FORM_DIRECTIVES, CommentCard, InfiniteScroll, AutoGrow, MindsRichEmbed, CommentsScrollDirective, ScrollLock ],
  pipes: [ TagsPipe ],
  providers: [ AttachmentService ]
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
  triedToPost: boolean = false;
  moreData: boolean = false;
  loaded: boolean = false;

  socketRoomName: string;
  socketSubscriptions: any = {
    comment: null
  };

  commentsScrollEmitter: EventEmitter<any> = new EventEmitter();

  constructor(public client: Client, public attachment: AttachmentService, private modal: SignupModalService, public sockets: SocketsService) {
    this.minds = window.Minds;
	}

  set _object(value: any) {
    this.object = value;
    this.guid = this.object.guid;
    if(this.object.entity_guid)
      this.guid = this.object.entity_guid;
    this.parent = this.object;
    this.load(true);
    this.listen();
  }

  set _reversed(value: boolean){
    if(value)
      this.reversed = true;
    else
      this.reversed = false;
  }

  load(refresh = false) {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    this.client.get('api/v1/comments/' + this.guid, { limit: this.limit, offset: this.offset, reversed: true })
      .then((response : any) => {

        if (!this.socketRoomName && response.socketRoomName) {
          this.socketRoomName = response.socketRoomName;
          this.joinSocketRoom();
        }

        this.loaded = true;
        this.inProgress = false;
        this.moreData = true;

        if(!response.comments){
          this.moreData = false;
          return false;
        }

        this.comments = response.comments.concat(this.comments);

        this.offset = response['load-previous'];

        if (refresh) {
          this.commentsScrollEmitter.emit('bottom');
        }
        
        if (
          !this.offset ||
          this.offset == null ||
          response.comments.length < (this.limit - 1)
        ) {
          this.moreData = false;
        }
      })
      .catch((e) => {
        this.inProgress = false;
      });
  }

  autoloadPrevious() {
    if (!this.moreData) {
      return;
    }

    this.load();
  }

  joinSocketRoom() {
    if (this.socketRoomName) {
      this.sockets.join(this.socketRoomName);
    }
  }

  ngOnDestroy() {
    if (this.socketRoomName) {
      this.sockets.leave(this.socketRoomName);
    }
  }

  listen() {
    this.socketSubscriptions.comment = this.sockets.subscribe('comment', (parent_guid, owner_guid, guid) => {
      if (parent_guid !== this.guid) {
        return;
      }

      if (this.session.isLoggedIn() && owner_guid === this.session.getLoggedInUser().guid) {
        return;
      }

      this.client.get('api/v1/comments/' + this.guid, { limit: 1, offset: guid, reversed: false })
        .then((response: any) => {
          if (!response.comments || response.comments.length === 0) {
            return;
          }

          this.comments.push(response.comments[0]);
          this.commentsScrollEmitter.emit('bottom');
        })
        .catch(e => {});
    });
  }

  postEnabled() {
    return !this.inProgress && this.canPost && (this.content || this.attachment.has());
  }

  post(e){
    e.preventDefault();

    if (!this.content && !this.attachment.has()) {
      return;
    }

    if (this.inProgress || !this.canPost) {
      this.triedToPost = true;
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
      this.commentsScrollEmitter.emit('bottom');
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
    this.triedToPost = false;

    this.attachment.upload(file)
    .then(guid => {
      this.canPost = true;
      this.triedToPost = false;
      file.value = null;
    })
    .catch(e => {
      console.error(e);
      this.canPost = true;
      this.triedToPost = false;
      file.value = null;
    });
  }

  removeAttachment(file: HTMLInputElement) {
    this.canPost = false;
    this.triedToPost = false;

    this.attachment.remove(file).then(() => {
      this.canPost = true;
      this.triedToPost = false;
      file.value = "";
    }).catch(e => {
      console.error(e);
      this.canPost = true;
      this.triedToPost = false;
    });
  }

  getPostPreview(message){
    if (!message.value) {
      return;
    }

    this.attachment.preview(message.value);
  }

}
