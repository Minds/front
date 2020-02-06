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
import { AttachmentService } from '../../../services/attachment';
import { SocketsService } from '../../../services/sockets';
import { CommentsService } from '../comments.service';
import { ActivityService as ActivityServiceCommentsLegacySupport } from '../../../common/services/activity.service';

@Component({
  selector: 'm-comments__entityOutlet',
  templateUrl: 'entity-outlet.component.html',
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
export class CommentsEntityOutletComponent implements OnInit, OnDestroy {
  entity;
  guid: string = '';
  parent: any;

  @Input() limit: number = 12;
  @Input() canEdit: boolean = false;
  @Input() canDelete: boolean = false;
  @Input() fixedHeight = false;
  @Input() showOnlyPoster = true;
  optimisticList: Array<any> = [];

  // private shouldReuseRouteFn;

  constructor(
    public session: Session,
    public client: Client,
    public attachment: AttachmentService,
    public sockets: SocketsService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public legacyActivityService: ActivityServiceCommentsLegacySupport
  ) {}

  ngOnInit() {
    // this.shouldReuseRouteFn = this.router.routeReuseStrategy.shouldReuseRoute;
    // this.router.routeReuseStrategy.shouldReuseRoute = future => {
    //   return false;
    // };
  }

  ngOnDestroy() {
    // this.router.routeReuseStrategy.shouldReuseRoute = this.shouldReuseRouteFn;
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

  get count(): number {
    return this.entity['comments:count'] || 0;
  }

  onPosted({ comment, index }): void {
    if (this.fixedHeight) {
      this.redirectToSinglePage();
    }
    this.optimisticList[index] = comment;
    this.detectChanges();
  }

  onOptimisticPost(comment): void {
    if (this.fixedHeight) return;
    this.optimisticList.push(comment);
  }

  openFullComments(): void {
    if (this.fixedHeight) {
      // redirect to full view newsfeed post
      this.redirectToSinglePage();
    }
    this.showOnlyPoster = false;
    this.detectChanges();
  }

  redirectToSinglePage(): void {
    this.router.navigate([`/newsfeed/${this.entity.guid}`], {
      queryParams: {
        fixedHeight: 0,
      },
    });
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnChanges(changes) {
    //  console.log('[comment:list]: on changes', changes);
  }
}
