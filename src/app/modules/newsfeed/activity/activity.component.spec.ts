import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IntersectionObserverService } from '../../../common/services/intersection-observer.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { Session } from '../../../services/session';
import { NewsfeedService } from '../services/newsfeed.service';
import { ElementVisibilityService } from '../../../common/services/element-visibility.service';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivityService } from '../activity/activity.service';
import { ActivityComponent } from './activity.component';
import { MockService } from '../../../utils/mock';
import { BehaviorSubject, of } from 'rxjs';
import { PersistentFeedExperimentService } from '../../experiments/sub-services/persistent-feed-experiment.service';
import { IsTenantService } from '../../../common/services/is-tenant.service';

describe('ActivityComponent', () => {
  let comp: ActivityComponent;
  let fixture: ComponentFixture<ActivityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityComponent],
      providers: [
        { provide: ElementRef, useValue: MockService(ElementRef) },
        {
          provide: ChangeDetectorRef,
          useValue: MockService(ChangeDetectorRef),
        },
        { provide: NewsfeedService, useValue: MockService(NewsfeedService) },
        { provide: Session, useValue: MockService(Session) },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        {
          provide: IntersectionObserverService,
          useValue: MockService(IntersectionObserverService),
        },
        {
          provide: PersistentFeedExperimentService,
          useValue: MockService(PersistentFeedExperimentService),
        },
        { provide: IsTenantService, useValue: MockService(IsTenantService) },
      ],
    })
      .overrideProvider(ActivityService, {
        useValue: MockService(ActivityService, {
          has: [
            'entity$',
            'height$',
            'isLoggedIn$',
            'displayOptions',
            'canShow$',
          ],
          props: {
            entity$: { get: () => new BehaviorSubject<any>(null) },
            height$: { get: () => new BehaviorSubject<any>(null) },
            isLoggedIn$: { get: () => new BehaviorSubject<any>(null) },
            canShow$: { get: () => new BehaviorSubject<any>(true) },
            displayOptions: {
              autoplayVideo: true,
              showOwnerBlock: true,
              showComments: true,
              showOnlyCommentsInput: true,
              showOnlyCommentsToggle: false,
              showToolbar: true,
              showInteractions: false,
              showEditedTag: false,
              showVisibilityState: false,
              showTranslation: false,
              showPostMenu: true,
              showPinnedBadge: true,
              showMetrics: true,
              isModal: false,
              minimalMode: false,
              bypassMediaModal: false,
              sidebarMode: false,
              boostRotatorMode: false,
              isSidebarBoost: false,
              isFeed: false,
              isSingle: false,
              permalinkBelowContent: false,
              hideTopBorder: false,
            },
          },
        }),
      })
      .overrideProvider(ElementVisibilityService, {
        useValue: MockService(ElementVisibilityService),
      })
      .compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(ActivityComponent);
    comp = fixture.componentInstance;

    comp.canRecordAnalytics = false;
    comp.isSingle = false;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should setup interception observer subscription', () => {
    (comp as any).intersectionObserver.createAndObserve.and.returnValue(
      of(true)
    );
    comp.setupIntersectionObserver();

    expect((comp as any).service.setupMetricsSocketListener).toHaveBeenCalled();
  });

  it('should teardown interception observer subscription', () => {
    (comp as any).intersectionObserver.createAndObserve.and.returnValue(
      of(false)
    );
    comp.setupIntersectionObserver();

    expect(
      (comp as any).service.teardownMetricsSocketListener
    ).toHaveBeenCalled();
  });

  describe('onDownvote', () => {
    it('should show downvote notice when NOT in single entity view', () => {
      comp.showDownvoteNotice = false;
      comp.isSingle = false;

      comp.onDownvote();

      expect(comp.showDownvoteNotice).toBeTrue();
    });

    it('should NOT show downvote notice when in single entity view', () => {
      comp.showDownvoteNotice = false;
      comp.isSingle = true;

      comp.onDownvote();

      expect(comp.showDownvoteNotice).toBeFalse();
    });
  });
});
