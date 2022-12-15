import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { Session } from '../../../services/session';
import { FeaturesService } from '../../../services/features.service';
import { NewsfeedService } from '../services/newsfeed.service';
import { ChangeDetectorRef, DebugElement, ElementRef } from '@angular/core';
import { NewsfeedBoostRotatorComponent } from './boost-rotator.component';
import { MockComponent, MockDirective, MockService } from '../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api';
import { ScrollService } from '../../../services/ux/scroll';
import { SettingsV2Service } from '../../settings-v2/settings-v2.service';
import { ActivityV2ExperimentService } from '../../experiments/sub-services/activity-v2-experiment.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { BehaviorSubject, of } from 'rxjs';
import { FeedsService } from '../../../common/services/feeds.service';
import { By } from '@angular/platform-browser';
import { componentWrapperDecorator } from '@storybook/angular';
import { DynamicBoostExperimentService } from '../../experiments/sub-services/dynamic-boost-experiment.service';

describe('NewsfeedBoostRotatorComponent', () => {
  let comp: NewsfeedBoostRotatorComponent;
  let fixture: ComponentFixture<NewsfeedBoostRotatorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NewsfeedBoostRotatorComponent],
        imports: [RouterTestingModule],
        providers: [
          {
            provide: Session,
            useValue: MockService(Session),
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
            provide: FeaturesService,
            useValue: MockService(FeaturesService),
          },
          {
            provide: FeedsService,
            useValue: MockService(FeedsService),
          },
          {
            provide: ActivityV2ExperimentService,
            useValue: MockService(ActivityV2ExperimentService),
          },
          {
            provide: DynamicBoostExperimentService,
            useValue: MockService(DynamicBoostExperimentService),
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

    (comp as any).feedsService.setEndpoint.and.returnValue(
      (comp as any).feedsService
    );
    (comp as any).feedsService.setParams.and.returnValue(
      (comp as any).feedsService
    );
    (comp as any).feedsService.setLimit.and.returnValue(
      (comp as any).feedsService
    );
    (comp as any).feedsService.setOffset.and.returnValue(
      (comp as any).feedsService
    );
    (comp as any).feedsService.fetch.and.returnValue(
      (comp as any).feedsService
    );

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
});
