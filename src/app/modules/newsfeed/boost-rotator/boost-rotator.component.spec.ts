import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Session } from '../../../services/session';
import { NewsfeedService } from '../services/newsfeed.service';
import { ChangeDetectorRef, DebugElement, ElementRef } from '@angular/core';
import { NewsfeedBoostRotatorComponent } from './boost-rotator.component';
import { MockComponent, MockService } from '../../../utils/mock';
import { Client } from '../../../services/api';
import { ScrollService } from '../../../services/ux/scroll';
import { SettingsV2Service } from '../../settings-v2/settings-v2.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FeedsService } from '../../../common/services/feeds.service';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BoostFeedService } from '../services/boost-feed.service';

describe('NewsfeedBoostRotatorComponent', () => {
  let comp: NewsfeedBoostRotatorComponent;
  let fixture: ComponentFixture<NewsfeedBoostRotatorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          NewsfeedBoostRotatorComponent,
          MockComponent({
            selector: 'm-tooltipHint',
            inputs: [
              'icon',
              'storageKeyPrefix',
              'iconStyle',
              'tooltipBubbleStyle',
              'showArrow',
              'arrowOffset',
              'experimentId',
            ],
            outputs: ['click'],
          }),
        ],
        providers: [
          {
            provide: Session,
            useValue: MockService(Session),
          },
          {
            provide: Router,
            useValue: MockService(Router),
          },
          {
            provide: Client,
            useValue: MockService(Client),
          },
          {
            provide: ScrollService,
            useValue: MockService(ScrollService),
          },
          {
            provide: NewsfeedService,
            useValue: MockService(NewsfeedService),
          },
          {
            provide: SettingsV2Service,
            useValue: MockService(SettingsV2Service),
          },
          {
            provide: ElementRef,
            useValue: MockService(ElementRef),
          },
          {
            provide: ChangeDetectorRef,
            useValue: MockService(ChangeDetectorRef),
          },
          {
            provide: BoostFeedService,
            useValue: MockService(BoostFeedService, {
              has: ['feed$'],
              props: {
                feed$: {
                  get: (): Observable<BehaviorSubject<Object>[]> =>
                    new Observable<BehaviorSubject<Object>[]>(),
                },
                init: async (): Promise<void> => {},
              },
            }),
          },
          {
            provide: ConfigsService,
            useValue: MockService(ConfigsService),
          },
        ],
      })
        .overrideProvider(FeedsService, {
          useValue: MockService(FeedsService, {
            has: ['feed'],
            props: {
              feed: { get: () => new BehaviorSubject<any>([]) },
            },
          }),
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(NewsfeedBoostRotatorComponent);
    comp = fixture.componentInstance;

    (comp as any).session.getLoggedInUser.and.returnValue({
      boost_rating: 1,
      disabled_boost: false,
    });

    (comp as any).scroll.listenForView.and.returnValue(of(null));

    // (comp as any).feedsService.setEndpoint.and.returnValue(
    //   (comp as any).feedsService
    // );
    // (comp as any).feedsService.setParams.and.returnValue(
    //   (comp as any).feedsService
    // );
    // (comp as any).feedsService.setLimit.and.returnValue(
    //   (comp as any).feedsService
    // );
    // (comp as any).feedsService.setOffset.and.returnValue(
    //   (comp as any).feedsService
    // );
    // (comp as any).feedsService.fetch.and.returnValue(
    //   (comp as any).feedsService
    // );

    // stubbing function because it contains setInterval
    // which does not play nicely with the testbed.
    comp.start = () => void 0;

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

  it('should be hidden when component has NO boosts to show', () => {
    comp.disabled = false;
    comp.boosts = [];

    const boostRotatorElement: DebugElement = fixture.debugElement.query(
      By.css('.m-newsfeed__boostRotator')
    );

    expect(boostRotatorElement.nativeElement.hidden).toEqual(true);
  });

  it('should navigate on settings click', () => {
    comp.onSettingsClick();
    expect((comp as any).router.navigate).toHaveBeenCalledOnceWith([
      '/settings/account/boosted-content',
    ]);
  });

  it('should get the style for the tooltip bubble', () => {
    expect(comp.tooltipBubbleStyle).toEqual({
      'max-width': 'unset',
      width: 'max-content',
      right: 0,
    });
  });

  it('should get the style for the tooltip icon', () => {
    expect(comp.tooltipIconStyle).toEqual({
      'font-size': 20,
    });
  });
});
