import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';

import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { Upload } from '../../../services/api/upload';
import { AttachmentService } from '../../../services/attachment';
import { Textarea } from '../../../common/components/editors/textarea.component';
import { SocketsService } from '../../../services/sockets';
import { CommentsService } from '../comments.service';
import { PersistentFeedExperimentService } from '../../experiments/sub-services/persistent-feed-experiment.service';

@Component({
  selector: 'm-comments__tree',
  templateUrl: 'tree.component.html',
  providers: [AttachmentService, CommentsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsTreeComponent {
  entity;
  guid: string = '';
  parent: any;

  @Input() limit: number = 12;
  @Output() scrollToBottom: EventEmitter<boolean> = new EventEmitter(true);
  @Output() scrollToCurrentPosition: EventEmitter<boolean> = new EventEmitter(
    true
  );
  @Output() onHeightChange: EventEmitter<{
    oldHeight: number;
    newHeight: number;
  }> = new EventEmitter();
  @Input() conversation: boolean = false;
  @Input() scrollable: boolean = false;
  @Input() readonly: boolean = false;
  @Input() canEdit: boolean = false;
  @Input() canDelete: boolean = false;
  @Input() showOnlyPoster: boolean = false;
  @Input() compact: boolean = false;

  constructor(
    public session: Session,
    public client: Client,
    public attachment: AttachmentService,
    public sockets: SocketsService,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private persistentFeedExperiment: PersistentFeedExperimentService
  ) {}

  @Input('entity')
  set _entity(value: any) {
    this.entity = value;
    this.guid = this.entity.guid;
    if (this.entity.entity_guid) this.guid = this.entity.entity_guid;
    this.parent = this.entity;
    if (!this.canDelete) {
      this.canDelete =
        this.entity.owner_guid == this.session.getLoggedInUser().guid;
    }
  }

  onScrollToBottom() {
    this.scrollToBottom.next(true);
  }

  onScrollToCurrentPosition() {
    this.scrollToCurrentPosition.next(true);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnChanges(changes) {
    //  console.log('[comment:list]: on changes', changes);
  }

  isPersistentFeedExperimentActive = this.persistentFeedExperiment.isActive()
}
