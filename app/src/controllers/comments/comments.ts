import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { RouterLink } from "angular2/router";

import { Client } from '../../services/api';
import { SessionFactory } from '../../services/session';
import { Material } from '../../directives/material';
import { AutoGrow } from '../../directives/autogrow';
import { InfiniteScroll } from '../../directives/infinite-scroll';
import { CommentCard } from '../../controllers/cards/comment/comment';
import { TagsPipe } from '../../pipes/tags';
import { SignupOnActionModal } from '../../components/modal/modal';


@Component({
  selector: 'minds-comments',
  viewBindings: [ Client ],
  inputs: ['_object : object', '_reversed : reversed', 'limit']
})
@View({
  templateUrl: 'src/controllers/comments/list.html',
  directives: [ CORE_DIRECTIVES, Material, RouterLink, FORM_DIRECTIVES, CommentCard, InfiniteScroll, AutoGrow, SignupOnActionModal ],
  pipes: [ TagsPipe ]
})

export class Comments {

  minds;
  object;
  guid: string = "";
  parent: any;
  comments : Array<any> = [];
  postMeta : any = {};
  reversed : boolean = false;
  session = SessionFactory.build();

  editing : boolean = false;

  showModal : boolean = false;

  limit : number = 5;
  offset : string = "";
  inProgress : boolean = false;
  moreData : boolean = true;

	constructor(public client: Client){
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

  load(refresh : boolean = false){
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
    if(!this.postMeta.comment || this.inProgress)
      return;
    this.inProgress = true;
    this.client.post('api/v1/comments/' + this.guid, { comment: this.postMeta.comment })
      .then((response : any) => {
        this.postMeta.comment = "";
        this.comments.push(response.comment);
        this.inProgress = false;
      })
      .catch((e) => {
        this.inProgress = false;
      });
  }

  isLoggedIn(){
    if(!this.session.isLoggedIn()){
      this.showModal = true;
    }
  }


  delete(index : number){
    this.comments.splice(index, 1);
  }

}
