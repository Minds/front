import { Component, View, EventEmitter} from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { RouterLink } from "angular2/router";

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';
import { AutoGrow } from '../../../directives/autogrow';
import { BUTTON_COMPONENTS } from '../../../components/buttons';
import { TagsPipe } from '../../../pipes/tags';
import { MINDS_PIPES } from '../../../pipes/pipes';

import { MDL_DIRECTIVES } from '../../../directives/material';
import { AttachmentService } from '../../../services/attachment';

@Component({
  selector: 'minds-card-comment',
  viewProviders: [ ],
  inputs: ['object', 'parent'],
  outputs: [ '_delete: delete', '_saved: saved'],
  host: {
    '(keydown.esc)': 'editing = false'
  },
  template: `
  <div class="mdl-card minds-comment minds-block">
    <div class="minds-avatar">
      <a [routerLink]="['/Channel', {username: comment.ownerObj.username}]">
        <img src="{{minds.cdn_url}}/icon/{{comment.ownerObj.guid}}/small" class="mdl-shadow--2dp"/>
      </a>
    </div>
    <div class="minds-body">
      <a [routerLink]="['/Channel', {username: comment.ownerObj.username}]" class="username mdl-color-text--blue-grey-500">{{comment.ownerObj.name}} @{{comment.ownerObj.username}}</a>
      <span class="mdl-color-text--blue-grey-300 minds-comment-span minds-comment-bullet">{{comment.time_created * 1000 | date: 'medium'}}</span>

      <p [hidden]="editing">
        <span class="minds-comments-voting">
            <minds-button-thumbs-up [object]="comment"></minds-button-thumbs-up>
            <minds-button-thumbs-down [object]="comment"></minds-button-thumbs-down>
        </span>
        <span [innerHtml]="(comment.description || '') | tags "></span>
      </p>

      <div class="minds-editable-container" *ngIf="editing">
      	<!-- Please not the intentional single way binding for ngModel, we want to be able to cancel our changes -->
      	<textarea class="mdl-card__supporting-text message"
          [ngModel]="comment.description"
          #edit
          [autoGrow]
          (keydown.enter)="comment.description = edit.value; save();"
          (keydown.esc)="editing = false; edit.value = comment.description"
          (keyup)="getPostPreview(edit)"
          ></textarea>
        <span class="minds-comment-span">Press ESC to cancel</span>
      </div>

      <div class="m-editable-attachment-container" *ngIf="editing">
        <!-- Attachements -->
        <div class="attachment-button" [ngClass]="{ 'mdl-color-text--amber-500': attachment.hasFile(), 'm-hasnt-attachment-preview': !attachment.hasFile() }">
          <i class="material-icons">attachment</i>
          <input type="file" id="file" #file name="attachment" accept="image/*" (change)="uploadAttachment(file, $event)"/>
        </div>

        <a class="m-mature-button" [ngClass]="{ 'mdl-color-text--amber-500': attachment.isMature() }" (click)="attachment.toggleMature()" *ngIf="attachment.hasFile()">
          <i class="material-icons">explicit</i>
        </a>

       <!-- Attachment preview -->
       <div class="post-preview" *ngIf="attachment.hasFile() || attachment.getUploadProgress() > 0"  (click)="removeAttachment(file)">
         <div class="mdl-progress mdl-js-progress"
           [mdlUpload]
           [progress]="attachment.getUploadProgress()"
           [hidden]="attachment.getUploadProgress() == 0"
           [ngClass]="{ 'complete': attachment.getUploadProgress()  == 100 }"
           ></div>
         <img *ngIf="attachment.getMime() != 'video'" [src]="attachment.getPreview()" class="attachment-preview mdl-shadow--2dp"/>
         <div class="attachment-preview-delete">
           <i class="material-icons">delete</i>
         </div>
       </div>

       <!-- Rich embed preview -->
       <div class="post-preview" *ngIf="attachment.isRich()">
         <div class="mdl-spinner mdl-js-spinner is-active" [mdl] [hidden]="attachment.getMeta().title"></div>
         <div class="m-rich-embed mdl-shadow--2dp cf" *ngIf="attachment.getMeta().title">

           <a class="thumbnail" *ngIf="attachment.getMeta().thumbnail">
             <img src="{{ attachment.getMeta().thumbnail }}" />
           </a>
           <a class="meta mdl-color-text--blue-grey-900" [ngClass]="{ 'm-has-thumbnail': attachment.getMeta().thumbnail }">
             <h2 class="mdl-card__title-text">{{attachment.getMeta().title}}</h2>
             <p>{{attachment.getMeta().description}}</p>
           </a>
         </div>
       </div>
      </div>

      <div class="mdl-card__menu mdl-color-text--blue-grey-300">
      	<button class="mdl-button minds-more mdl-button--icon" (click)="delete(i)"
          *ngIf="comment.owner_guid == session.getLoggedInUser()?.guid || session.isAdmin() || parent.owner_guid == session.getLoggedInUser()?.guid">
      		<i class="material-icons">delete</i>
      	</button>
        <button class="mdl-button minds-more mdl-button--icon" (click)="editing = !editing"
          *ngIf="comment.owner_guid == session.getLoggedInUser()?.guid || session.isAdmin()">
          <i class="material-icons">edit</i>
        </button>
      </div>
    </div>
  </div>

  <div class="mdl-card m-comment-attachment" [hidden]="editing" *ngIf="(comment.perma_url && comment.title) || comment.custom_type == 'batch'">
    <!-- Rich content -->
    <div class="m-rich-embed mdl-shadow--2dp cf" *ngIf="comment.perma_url && comment.title">
      <a [href]="comment.perma_url" class="thumbnail" target="_blank" *ngIf="comment.thumbnail_src">
        <img [src]="comment.thumbnail_src" (error)="comment.thumbnail_src = null"/>
      </a>
      <a [href]="comment.perma_url" target="_blank" class="meta mdl-color-text--blue-grey-900" [ngClass]="{ 'm-has-thumbnail': comment.thumbnail_src }">
        <h2 class="mdl-card__title-text mdl-typography--font-medium" *ngIf="comment.title">{{comment.title}}</h2>
        <p *ngIf="comment.blurb">{{comment.blurb}}</p>
        <p class="m-url mdl-color-text--blue-grey-400">{{comment.perma_url | domain}}</p>
      </a>
    </div>

    <!-- Custom type:: batch -->
    <div class="item item-image allow-select" [ngClass]="{ 'm-mature-content': attachment.hideMature(comment) }" *ngIf="!editing && comment.custom_type == 'batch'">
      <div class="m-mature-overlay" (click)="comment.force_show = 1">
        <i class="material-icons">explicit</i>
      </div>
      <a [routerLink]="['/Archive-View', {guid: comment.attachment_guid}]" *ngIf="comment.attachment_guid">
        <img [src]="comment.custom_data[0].src" style="width:100%" class="mdl-shadow--2dp" (error)="comment.custom_data[0].src = 'https://www.minds.com/assets/logos/medium.png'">
      </a>

      <img *ngIf="!comment.attachment_guid" [src]="comment.custom_data[0].src" style="width:100%" (error)="comment.custom_data[0].src = 'https://www.minds.com/assets/logos/medium.png'">
    </div>
  </div>
  `,
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, BUTTON_COMPONENTS, MDL_DIRECTIVES, AutoGrow, RouterLink ],
  pipes: [ TagsPipe, MINDS_PIPES ],
  bindings: [ AttachmentService ]
})

export class CommentCard {

  comment : any;
  editing : boolean = false;
  minds = window.Minds;
  session = SessionFactory.build();

  canPost: boolean = true;
  inProgress: boolean = false;

  _delete: EventEmitter<any> = new EventEmitter();
  _saved: EventEmitter<any> = new EventEmitter();

	constructor(public client: Client, public attachment: AttachmentService){
	}

  set object(value: any) {
    if(!value)
      return;
    this.comment = value;
    this.attachment.load(this.comment);
  }

  set _editing(value : boolean){
    this.editing = value;
  }

  save(){
    if (!this.comment.description && !this.attachment.has()) {
      return;
    }

    let data = this.attachment.exportMeta();
    data['comment'] = this.comment.description;

    this.editing = false;
    this.inProgress = true;
    this.client.post('api/v1/comments/update/' + this.comment.guid, data)
    .then((response : any) => {
      this.inProgress = false;
      if (response.comment) {
        this._saved.next({
          comment: response.comment
        });
      }
    });
  }

  delete(){
    this.client.delete('api/v1/comments/' + this.comment.guid);
    this._delete.next(true);
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
