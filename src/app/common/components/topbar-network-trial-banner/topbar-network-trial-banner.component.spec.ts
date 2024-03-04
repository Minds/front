import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopbarNetworkTrialBannerComponent } from './topbar-network-trial-banner.component';
import { ConfigsService } from '../../services/configs.service';
import { MockService } from '../../../utils/mock';
import moment = require('moment');
import { FriendlyTimePipe } from '../../pipes/friendlytime.pipe';
import { ChangeDetectorRef } from '@angular/core';

let mockTenantConfig = {
  trial_end: moment()
    .add(14, 'day')
    .unix(),
  network_deletion_timestamp: moment()
    .add(44, 'day')
    .unix(),
};

describe('TopbarNetworkTrialBannerComponent', () => {
  let comp: TopbarNetworkTrialBannerComponent;
  let fixture: ComponentFixture<TopbarNetworkTrialBannerComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [TopbarNetworkTrialBannerComponent, FriendlyTimePipe],
      providers: [
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        ChangeDetectorRef,
      ],
    });

    fixture = TestBed.createComponent(TopbarNetworkTrialBannerComponent);
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

    (comp as any).config.get
      .withArgs('tenant')
      .and.returnValue(mockTenantConfig);

    Object.defineProperty(comp, 'trialDeletionTimestamp', {
      writable: true,
    });
    Object.defineProperty(comp, 'trialEndTimestamp', {
      writable: true,
    });
    Object.defineProperty(comp, 'isPastDeletionThreshold', {
      writable: true,
    });
    Object.defineProperty(comp, 'isExpired', {
      writable: true,
    });
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('expired state', () => {
    it('should render correct text for an expired trial with 2 months left', () => {
      (comp as any).isExpired = true;
      (comp as any).trialDeletionTimestamp = moment()
        .add(2, 'month')
        .add(1, 'minute')
        .unix();
      (comp as any).isPastDeletionThreshold = false;

      fixture.detectChanges();
      (comp as any).cd.markForCheck();
      (comp as any).cd.detectChanges();

      expect(fixture.nativeElement.textContent.trim()).toBe(
        'This Minds Network is expired and will be deleted in 2 months. Upgrade now.'
      );
    });

    it('should render correct text for an expired trial with a month left', () => {
      (comp as any).isExpired = true;
      (comp as any).trialDeletionTimestamp = moment()
        .add(1, 'month')
        .add(1, 'minute')
        .unix();
      (comp as any).isPastDeletionThreshold = false;

      fixture.detectChanges();
      (comp as any).cd.markForCheck();
      (comp as any).cd.detectChanges();

      expect(fixture.nativeElement.textContent.trim()).toBe(
        'This Minds Network is expired and will be deleted in 30 days. Upgrade now.'
      );
    });

    it('should render correct text for an expired trial with a day left', () => {
      (comp as any).isExpired = true;
      (comp as any).trialDeletionTimestamp = moment()
        .add(1, 'day')
        .add(1, 'minute')
        .unix();
      (comp as any).isPastDeletionThreshold = false;

      fixture.detectChanges();
      (comp as any).cd.markForCheck();
      (comp as any).cd.detectChanges();

      expect(fixture.nativeElement.textContent.trim()).toBe(
        'This Minds Network is expired and will be deleted in a day. Upgrade now.'
      );
    });

    it('should render correct text for an expired trial with an hour left', () => {
      (comp as any).isExpired = true;
      (comp as any).trialDeletionTimestamp = moment()
        .add(1, 'hour')
        .add(1, 'minute')
        .unix();
      (comp as any).isPastDeletionThreshold = false;

      fixture.detectChanges();
      (comp as any).cd.markForCheck();
      (comp as any).cd.detectChanges();

      expect(fixture.nativeElement.textContent.trim()).toBe(
        'This Minds Network is expired and will be deleted in an hour. Upgrade now.'
      );
    });

    it('should render correct text for an expired trial with a minute left', () => {
      (comp as any).isExpired = true;
      (comp as any).trialDeletionTimestamp = moment()
        .add(1, 'minute')
        .add(20, 'seconds')
        .unix();
      (comp as any).isPastDeletionThreshold = false;

      fixture.detectChanges();
      (comp as any).cd.markForCheck();
      (comp as any).cd.detectChanges();

      expect(fixture.nativeElement.textContent.trim()).toBe(
        'This Minds Network is expired and will be deleted in a minute. Upgrade now.'
      );
    });

    it('should render correct text for an expired trial with 20 seconds left', () => {
      (comp as any).isExpired = true;
      (comp as any).trialDeletionTimestamp = moment()
        .add(5, 'seconds')
        .unix();
      (comp as any).isPastDeletionThreshold = false;

      fixture.detectChanges();
      (comp as any).cd.markForCheck();
      (comp as any).cd.detectChanges();

      expect(fixture.nativeElement.textContent.trim()).toBe(
        'This Minds Network is expired and will be deleted in a few seconds. Upgrade now.'
      );
    });

    it('should render correct text for an expired trial past its deletion threshold', () => {
      (comp as any).isExpired = true;
      (comp as any).trialDeletionTimestamp = moment().unix();
      (comp as any).isPastDeletionThreshold = true;

      fixture.detectChanges();
      (comp as any).cd.markForCheck();
      (comp as any).cd.detectChanges();

      expect(fixture.nativeElement.textContent.trim()).toBe(
        'This Minds Network is expired and will be deleted soon. Upgrade now.'
      );
    });
  });

  describe('active trial state', () => {
    it('should render correct text for an active trial with 2 months left', () => {
      (comp as any).isExpired = false;
      (comp as any).trialEndTimestamp = moment()
        .add(2, 'month')
        .add(1, 'minute')
        .unix();

      fixture.detectChanges();
      (comp as any).cd.markForCheck();
      (comp as any).cd.detectChanges();

      expect(fixture.nativeElement.textContent.trim()).toBe(
        'This trial of Minds Networks expires in 2 months. Upgrade now.'
      );
    });

    it('should render correct text for an active trial with a month left', () => {
      (comp as any).isExpired = false;
      (comp as any).trialEndTimestamp = moment()
        .add(1, 'month')
        .add(1, 'minute')
        .unix();

      fixture.detectChanges();
      (comp as any).cd.markForCheck();
      (comp as any).cd.detectChanges();

      expect(fixture.nativeElement.textContent.trim()).toBe(
        'This trial of Minds Networks expires in 30 days. Upgrade now.'
      );
    });

    it('should render correct text for an active trial with a day left', () => {
      (comp as any).isExpired = false;
      (comp as any).trialEndTimestamp = moment()
        .add(1, 'day')
        .add(1, 'minute')
        .unix();

      fixture.detectChanges();
      (comp as any).cd.markForCheck();
      (comp as any).cd.detectChanges();

      expect(fixture.nativeElement.textContent.trim()).toBe(
        'This trial of Minds Networks expires in a day. Upgrade now.'
      );
    });

    it('should render correct text for an active trial with an hour left', () => {
      (comp as any).isExpired = false;
      (comp as any).trialEndTimestamp = moment()
        .add(1, 'hour')
        .add(1, 'minute')
        .unix();

      fixture.detectChanges();
      (comp as any).cd.markForCheck();
      (comp as any).cd.detectChanges();

      expect(fixture.nativeElement.textContent.trim()).toBe(
        'This trial of Minds Networks expires in an hour. Upgrade now.'
      );
    });

    it('should render correct text for an active trial with a minute left', () => {
      (comp as any).isExpired = false;
      (comp as any).trialEndTimestamp = moment()
        .add(1, 'minute')
        .add(20, 'seconds')
        .unix();

      fixture.detectChanges();
      (comp as any).cd.markForCheck();
      (comp as any).cd.detectChanges();

      expect(fixture.nativeElement.textContent.trim()).toBe(
        'This trial of Minds Networks expires in a minute. Upgrade now.'
      );
    });

    it('should render correct text for an active trial with 20 seconds left', () => {
      (comp as any).isExpired = false;
      (comp as any).trialEndTimestamp = moment()
        .add(5, 'seconds')
        .unix();

      fixture.detectChanges();
      (comp as any).cd.markForCheck();
      (comp as any).cd.detectChanges();

      expect(fixture.nativeElement.textContent.trim()).toBe(
        'This trial of Minds Networks expires in a few seconds. Upgrade now.'
      );
    });
  });
});
