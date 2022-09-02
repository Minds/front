import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CommonModule } from '@angular/common';

import { By } from '@angular/platform-browser';
import { BoostConsoleCard } from './card.component';
import { boostServiceMock } from '../../../../mocks/modules/boost/boost.service.mock.spec';
import { BoostService } from '../../boost.service';
import { TokenPipe } from '../../../../common/pipes/token.pipe';
import { MockComponent } from '../../../../utils/mock';
import { ButtonComponent } from '../../../../common/components/button/button.component';
import { ActivityV2ExperimentService } from '../../../experiments/sub-services/activity-v2-experiment.service';

export let activityV2ExperimentServiceMock = new (function() {
  this.isActive = jasmine.createSpy('isActive').and.returnValue(true);
})();

describe('BoostConsoleCard', () => {
  let comp: BoostConsoleCard;
  let fixture: ComponentFixture<BoostConsoleCard>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MockComponent({
            selector: 'minds-card',
            template: '',
            inputs: ['object', 'flags'],
          }),
          TokenPipe,
          BoostConsoleCard,
          ButtonComponent,
        ],
        imports: [
          RouterTestingModule,
          ReactiveFormsModule,
          CommonModule,
          FormsModule,
        ],
      })
        .overrideComponent(BoostConsoleCard, {
          set: {
            providers: [
              {
                provide: BoostService,
                useValue: boostServiceMock,
              },
              {
                provide: ActivityV2ExperimentService,
                useValue: activityV2ExperimentServiceMock,
              },
            ],
          },
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    jasmine.clock().install();

    fixture = TestBed.createComponent(BoostConsoleCard);

    comp = fixture.componentInstance;
    comp.boost = {
      handler: 'newsfeed',
      destination: {
        username: 'test-user',
      },
      impressions: 3000,
      met_impressions: 1000,
      method: 'tokens',
      state: 'review',
      bid: 10000000000000000000,
      rejectiOn_reason: -1,
      postToFacebook: true,
      scheduledTs: 1525779264,
      entity: {},
    };
    comp.type = 'newsfeed';

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

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have a minds-card', () => {
    expect(fixture.debugElement.query(By.css('minds-card'))).toBeTruthy();
  });

  it('should show the impressions', () => {
    const impressions = fixture.debugElement.query(
      By.css('.m-boost-card--impressions')
    );
    expect(impressions).not.toBeNull();
    expect(impressions.nativeElement.textContent).toContain('3,000 views');
  });

  it('should show met impressions', () => {
    const impressions = fixture.debugElement.query(
      By.css('.m-boost-card--met-impressions')
    );
    expect(impressions).not.toBeNull();
    expect(impressions.nativeElement.textContent).toContain(
      '1,000 views so far'
    );
    comp.boost.state = 'completed';
    fixture.detectChanges();
    expect(impressions.nativeElement.textContent).toContain(
      '1,000 views delivered'
    );
  });

  it('should show the bid', () => {
    const bid = fixture.debugElement.query(By.css('.m-boost-card--bid'));
    expect(bid).not.toBeNull();
    expect(bid.nativeElement.textContent).toContain('10 tokens');
  });

  it('should have a state', () => {
    let state = fixture.debugElement.query(By.css('.m-boost-card--state'));
    expect(state).not.toBeNull();
    expect(state.nativeElement.textContent).toContain('review');
  });

  it('should have a facebook svg if postToFacebook', () => {
    const postToFacebook = fixture.debugElement.query(
      By.css('.m-boost-card--post-to-facebook')
    );
    const svg = fixture.debugElement.query(
      By.css('.m-boost-card--post-to-facebook svg')
    );
    expect(postToFacebook).not.toBeNull();
    expect(svg).not.toBeNull();
  });

  it('should show a button bar', () => {
    const buttons = fixture.debugElement.query(
      By.css('.m-boost-card--manager-item--buttons')
    );
    expect(buttons).not.toBeNull();

    const revoke = fixture.debugElement.query(
      By.css('.m-boostCardManagerButton--revoke button')
    );
    expect(revoke).not.toBeNull();
    expect(revoke.nativeElement.textContent).toContain('Revoke');
    revoke.nativeElement.click();
    expect(boostServiceMock.revoke).toHaveBeenCalled();

    const reject = fixture.debugElement.query(
      By.css('.m-boostCardManagerButton--reject button')
    );
    expect(reject).not.toBeNull();
    expect(reject.nativeElement.textContent).toContain('Reject');
    reject.nativeElement.click();
    expect(boostServiceMock.reject).toHaveBeenCalled();

    spyOn(window, 'confirm').and.callFake(function() {
      return true;
    });

    const accept = fixture.debugElement.query(
      By.css('.m-boostCardManagerButton--accept button')
    );
    expect(accept).not.toBeNull();
    expect(accept.nativeElement.textContent).toContain('Accept');
    accept.nativeElement.click();
  });
});
