///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';

import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { BoostConsoleComponent, BoostConsoleFilter, BoostConsoleType } from './console.component';
import { BoostService } from '../boost.service';
import { TooltipComponentMock } from '../../../mocks/common/components/tooltip/tooltip.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';
import { DateSelectorComponent } from '../../../common/components/date-selector/date-selector.component';

@Component({
  selector: 'm-date-selector',
  template: ''
})

export class DateSelectorComponentMock {
  @Input() label: string;
  @Input() date: string;
  @Output() dateChange: EventEmitter<any> = new EventEmitter<any>();
}


@Component({
  selector: 'm-boost-console-booster',
  template: ''
})
export class BoostConsoleBoosterMock {
  @Input('toggled') open: boolean = false;
  @Input('type') type: BoostConsoleType;

  load(refresh?: boolean) {

  }

  toggle() {

  }
}

@Component({
  selector: 'm-third-party-networks-facebook',
  template: ''
})

export class ThirdPartyNetworksFacebookMock {
  @Output() done: EventEmitter<any> = new EventEmitter(true);
}

@Component({
  selector: 'm-boost-console-network',
  template: ''
})
export class BoostConsoleNetworkListMock {
  @Input('type') type: BoostConsoleType;

  load(refresh?: boolean) {

  }
}

@Component({
  selector: 'm-boost-console-p2p',
  template: ''
})
export class BoostConsoleP2PListMock {
  @Input('filter') filter: BoostConsoleFilter;

  load(refresh?: boolean) {

  }
}

describe('BoostConsoleComponent', () => {
  let comp: BoostConsoleComponent;
  let fixture: ComponentFixture<BoostConsoleComponent>;

  function getBecomeAPublisher(): DebugElement {
    return fixture.debugElement.query(By.css('.m-boost-console--options-toggle > button'));
  }

  function getPointsCount(): DebugElement {
    return fixture.debugElement.query(By.css('.m-boost-console--overview-points-count > span'));
  }

  function getUSDCount(): DebugElement {
    return fixture.debugElement.query(By.css('.m-boost-console--overview-usd-count > span'));
  }

  function getPointEarnings(): DebugElement {
    return fixture.debugElement.query(By.css('.m-boost-console--overview-point-earnings > span'));
  }

  function getUSDEarnings(): DebugElement {
    return fixture.debugElement.query(By.css('.m-boost-console--overview-usd-earnings > span'));
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DateSelectorComponentMock,
        TooltipComponentMock,
        BoostConsoleBoosterMock,
        ThirdPartyNetworksFacebookMock,
        BoostConsoleNetworkListMock,
        BoostConsoleP2PListMock,
        BoostConsoleComponent
      ],
      imports: [RouterTestingModule],
      providers: [
        { provide: Client, useValue: clientMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: Observable.of({ type: 'newsfeed' }),
            snapshot: { params: { type: 'newsfeed' } }
          }
        },
        BoostService
      ]
    }).compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(BoostConsoleComponent);
    comp = fixture.componentInstance;
    window.Minds.user = {
      "guid": "732337264197111809",
      "type": "user",
      "subtype": false,
      "time_created": "1499978809",
      "time_updated": false,
      "container_guid": "0",
      "owner_guid": "0",
      "site_guid": false,
      "access_id": "2",
      "name": "minds",
      "username": "minds",
      "language": "en",
      "icontime": "1506690756",
      "legacy_guid": false,
      "featured_id": false,
      "banned": "no",
      "website": "",
      "dob": "",
      "gender": "",
      "city": "",
      "merchant": {},
      "boostProPlus": false,
      "fb": false,
      "mature": 0,
      "monetized": "",
      "signup_method": false,
      "social_profiles": [],
      "feature_flags": false,
      "programs": ["affiliate"],
      "plus": false,
      "verified": false,
      "disabled_boost": false,
      "show_boosts": false,
      "chat": true,
      "subscribed": false,
      "subscriber": false,
      "subscriptions_count": 1,
      "impressions": 10248,
      "boost_rating": "2",
      "spam": 0,
      "deleted": 0
    };

    // Set up mock HTTP client
    clientMock.response = {};
    clientMock.response['api/v1/boost/sums'] = {
      points_count: 3,
      points_earnings: 2,
      usd_count: 2,
      usd_earnings: 27
    };

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  afterEach(() => {
    // reset jasmine clock after each test
    jasmine.clock().uninstall();
  });

  it('should have a \'become a publisher\' banner', () => {
    expect(fixture.debugElement.query(By.css('.m-boost-console--hero'))).not.toBeNull();
  });
  it('should have a \'Boost\' heading', () => {
    const heading: DebugElement = fixture.debugElement.query(By.css('.m-boost-console--hero-header > h2'));
    expect(heading).not.toBeNull();
    expect(heading.nativeElement.textContent.trim()).toBe('Boost');
  });
  it('should have a \'become a publisher\' banner', () => {
    expect(fixture.debugElement.query(By.css('.m-boost-console--hero'))).not.toBeNull();
  });
  it('should have a \'Become a publisher\' button', () => {
    expect(getBecomeAPublisher()).not.toBeNull();
  });
  it('clicking on \'Become a Publisher\' should call api/v1/settings and then the button should disappear', fakeAsync(() => {
    const button = getBecomeAPublisher();
    clientMock.response['api/v1/settings/732337264197111809'] = { 'status': 'success' };

    spyOn(comp, 'becomeAPublisher').and.callThrough();
    spyOn(comp, 'getStatistics').and.callThrough();
    button.nativeElement.click();

    fixture.detectChanges();
    tick();

    expect(comp.becomeAPublisher).toHaveBeenCalled();
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({ 'show_boosts': true });
    expect(comp.getStatistics).toHaveBeenCalled();

    expect(getBecomeAPublisher()).toBeNull();
  }));
  it('if the user\'s a publisher, then statistics should be shown instead of the button', () => {
    window.Minds.user.show_boosts = true;
    fixture.detectChanges();

    expect(getBecomeAPublisher()).toBeNull();

    expect(fixture.debugElement.query(By.css('.m-boost-console--overview'))).not.toBeNull();
  });
  it('should be three stats: amount of boosts shown, point earnings and usd earnings', fakeAsync(() => {
    getBecomeAPublisher().nativeElement.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const pointsCount = getPointsCount();
    const pointEarnings = getPointEarnings();
    const usdCount = getUSDCount();
    const usdEarnings = getUSDEarnings();

    expect(pointsCount).not.toBeNull();
    expect(pointsCount.nativeElement.textContent).toBe('3');
    expect(pointEarnings).not.toBeNull();
    expect(pointEarnings.nativeElement.textContent).toBe('2');

    expect(usdCount).not.toBeNull();
    expect(usdCount.nativeElement.textContent).toBe('2');
    expect(usdEarnings).not.toBeNull();
    expect(usdEarnings.nativeElement.textContent).toBe('27');
  }));
  it('usd earnings shouldn\'t appear if the user isn\'t a merchant', () => {
    window.Minds.user.show_boosts = true;
    window.Minds.user.merchant = null;
    fixture.detectChanges();

    expect(getUSDEarnings()).toBeNull();
  });

});
