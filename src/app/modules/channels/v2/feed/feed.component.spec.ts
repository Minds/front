import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelFeedComponent } from './feed.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { FeedService } from './feed.service';
import { ChannelsV2Service } from '../channels-v2.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedsUpdateService } from '../../../../common/services/feeds-update.service';
import { Session } from '../../../../services/session';
import { ChangeDetectorRef, Injector, PLATFORM_ID } from '@angular/core';
import { ThemeService } from '../../../../common/services/theme.service';
import { ComposerModalService } from '../../../composer/components/modal/modal.service';
import { AnalyticsService } from '../../../../services/analytics';
import { ClientMetaDirective } from '../../../../common/directives/client-meta.directive';
import { PermissionIntentsService } from '../../../../common/services/permission-intents.service';
import { FeedsService } from '../../../../common/services/feeds.service';
import { ComposerService } from '../../../composer/services/composer.service';
import { BehaviorSubject, Subject } from 'rxjs';
import userMock from '../../../../mocks/responses/user.mock';

describe('ChannelFeedComponent', () => {
  let comp: ChannelFeedComponent;
  let fixture: ComponentFixture<ChannelFeedComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        ChannelFeedComponent,
        MockComponent({
          selector: 'm-feedFilter',
          inputs: ['options', 'type'],
          outputs: ['typeChange'],
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'm-tooltip',
          inputs: ['anchor', 'icon'],
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'm-publisherRecommendations',
          inputs: ['title', 'location', 'channelId', 'visible'],
          outputs: [],
        }),
        MockComponent({
          selector: 'm-feedGrid',
          inputs: ['maxColumns', 'entities', 'isProSite'],
          outputs: ['deleted'],
        }),
        MockComponent({
          selector: 'm-composer',
        }),
        MockComponent({
          selector: 'm-newsfeed__entity',
          inputs: ['entity', 'slot'],
          outputs: ['deleted'],
        }),
        MockComponent({
          selector: 'm-featured-content',
          inputs: ['slot', 'displayOptions', 'showHeader', 'servedByGuid'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['color'],
          outputs: ['onAction'],
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'infinite-scroll',
          inputs: ['moreData', 'inProgress'],
          outputs: ['load'],
        }),
        MockComponent({
          selector: 'm-channelAbout__brief',
          inputs: ['location'],
        }),
        MockComponent({
          selector: 'm-channelShop__lazy',
          inputs: ['component'],
        }),
      ],
      providers: [
        {
          provide: ChannelsV2Service,
          useValue: MockService(ChannelsV2Service, {
            has: ['guid$', 'onSubscriptionChanged', 'channel$'],
            props: {
              guid$: {
                get: () => new BehaviorSubject<string>('1234567890123456'),
              },
              onSubscriptionChanged: {
                get: () => new Subject<boolean>(),
              },
              channel$: {
                get: () => new BehaviorSubject<any>(userMock),
              },
            },
          }),
        },
        { provide: Router, useValue: MockService(Router) },
        { provide: ActivatedRoute, useValue: MockService(ActivatedRoute) },
        {
          provide: FeedsUpdateService,
          useValue: MockService(FeedsUpdateService, {
            has: ['postEmitter'],
            props: {
              postEmitter: {
                get: () => new Subject<any>(),
              },
            },
          }),
        },
        { provide: Session, useValue: MockService(Session) },
        { provide: ChangeDetectorRef, useValue: ChangeDetectorRef },
        { provide: ThemeService, useValue: MockService(ThemeService) },
        {
          provide: ComposerModalService,
          useValue: MockService(ComposerModalService),
        },
        { provide: Injector, useValue: Injector },
        { provide: AnalyticsService, useValue: MockService(AnalyticsService) },
        {
          provide: ClientMetaDirective,
          useValue: MockService(ClientMetaDirective),
        },
        {
          provide: PermissionIntentsService,
          useValue: MockService(PermissionIntentsService),
        },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    })
      .overrideProvider(FeedService, {
        useValue: MockService(FeedService, {
          has: ['service', 'guid$', 'dateRange$'],
          props: {
            service: {
              get: () =>
                MockService(FeedsService, {
                  has: ['feed', 'inProgress', 'rawFeed'],
                  props: {
                    feed: {
                      get: () => {
                        return new BehaviorSubject<any[]>([]);
                      },
                    },
                    rawFeed: {
                      get: () => {
                        return new BehaviorSubject<any[]>([]);
                      },
                    },
                    inProgress: {
                      get: () => {
                        return new BehaviorSubject<boolean>(false);
                      },
                    },
                  },
                }),
            },
            guid$: {
              get: () => new BehaviorSubject<string>('123456789012'),
            },
            dateRange$: {
              get: () =>
                new BehaviorSubject<any>({ fromDate: null, toDate: null }),
            },
          },
        }),
      })
      .overrideProvider(FeedsService, {
        useValue: MockService(FeedsService),
      })
      .overrideProvider(ComposerService, {
        useValue: MockService(ComposerService),
      });

    fixture = TestBed.createComponent(ChannelFeedComponent);
    comp = fixture.componentInstance;

    (comp as any).session.getLoggedInUser.and.returnValue(userMock);

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

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('shouldShowNoPostsPrompt', () => {
    it('should determine whether no posts prompt should be shown', () => {
      (comp as any).permissionIntentsService.shouldHide.and.returnValue(false);
      expect((comp as any).shouldShowNoPostsPrompt()).toBeTrue();

      (comp as any).permissionIntentsService.shouldHide.and.returnValue(true);
      expect((comp as any).shouldShowNoPostsPrompt()).toBeFalse();
    });
  });
});
