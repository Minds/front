import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  SkipSelf,
  Injector,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';

import { RecommendedService } from '../components/video/recommended.service';
import { AttachmentService } from '../../../services/attachment';
import { ContextService } from '../../../services/context.service';
import { ActivityService } from '../../../common/services/activity.service';
import { AnalyticsService } from '../../../services/analytics';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { MetaService } from '../../../common/services/meta.service';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-media--view',
  templateUrl: 'view.component.html',
  providers: [
    {
      provide: RecommendedService,
      useFactory: RecommendedService._,
      deps: [Client],
    },
    ActivityService,
    ClientMetaService,
  ],
})
export class MediaViewComponent implements OnInit, OnDestroy {
  readonly cdnUrl: string;
  readonly cdnAssetsUrl: string;
  readonly siteUrl: string;

  guid: string;
  entity: any = {};
  inProgress: boolean = true;
  error: string = '';
  deleteToggle: boolean = false;

  theaterMode: boolean = false;
  allowComments = true;

  menuOptions: Array<string> = [
    'edit',
    'follow',
    'feature',
    'delete',
    'report',
    'set-explicit',
    'subscribe',
    'remove-explicit',
    'rating',
    'allow-comments',
    'disable-comments',
  ];

  paramsSubscription: Subscription;
  queryParamsSubscription$: Subscription;
  focusedCommentGuid: string = '';

  constructor(
    public session: Session,
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    public attachment: AttachmentService,
    public context: ContextService,
    private cd: ChangeDetectorRef,
    protected activityService: ActivityService,
    private clientMetaService: ClientMetaService,
    private metaService: MetaService,
    configs: ConfigsService,
    @SkipSelf() injector: Injector
  ) {
    this.clientMetaService
      .inherit(injector)
      .setSource('single')
      .setMedium('single');
    this.cdnUrl = configs.get('cdn_url');
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.siteUrl = configs.get('site_url');
  }

  ngOnInit() {
    this.paramsSubscription = this.route.paramMap.subscribe(params => {
      if (params.get('guid')) {
        this.guid = params.get('guid');
        this.load(true);
      }
    });

    this.queryParamsSubscription$ = this.route.queryParamMap.subscribe(
      params => {
        this.focusedCommentGuid = params.get('comment_guid');
        if (this.focusedCommentGuid) {
          window.scrollTo(0, 500);
        }
      }
    );
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.queryParamsSubscription$.unsubscribe();
  }

  load(refresh: boolean = false) {
    if (refresh) {
      this.entity = {};
      this.detectChanges();
    }
    this.inProgress = true;
    this.client
      .get('api/v1/media/' + this.guid, { children: false })
      .then((response: any) => {
        this.inProgress = false;
        if (response.entity.type !== 'object') {
          return;
        }
        if (response.entity) {
          this.entity = response.entity;
          this.allowComments = this.entity['allow_comments'];
          switch (this.entity.subtype) {
            case 'video':
              this.context.set('object:video');
              break;

            case 'image':
              this.context.set('object:image');
              break;

            default:
              this.context.reset();
          }

          this.updateMeta();
        }

        this.clientMetaService.recordView(this.entity);

        this.detectChanges();
      })
      .catch(e => {
        this.inProgress = false;
        this.error = 'Sorry, there was problem.';
      });
  }

  delete() {
    this.client
      .delete('api/v1/media/' + this.guid)
      .then((response: any) => {
        const type: string =
          this.entity.subtype === 'video' ? 'videos' : 'images';
        this.router.navigate([`/media/${type}/my`]);
      })
      .catch(e => {
        alert((e && e.message) || 'Server error');
      });
  }

  getNext() {
    if (
      this.entity.container_guid === this.entity.owner_guid ||
      !this.entity.album_children_guids ||
      this.entity.album_children_guids.length <= 1
    ) {
      return;
    }

    let pos = this.entity['album_children_guids'].indexOf(this.entity.guid);
    //bump up if less than 0
    if (pos <= 0) pos = 1;
    //bump one up if we are in the same position as ourself
    if (this.entity['album_children_guids'][pos] === this.entity.guid) pos++;
    //reset back to 0 if we are are the end
    if (pos >= this.entity['album_children_guids'].length) pos = 0;

    return this.entity['album_children_guids'][pos];
  }

  menuOptionSelected(option: string) {
    switch (option) {
      case 'edit':
        this.router.navigate(['/media/edit', this.entity.guid]);
        break;
      case 'delete':
        this.delete();
        break;
      case 'set-explicit':
        this.setExplicit(true);
        break;
      case 'remove-explicit':
        this.setExplicit(false);
        break;
      case 'allow-comments':
        this.entity.allow_comments = true;
        this.activityService.toggleAllowComments(this.entity, true);
        break;
      case 'disable-comments':
        this.entity.allow_comments = false;
        this.activityService.toggleAllowComments(this.entity, false);
        break;
    }
  }

  setExplicit(value: boolean) {
    this.entity.mature = value;
    this.detectChanges();

    this.client
      .post(`api/v1/entities/explicit/${this.entity.guid}`, {
        value: value ? '1' : '0',
      })
      .catch(e => {
        this.entity.mature = !!this.entity.mature;
        this.detectChanges();
      });
  }

  canShowComments() {
    if (!this.entity.guid) {
      return false;
    }
    //Don't show comments on albums
    if (this.entity.subtype === 'album') {
      return false;
    }
    return this.entity['comments:count'] >= 1;
  }

  private detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  isScheduled(time_created) {
    return time_created && time_created * 1000 > Date.now();
  }

  private updateMeta(): void {
    this.metaService
      .setTitle(
        this.entity.title ||
          `@${this.entity.ownerObj.username}'s ${this.entity.subtype}`
      )
      .setDescription(this.entity.description)
      .setOgImage(this.entity.thumbnail);
  }
}
