import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Client } from '../../../services/api';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ReportCreatorComponent } from '../../report/creator/creator.component';
import { ActivityService } from '../../../common/services/activity.service';
import { skip } from 'rxjs/operators';
import { ModalService } from '../../../services/ux/modal.service';

@Component({
  moduleId: module.id,
  selector: 'minds-admin-firehose',
  templateUrl: 'firehose.component.html',
  styleUrls: ['./firehose.component.ng.scss'],
})
export class AdminFirehoseComponent implements OnInit, OnDestroy {
  entities: Array<any> = [];
  entity: any = null;
  inProgress = true;
  algorithm = 'latest';
  period = 'all';
  customType = 'activities';
  plus = false;
  all = false;
  paramsSubscription: Subscription;
  timeout: any = null;

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
    private modalService: ModalService,
    protected activityService: ActivityService
  ) {
    this.paramsSubscription = this.route.params.subscribe((params) => {
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
      this.entity = null;
      this.load();
    });

    // load feed on hashtag change skipping first emission (on load).
    this.hashtags$.pipe(skip(1)).subscribe((hashtags) => {
      this.load();
    });
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
      ...this.hashtags$.getValue().filter((hashtag) => hashtag !== tag),
    ]);
    this.updateSortRoute();
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
      });
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
    return this.modalService.present(ReportCreatorComponent, {
      data: {
        entity: this.entity,
        onReported: (guid, reason, subreason) => {
          this.save(guid, reason, subreason);
          this.initializeEntity();
        },
      },
    }).result;
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
