///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';

import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { TooltipComponentMock } from '../../../mocks/common/components/tooltip/tooltip.component';
import { By } from '@angular/platform-browser';
import { BoostPublisherComponent } from './publisher.component';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { BoostConsoleFilter } from '../console/console.component';

@Component({
  selector: 'm-date-selector',
  template: ''
})

export class DateSelectorComponentMock {
  @Input() label: string;
  @Input() date: string;
  @Output() dateChange: EventEmitter<any> = new EventEmitter<any>();
}

describe('BoostPublisherComponent', () => {
  let comp: BoostPublisherComponent;
  let fixture: ComponentFixture<BoostPublisherComponent>;

  function getBecomeAPublisher(): DebugElement {
    return fixture.debugElement.query(By.css('button.m-boost-publisher--become-a-publisher'));
  }

  function getStopBeingAPublisher(): DebugElement {
    return fixture.debugElement.query(By.css('button.m-boost-publisher--stop-being-a-publisher'));
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

  function navigateTo(section: 'settings' | 'earnings' | 'payout') {
    comp.filter = <BoostConsoleFilter>section;
    fixture.detectChanges();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MaterialMock,
        TooltipComponentMock,
        DateSelectorComponentMock,
        BoostPublisherComponent
      ],
      providers: [
        { provide: Client, useValue: clientMock },
      ]
    }).compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(BoostPublisherComponent);
    comp = fixture.componentInstance;

    window.Minds.user = {
      "guid": "123",
      "type": "user",
      "show_boosts": false,
      merchant: {},
    };

    // Set up mock HTTP client
    clientMock.response = {};
    clientMock.response['api/v1/boost/sums'] = {
      points_count: 3,
      points_earnings: 2,
      usd_count: 2,
      usd_earnings: 27
    };

    clientMock.response['api/v1/settings/123'] = {
      'status': 'success'
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

  it('.m-boost-publisher--options div should appear', () => {
    navigateTo('settings');
    expect(fixture.debugElement.query(By.css('.m-boost-publisher--options'))).not.toBeNull();
  });

  it('should have a \'Boost Publisher Configuration\' title', () => {
    navigateTo('settings');
    expect(fixture.debugElement.query(By.css('.m-boost-publisher--options-wallet h3'))).not.toBeNull();
  });

  it('should have a description', () => {
    navigateTo('settings');
    const p:DebugElement = fixture.debugElement.query(By.css('.m-boost-publisher--options-publisher--setup > p'));
    expect(p).not.toBeNull();
    expect(p.nativeElement.textContent.trim()).toBe('Being a publisher allows you to earn points and/or money by showing boosts on your channel page.');
  });

  it('should have a \'Become a Publisher\' button if the user isn\'t a publisher', () => {
    navigateTo('settings');
    expect(getBecomeAPublisher()).not.toBeNull();
  });

  it('clicking on the \'Become a Publisher\' button should update user\'s settings', () => {
    navigateTo('settings');

    clientMock.post.calls.reset();

    spyOn(comp,'submit').and.callThrough();
    getBecomeAPublisher().nativeElement.click();
    fixture.detectChanges();

    expect(comp.submit).toHaveBeenCalled();
    expect((<any>comp.submit).calls.mostRecent().args[0]).toBe(true);
    expect(clientMock.post).toHaveBeenCalled();
    const args = clientMock.post.calls.mostRecent().args;

    expect(args[0]).toBe('api/v1/settings/123');
    expect(args[1]).toEqual({'show_boosts': true});
  });

  it('should have a \'Stop Being a Publisher\' button once the user is a publisher', () => {
    window.Minds.user.show_boosts = true;
    navigateTo('settings');
    expect(getBecomeAPublisher()).toBeNull();

    expect(getStopBeingAPublisher).not.toBeNull();

  });

  it('clicking on the \'Stop Being a Publisher\' button should update user\'s settings', () => {
    window.Minds.user.show_boosts = true;
    navigateTo('settings');

    clientMock.post.calls.reset();

    spyOn(comp,'submit').and.callThrough();
    getStopBeingAPublisher().nativeElement.click();
    fixture.detectChanges();

    expect(comp.submit).toHaveBeenCalled();
    expect((<any>comp.submit).calls.mostRecent().args[0]).toBe(false);
    expect(clientMock.post).toHaveBeenCalled();
    const args = clientMock.post.calls.mostRecent().args;

    expect(args[0]).toBe('api/v1/settings/123');
    expect(args[1]).toEqual({'show_boosts': false});
  });

  it('should have a banner', () => {
    navigateTo('earnings');
    expect(fixture.debugElement.query(By.css('.m-boost-console--hero'))).not.toBeNull();
  });
  it('should have a \'Boost\' heading', () => {
    navigateTo('earnings');
    const heading: DebugElement = fixture.debugElement.query(By.css('.m-boost-console--hero-header > h2'));
    expect(heading).not.toBeNull();
    expect(heading.nativeElement.textContent.trim()).toBe('Boost');
  });

  it('should be three stats: amount of boosts shown, point earnings and usd earnings', fakeAsync(() => {
    navigateTo('earnings');

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
