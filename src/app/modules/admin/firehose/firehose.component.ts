import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NewsfeedHashtagSelectorService } from '../../newsfeed/services/newsfeed-hashtag-selector.service';
import { ReportCreatorComponent } from '../../report/creator/creator.component';
import { ActivityService } from '../../../common/services/activity.service';
@Component({
  moduleId: module.id,
  selector: 'minds-admin-firehose',
  templateUrl: 'firehose.component.html',
})
export class AdminFirehoseComponent implements OnInit, OnDestroy {
  entities: Array<any> = [];
  entity: any = null;
  inProgress = true;
  algorithm = 'latest';
  period = '12h';
  customType = 'activities';
  hashtag: string | null = null;
  all = false;
  paramsSubscription: Subscription;
  timeout: any = null;

  constructor(
    private session: Session,
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    protected newsfeedHashtagSelectorService: NewsfeedHashtagSelectorService,
    private overlayModal: OverlayModalService,
    protected activityService: ActivityService
  ) {
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.algorithm = params['algorithm'] || 'latest';
      this.period = params['period'] || '12h';
      this.customType = params['type'] || 'activities';

      if (typeof params['hashtag'] !== 'undefined') {
        this.hashtag = params['hashtag'] || null;
        this.all = false;
      } else if (typeof params['all'] !== 'undefined') {
        this.hashtag = null;
        this.all = true;
      } else if (params['query']) {
        this.all = true;
        this.updateSortRoute();
      } else {
        this.hashtag = null;
        this.all = false;
      }

      if (
        this.algorithm !== 'top' &&
        (this.customType === 'channels' || this.customType === 'groups')
      ) {
        this.algorithm = 'top';
        this.updateSortRoute();
      }
      this.entity = null;
      this.load();
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    this.timeout = null;
  }

  public async load() {
    this.inProgress = true;
    const hashtags = this.hashtag ? encodeURIComponent(this.hashtag) : '';
    const period = this.period || '';
    const all = this.all ? '1' : '';

    try {
      const url = `api/v2/admin/firehose/${this.algorithm}/${this.customType}?hashtags=${hashtags}&period=${period}&all=${all}`;
      const response: any = await this.client.get(url);
      this.entities = response.entities;

      if (this.entities.length > 0) {
        this.initializeEntity();
        this.timeout = setTimeout(() => this.load(), 3600000);
      }
    } catch (exception) {
      console.error(exception);
    }

    this.inProgress = false;
  }

  public initializeEntity() {
    this.entity = null;
    if (this.entities.length > 0) {
      this.entity = this.entities.shift();
    } else {
      this.load();
    }
  }

  public save(guid: number, reason: number = null, subreason: number = null) {
    const data = {
      reason: reason,
      subreason: subreason,
    };
    return this.client.post('api/v2/admin/firehose/' + guid, data);
  }

  public reject() {
    const options = {
      onReported: (guid, reason, subreason) => {
        this.save(guid, reason, subreason);
        this.initializeEntity();
      },
    };

    this.overlayModal
      .create(ReportCreatorComponent, this.entity, options)
      .present();
  }

  public accept() {
    this.save(this.entity.guid);
    this.initializeEntity();
  }

  @HostListener('document:keydown', ['$event'])
  public onKeyPress(e) {
    if (this.entity) {
      switch (e.key) {
        case 'ArrowLeft':
          this.reject();
          break;
        case 'ArrowRight':
          this.accept();
          break;
      }
    }
  }

  public setSort(
    algorithm: string,
    period: string | null,
    customType: string | null
  ) {
    this.algorithm = algorithm;
    this.period = period;
    this.customType = customType;

    this.updateSortRoute();
  }

  updateSortRoute() {
    const route: any[] = ['admin/firehose', this.algorithm];
    const params: any = {};

    params.algorithm = this.algorithm;

    if (this.period) {
      params.period = this.period;
    }

    if (this.customType) {
      params.type = this.customType;
    }

    if (this.hashtag) {
      params.hashtag = this.hashtag;
    } else if (this.all) {
      params.all = 1;
    }

    route.push(params);
    this.router.navigate(route);
  }
}
