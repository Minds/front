import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer,
  OnInit,
  OnDestroy,
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

@Component({
  selector: 'm-comments__tree',
  templateUrl: 'tree.component.html',
  providers: [
    AttachmentService,
    {
      provide: CommentsService,
      useFactory: (_route, _client) => {
        return new CommentsService(_route, _client);
      },
      deps: [ActivatedRoute, Client],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsTreeComponent implements OnInit, OnDestroy {
  entity;
  guid: string = '';
  parent: any;

  @Input() limit: number = 12;
  @Output() scrollToBottom: EventEmitter<boolean> = new EventEmitter(true);
  @Output() scrollToCurrentPosition: EventEmitter<boolean> = new EventEmitter(
    true
  );

  @Input() conversation: boolean = false;
  @Input() scrollable: boolean = false;
  @Input() readonly: boolean = false;
  @Input() canEdit: boolean = false;
  @Input() canDelete: boolean = false;
  @Input() showOnlyPoster: boolean = false;

  private shouldReuseRouteFn;

  constructor(
    public session: Session,
    public client: Client,
    public attachment: AttachmentService,
    public sockets: SocketsService,
    private renderer: Renderer,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.shouldReuseRouteFn = this.router.routeReuseStrategy.shouldReuseRoute;
    this.router.routeReuseStrategy.shouldReuseRoute = future => {
      return false;
    };
  }

  ngOnDestroy() {
    this.router.routeReuseStrategy.shouldReuseRoute = this.shouldReuseRouteFn;
  }

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
}
