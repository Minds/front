import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscoveryFeedItemComponent } from './feed-item.component';
import { FeedBoostCtaExperimentService } from '../../experiments/sub-services/feed-boost-cta-experiment.service';
import { MockComponent, MockService } from '../../../utils/mock';
import { ConfigsService } from '../../../common/services/configs.service';
import { ChangeDetectorRef } from '@angular/core';

describe('DiscoveryFeedItemComponent', () => {
  let comp: DiscoveryFeedItemComponent;
  let fixture: ComponentFixture<DiscoveryFeedItemComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        DiscoveryFeedItemComponent,
        MockComponent({
          selector: 'm-publisherCard',
          inputs: ['publisher'],
          outputs: [],
        }),
        MockComponent({
          selector: 'm-activity',
          inputs: ['entity', 'displayOptions', 'slot'],
          outputs: ['deleted'],
        }),
      ],
      providers: [
        {
          provide: FeedBoostCtaExperimentService,
          useValue: MockService(FeedBoostCtaExperimentService),
        },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        ChangeDetectorRef,
      ],
    });

    fixture = TestBed.createComponent(DiscoveryFeedItemComponent);
    comp = fixture.componentInstance;

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

  describe('isFeedBoostCtaExperimentActive', () => {
    it('should set experiment to true on init', () => {
      (comp as any).feedBoostCtaExperimentService.isActive.and.returnValue(
        true
      );
      const _comp = new DiscoveryFeedItemComponent(
        (comp as any).feedBoostCtaExperimentService,
        (comp as any).configs,
        (comp as any).cd
      );
      expect((_comp as any).isFeedBoostCtaExperimentActive).toBeTrue();
    });

    it('should set experiment to false on init', () => {
      (comp as any).feedBoostCtaExperimentService.isActive.and.returnValue(
        false
      );
      const _comp = new DiscoveryFeedItemComponent(
        (comp as any).feedBoostCtaExperimentService,
        (comp as any).configs,
        (comp as any).cd
      );
      expect((_comp as any).isFeedBoostCtaExperimentActive).toBeFalse();
    });
  });
});
