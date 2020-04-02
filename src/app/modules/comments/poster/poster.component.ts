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
import autobind from '../../../helpers/autobind';
import { AutocompleteSuggestionsService } from '../../suggestions/services/autocomplete-suggestions.service';
import { SignupModalService } from '../../modals/signup/service';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-comment__poster',
  templateUrl: 'poster.component.html',
  providers: [AttachmentService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentPosterComponent {
  @Input() guid;
  @Input() entity;
  @Input() parent;
  @Input() readonly: boolean = false;
  @Input() currentIndex: number = -1;
  @Input() conversation: boolean = false;
  @Input() level: number = 0;
  @Output('optimisticPost') optimisticPost$: EventEmitter<
    any
  > = new EventEmitter();
  @Output('posted') posted$: EventEmitter<any> = new EventEmitter();
  content: string = '';
  triedToPost: boolean = false;
  comments: Array<any> = []; // TODO: remove this
  canPost: boolean = true;
  inProgress: boolean = false;
  maxLength: number = 1500;

  constructor(
    public session: Session,
    public client: Client,
    private signupModal: SignupModalService,
    public attachment: AttachmentService,
    public sockets: SocketsService,
    public suggestions: AutocompleteSuggestionsService,
    private renderer: Renderer,
    private cd: ChangeDetectorRef,
    private configs: ConfigsService
  ) {}

  keypress(e: KeyboardEvent) {
    if (!e.shiftKey && e.charCode === 13) {
      this.post(e);
    }
  }

  async post(e) {
    e.preventDefault();

    this.attachment.resetPreviewRequests();
    if (this.content.length > this.maxLength) {
      return;
    }

    if (this.inProgress) return;

    this.inProgress = true;

    if (!this.content && !this.attachment.has()) {
      this.inProgress = false;
      return;
    }

    this.content = this.content.trim();

    let data = this.attachment.exportMeta();
    data['comment'] = this.content;
    data['parent_path'] = this.parent.child_path || '0:0:0';

    let comment = {
      // Optimistic
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
      let response: any = await this.client.post(
        'api/v1/comments/' + this.guid,
        data
      );
      this.posted$.next({
        comment: response.comment,
        index: this.currentIndex,
      });
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

  async uploadFile(fileInput: HTMLInputElement, event) {
    if (fileInput.value) {
      // this prevents IE from executing this code twice
      try {
        await this.uploadAttachment(fileInput);

        fileInput.value = null;
      } catch (e) {
        fileInput.value = null;
      }
    }
    this.detectChanges();
  }

  async uploadAttachment(file: HTMLInputElement | File) {
    this.canPost = false;
    this.triedToPost = false;

    this.attachment.setHidden(true);
    this.attachment.setContainer(this.entity);
    this.detectChanges();

    this.attachment
      .upload(file, this.detectChanges.bind(this))
      .then(guid => {
        this.canPost = true;
        this.triedToPost = false;
        if (file instanceof HTMLInputElement) {
          file.value = null;
        }
        this.detectChanges();
      })
      .catch(e => {
        console.error(e);
        this.canPost = true;
        this.triedToPost = false;
        if (file instanceof HTMLInputElement) {
          file.value = null;
        }
        this.detectChanges();
      });

    this.detectChanges();
  }

  removeAttachment(fileInput: HTMLInputElement) {
    this.canPost = false;
    this.triedToPost = false;

    this.attachment
      .remove()
      .then(() => {
        this.canPost = true;
        this.triedToPost = false;
        fileInput.value = null;
      })
      .catch(e => {
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
    if (this.session.isLoggedIn()) {
      return `${this.configs.get('cdn_url')}icon/${
        this.session.getLoggedInUser().guid
      }/small/${this.session.getLoggedInUser().icontime}`;
    } else {
      return `${this.configs.get(
        'cdn_assets_url'
      )}assets/avatars/default-small.png`;
    }
  }

  postEnabled() {
    if (this.content.length > this.maxLength) {
      return false;
    }
    return true; // TODO: fix
  }

  get isLoggedIn() {
    return this.session.isLoggedIn();
  }

  showLoginModal() {
    this.signupModal.open();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnChanges(changes) {
    //  console.log('[comment:list]: on changes', changes);
  }
}
