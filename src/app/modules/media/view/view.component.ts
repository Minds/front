import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Optional,
  SkipSelf,
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
import { MetaService } from '../../../common/services/meta.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { FeaturesService } from '../../../services/features.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';
import { ClientMetaService } from '../../../common/services/client-meta.service';

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
    private metaService: MetaService,
    private featuresService: FeaturesService,
    protected toasterService: FormToastService,
    @Optional() @SkipSelf() protected parentClientMeta: ClientMetaDirective,
    protected clientMetaService: ClientMetaService,
    configs: ConfigsService
  ) {
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
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.queryParamsSubscription$.unsubscribe();
  }

  load(refresh: boolean = false) {
    if (this.featuresService.has('navigation')) {
      this.router.navigate(['/newsfeed', this.guid]);
    }
  }
}
