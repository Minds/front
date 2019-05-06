import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer,
  ViewChild,
} from '@angular/core';

import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { Upload } from '../../../services/api/upload';
import { AttachmentService } from '../../../services/attachment';
import { Textarea } from '../../../common/components/editors/textarea.component';
import { SocketsService } from '../../../services/sockets';

@Component({
  selector: 'm-comment__poster',
  templateUrl: 'poster.component.html',
  providers: [
    {
      provide: AttachmentService,
      useFactory: AttachmentService._,
      deps: [Session, Client, Upload]
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CommentPosterComponent {

  minds;
  @Input() guid;
  @Input() entity;
  @Input() parent;
  @Input() readonly: boolean = false;
  @Input() currentIndex: number = -1;
  @Input() conversation: boolean = false;
  @Output('optimisticPost') optimisticPost$: EventEmitter<any> = new EventEmitter();
  @Output('posted') posted$: EventEmitter<any> = new EventEmitter();
  content: string = '';
  triedToPost: boolean = false;
  comments: Array<any> = []; // TODO: remove this
  canPost: boolean = true;
  inProgress: boolean = false;

  constructor(
    public session: Session,
    public client: Client,
    public attachment: AttachmentService,
    public sockets: SocketsService,
    private renderer: Renderer,
    private cd: ChangeDetectorRef
  ) {
    this.minds = window.Minds;
  }
 
  keypress(e: KeyboardEvent) {
    if (!e.shiftKey && e.charCode === 13) {
      this.post(e);
    }
  }

  async post(e) {
    e.preventDefault();

    if (this.inProgress)
      return;

    this.inProgress = true;

    if (!this.content && !this.attachment.has()) {
      return;
    }

    this.content = this.content.trim();

    let data = this.attachment.exportMeta();
    data['comment'] = this.content;
    data['parent_path'] = this.parent.child_path || '0:0:0';

    let comment = { // Optimistic
      description: this.content,
      guid: 0,
      ownerObj: this.session.getLoggedInUser(),
      owner_guid: this.session.getLoggedInUser().guid,
      time_created: Date.now() / 1000,
      type: 'comment',
      error: null,
    };

    this.optimisticPost$.next(comment);

    this.attachment.reset();
    this.content = '';

    this.detectChanges();

    try {
      let response: any = await this.client.post('api/v1/comments/' + this.guid, data);
      this.posted$.next({ comment: response.comment, index: this.currentIndex });
    } catch (e) {
      comment.error = (e && e.message) || 'There was an error';
      this.posted$.next({ comment, index: this.currentIndex });
      console.error('Error posting', e);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  resetPreview() {
    this.canPost = true;
    this.triedToPost = false;
    this.attachment.resetRich();
  }

  uploadAttachment(file: HTMLInputElement, e?: any) {
    this.canPost = false;
    this.triedToPost = false;

    this.attachment.setHidden(true);
    this.attachment.setContainer(this.entity);
    this.attachment.upload(file, this.detectChanges.bind(this))
      .then(guid => {
        this.canPost = true;
        this.triedToPost = false;
        file.value = null;
        this.detectChanges();
      })
      .catch(e => {
        console.error(e);
        this.canPost = true;
        this.triedToPost = false;
        file.value = null;
        this.detectChanges();
      });

    this.detectChanges();
  }

  removeAttachment(file: HTMLInputElement) {
    this.canPost = false;
    this.triedToPost = false;

    this.attachment.remove(file).then(() => {
      this.canPost = true;
      this.triedToPost = false;
      file.value = '';
    }).catch(e => {
      console.error(e);
      this.canPost = true;
      this.triedToPost = false;
    });

    this.detectChanges();
  }

  async getPostPreview(message) {
    if (!message) {
      return;
    }

    this.attachment.preview(message, this.detectChanges.bind(this));
  }

  getAvatar() {
    if(this.session.isLoggedIn()) {
      return `${this.minds.cdn_url}icon/${this.session.getLoggedInUser().guid}/small/${this.session.getLoggedInUser().icontime}`;
    } else {
      return `${this.minds.cdn_assets_url}assets/avatars/default-small.png`
    }
  }

  postEnabled() {
    return true; // TODO: fix
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnChanges(changes) {
  //  console.log('[comment:list]: on changes', changes);
  }

}
