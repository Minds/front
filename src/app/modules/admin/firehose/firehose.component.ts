import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ReportCreatorComponent } from '../../report/creator/creator.component';
import { ActivityService } from '../../../common/services/activity.service';
import { skip } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { FormToastService } from '../../../common/services/form-toast.service';

@Component({
  moduleId: module.id,
  selector: 'minds-admin-firehose',
  templateUrl: 'firehose.component.html',
  styleUrls: ['./firehose.component.ng.scss'],
})
export class AdminFirehoseComponent extends AbstractSubscriberComponent
  implements OnInit, OnDestroy {
  entities$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  inProgress = true;
  algorithm = 'latest';
  period = 'all';
  customType = 'activities';
  plus = false;
  all = false;
  paramsSubscription: Subscription;
  pagingToken: string = '';
  hasMore: boolean = true;

  /**
   * Feed will return a union of posts containing these hashtags.
   */
  public hashtags$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    []
  );

  /**
   * Reference to tag input.
   */
  @ViewChild('tagInput') input: ElementRef;

  constructor(
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    private overlayModal: OverlayModalService,
    protected activityService: ActivityService,
    private toast: FormToastService
  ) {
    super();
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.algorithm = params['algorithm'] || 'latest';
        this.period = params['period'] || '12h';
        this.customType = params['type'] || 'activities';
        this.plus = params['plus'] || false;

        if (typeof params['hashtags'] !== 'undefined') {
          this.hashtags$.next([...params['hashtags'].split(',')]);
          this.all = false;
        } else if (typeof params['all'] !== 'undefined') {
          this.hashtags$.next([]);
          this.all = true;
        } else if (params['query']) {
          this.all = true;
          this.updateSortRoute();
        } else {
          this.hashtags$.next([]);
          this.all = false;
        }

        if (
          this.algorithm !== 'top' &&
          (this.customType === 'channels' || this.customType === 'groups')
        ) {
          this.algorithm = 'top';
          this.updateSortRoute();
        }
        this.load();
      }),
      // load feed on hashtag change skipping first emission (on load).
      this.hashtags$.pipe(skip(1)).subscribe(hashtags => {
        this.load();
      })
    );
  }

  /**
   * Adds the current value of this.input (viewchild) to the hashtags$ subject array.
   * @returns { void }
   */
  public addTag(): void {
    let value = this.input.nativeElement.value;
    if (value) {
      if (value.charAt(0) === '#') {
        value = value.substring(1);
      }
      this.hashtags$.next([
        ...this.hashtags$.getValue(),
        this.input.nativeElement.value,
      ]);
      this.input.nativeElement.value = '';
      this.updateSortRoute();
    }
  }

  /**
   * Removes a given tag from hashtags subject array.
   * @param { string } tag - tag value - do not add a #.
   * @returns { void }
   */
  public removeTag(tag: string): void {
    this.hashtags$.next([
      ...this.hashtags$.getValue().filter(hashtag => hashtag !== tag),
    ]);
    this.updateSortRoute();
  }

  ngOnInit() {}

  public async load() {
    this.inProgress = true;
    const hashtags = this.hashtags$.getValue();
    const period = this.period || '';
    const all = this.all ? '1' : '';

    try {
      const url = `api/v2/admin/firehose/${this.algorithm}/${this.customType}`;
      const response: any = await this.client.get(url, {
        hashtags,
        period,
        all,
        plus: this.plus,
        offset: this.pagingToken,
      });

      this.entities$.next([...this.entities$.getValue(), ...response.entities]);
      this.pagingToken = response['load-next'];
      this.hasMore = response['has-next'];
    } catch (e) {
      console.error(e);
    }

    this.inProgress = false;
  }

  public save(guid: number, reason: number = null, subreason: number = null) {
    const data = {
      reason: reason,
      subreason: subreason,
    };
    return this.client.post('api/v2/admin/firehose/' + guid, data);
  }

  public reject(entity: any): void {
    const options = {
      onReported: (guid, reason, subreason) => {
        this.save(guid, reason, subreason);

        this.entities$.next(
          this.entities$.getValue().filter(_entity => _entity !== entity)
        );

        this.toast.success('Successfully rejected');
      },
    };

    this.overlayModal.create(ReportCreatorComponent, entity, options).present();
  }

  public accept(entity: any): void {
    this.save(entity.guid);

    this.entities$.next(
      this.entities$.getValue().filter(_entity => _entity !== entity)
    );

    this.toast.success('Successfully approved');
  }

  public setSort(
    algorithm: string,
    period: string | null,
    customType: string | null,
    plus: boolean | null
  ) {
    this.algorithm = algorithm;
    this.period = period;
    this.customType = customType;
    this.plus = plus;

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

    if (this.hashtags$.getValue().length > 0) {
      params.hashtags = this.hashtags$.getValue().join(',');
    }

    if (this.plus) {
      params.plus = this.plus;
    } else if (this.all) {
      params.all = 1;
    }

    route.push(params);
    this.router.navigate(route);
  }
}
