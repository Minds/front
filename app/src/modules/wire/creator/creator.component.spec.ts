///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { VisibleWireError, WireCreatorComponent } from './creator.component';
import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { AbbrPipe } from '../../../common/pipes/abbr';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { WireService } from '../wire.service';

/* tslint:disable */
@Component({
  selector: 'm-wire--creator-rewards',
  template: ''
})
export class WireCreatorRewardsComponentMock {

  @Input() rewards: any;
  @Input() type: any | null;
  @Input() amount: string | number;
  @Input() channel: any;
  @Input() sums: any;
  @Output() selectAmount: EventEmitter<any> = new EventEmitter(true);
}

@Component({
  selector: 'minds-payments-stripe-checkout',
  outputs: [ 'inputed', 'done' ],
  template: ''
})

export class StripeCheckoutMock {

  inputed: EventEmitter<any> = new EventEmitter;
  done: EventEmitter<any> = new EventEmitter;

  @Input() amount: number = 0;
  @Input() merchant_guid;
  @Input() gateway: string = 'merchants';

  @Input('useMDLStyling') useMDLStyling: boolean = true;

  @Input() useCreditCard: boolean = true;
  @Input() useBitcoin: boolean = false;
}

describe('WireCreatorComponent', () => {

  let comp: WireCreatorComponent;
  let fixture: ComponentFixture<WireCreatorComponent>;
  let submitSection: DebugElement;
  let sendButton: DebugElement;

  const owner = {
    'guid': '123',
    'type': 'user',
    'subtype': false,
    'time_created': '1500037446',
    'time_updated': false,
    'container_guid': '0',
    'owner_guid': '0',
    'site_guid': false,
    'access_id': '2',
    'name': 'minds',
    'username': 'minds',
    'language': 'en',
    'icontime': false,
    'legacy_guid': false,
    'featured_id': false,
    'banned': 'no',
    'website': '',
    'briefdescription': 'test',
    'dob': '',
    'gender': '',
    'city': '',
    'merchant': {
      'service': 'stripe',
      'id': 'acct_1ApIzEA26BgQpK9C',
      'exclusive': { 'background': 1502453050, 'intro': '' }
    },
    'boostProPlus': false,
    'fb': false,
    'mature': 0,
    'monetized': '',
    'signup_method': false,
    'social_profiles': [],
    'feature_flags': false,
    'programs': [ 'affiliate' ],
    'plus': false,
    'verified': false,
    'disabled_boost': false,
    'categories': [ 'news', 'film', 'spirituality' ],
    'wire_rewards': null,
    'subscribed': false,
    'subscriber': false,
    'subscribers_count': 1,
    'subscriptions_count': 1,
    'impressions': 337,
    'boost_rating': '2'
  };

  function getPaymentMethodItem(i: number): DebugElement {
    return fixture.debugElement.query(By.css(`.m-wire--creator-selector > li:nth-child(${i})`));
  }

  function getAmountInput(): DebugElement {
    return fixture.debugElement.query(By.css('input.m-wire--creator-wide-input--edit'));
  }

  function getAmountLabel(): DebugElement {
    return fixture.debugElement.query(By.css('span.m-wire--creator-wide-input--label'));
  }

  function getRecurringCheckbox(): DebugElement {
    return fixture.debugElement.query(By.css('.m-wire--creator--recurring input[type=checkbox]'));
  }

  function getErrorLabel(): DebugElement {
    return fixture.debugElement.query(By.css('.m-wire--creator--submit-error'));
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MaterialMock,
        MaterialSwitchMock,
        AbbrPipe,
        WireCreatorRewardsComponentMock,
        StripeCheckoutMock,
        WireCreatorComponent ], // declare the test component
      imports: [ FormsModule, RouterTestingModule ],
      providers: [
        { provide: Client, useValue: clientMock },
        WireService,
        { provide: OverlayModalService, useValue: overlayModalServiceMock }
      ]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(WireCreatorComponent);

    comp = fixture.componentInstance; // LoginForm test instance
    clientMock.response = {};
    clientMock.response[ `api/v1/boost/rates` ] = {
      'status': 'success',
      'balance': 301529,
      'hasPaymentMethod': false,
      'rate': 1,
      'cap': 5000,
      'min': 100,
      'priority': 1,
      'usd': 1000,
      'minUsd': 1
    };
    clientMock.response[ `api/v1/wire/rewards/${owner.guid}` ] = {
      'status': 'success',
      'username': 'minds',
      'wire_rewards': {
        'description': 'description',
        'rewards': {
          'points': [ { 'amount': 10, 'description': 'description' }, {
            'amount': 100,
            'description': 'description'
          } ],
          'money': [ { 'amount': 1, 'description': 'description' }, {
            'amount': 10,
            'description': ':)'
          }, { 'amount': 1000, 'description': 'description' } ]
        }
      },
      'merchant': {
        'service': 'stripe',
        'id': 'acct_123',
        'exclusive': { 'background': 1502474954, 'intro': 'Support me!' }
      },
      'sums': { 'points': '40', 'money': '3096' }
    };

    submitSection = fixture.debugElement.query(By.css('.m-wire--creator-section--last'));
    sendButton = fixture.debugElement.query(By.css('.m-wire--creator--submit > button.m-wire--creator-button'));

    comp.owner = owner;

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
    jasmine.clock().uninstall();
  });

  it('should have a title', () => {
    const title = fixture.debugElement.query(By.css('.m-wire--creator--header span'));
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain('Wire');
  });

  it('should have the target user\'s avatar', () => {
    const avatar = fixture.debugElement.query(By.css('.m-wire--creator--header-text .m-wire--avatar'));
    expect(avatar).not.toBeNull();

    const avatarAnchor = avatar.query(By.css('a'));
    expect(avatarAnchor).not.toBeNull();
    expect(avatarAnchor.nativeElement.href).toContain('/' + comp.owner.username);

    const avatarImage = avatarAnchor.query(By.css('img'));
    expect(avatarImage).not.toBeNull();
    expect(avatarImage.nativeElement.src).toContain('icon/' + comp.owner.guid);
  });

  it('should have subtext', () => {
    const subtitle = fixture.debugElement.query(By.css('.m-wire-creator--subtext'));
    expect(subtitle).not.toBeNull();

    expect(subtitle.nativeElement.textContent).toContain('Support @' + comp.owner.username + ' by sending them dollars, points or Bitcoin. Once you send them the amount listed in the tiers, you can receive rewards if they are offered. Otherwise, it\'s a donation.');
  });

  it('should have a payment section', () => {
    const section = fixture.debugElement.query(By.css('section.m-wire--creator-payment-section'));
    expect(section).not.toBeNull();
  });

  it('payment section should have a title that says \'Wire Type\'', () => {
    const title = fixture.debugElement.query(By.css('section.m-wire--creator-payment-section > .m-wire--creator-section-title--small'));
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain('Wire Type');
  });

  it('should have payment method list (points, usd and bitcoin)', () => {
    const list = fixture.debugElement.query(By.css('section.m-wire--creator-payment-section > ul.m-wire--creator-selector'));
    expect(list).not.toBeNull();

    expect(list.nativeElement.children.length).toBe(3);

    expect(fixture.debugElement.query(By.css('.m-wire--creator-selector > li:first-child > .m-wire--creator-selector-type > h4')).nativeElement.textContent).toContain('Points');
    expect(fixture.debugElement.query(By.css('.m-wire--creator-selector > li:nth-child(2) > .m-wire--creator-selector-type > h4')).nativeElement.textContent).toContain('USD');
    expect(fixture.debugElement.query(By.css('.m-wire--creator-selector > li:last-child > .m-wire--creator-selector-type > h4')).nativeElement.textContent).toContain('Bitcoin');
  });

  it('usd payment option should only be available if the user\'s a merchant', fakeAsync(() => {
    comp.owner.merchant = undefined;
    fixture.detectChanges();

    const moneyOption = getPaymentMethodItem(2);

    expect(moneyOption.nativeElement.classList.contains('m-wire--creator-selector--disabled')).toBeTruthy();
  }));

  it('clicking on a payment option should highlight it', fakeAsync(() => {
    tick();
    const moneyOption = getPaymentMethodItem(2);

    expect(moneyOption.nativeElement.classList.contains('m-wire--creator-selector--highlight')).toBeFalsy();
    moneyOption.nativeElement.click();

    fixture.detectChanges();
    tick();

    expect(moneyOption.nativeElement.classList.contains('m-wire--creator-selector--highlight')).toBeTruthy();
  }));

  it('if selected payment method is usd, then a card selector should appear', fakeAsync(() => {
    tick();
    comp.setCurrency('money');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.m-wire--creator-payment'))).not.toBeNull();
  }));

  it('should have an amount section', () => {
    expect(fixture.debugElement.query(By.css('.m-wire--creator--amount'))).not.toBeNull();
  });

  it('amount section should have an input and a label', () => {
    expect(getAmountInput()).not.toBeNull();

    expect(getAmountLabel()).not.toBeNull();
  });

  it('changing amount input should change the wire\'s amount', () => {
    const amountInput: DebugElement = getAmountInput();

    amountInput.nativeElement.value = '10';
    amountInput.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(comp.wire.amount).toBe(10);
  });

  it('changing currency should change amount label', () => {
    const label: DebugElement = getAmountLabel();
    expect(label.nativeElement.textContent).toContain('points');

    comp.setCurrency('money');
    fixture.detectChanges();
    expect(label.nativeElement.textContent).toContain('USD');
  });

  it('should have a recurring checkbox', () => {
    comp.setCurrency('money');
    fixture.detectChanges();
    expect(getRecurringCheckbox()).not.toBeNull();
  });

  it('recurring checkbox should toggle wire\'s recurring property', () => {

    comp.setCurrency('money');
    fixture.detectChanges();

    expect(comp.wire.recurring).toBe(true);
    const checkbox: DebugElement = getRecurringCheckbox();

    checkbox.nativeElement.click();
    checkbox.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(comp.wire.recurring).toBe(false);
  });

  it('should show creator rewards', () => {
    expect(fixture.debugElement.query(By.css('m-wire--creator-rewards'))).not.toBeNull();
  });

  it('should have a submit section', () => {
    expect(submitSection).not.toBeNull();
  });

  it('if there are any errors, hovering over the submit section should show them', fakeAsync(() => {
    spyOn(comp, 'showErrors').and.callThrough();
    spyOn(comp, 'validate').and.callFake(() => {
      throw new VisibleWireError('I\'m an error');
    });
    submitSection.nativeElement.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    tick();

    expect(comp.showErrors).toHaveBeenCalled();

    expect(getErrorLabel().nativeElement.textContent).toContain('I\'m an error');
  }));

  it('should have a send button', () => {
    expect(sendButton).not.toBeNull();
  });

  it('send button should be disabled either if the user hasn\'t entered data, there\'s an error, the component\'s loading something or just saved the wire', () => {
    spyOn(comp, 'canSubmit').and.returnValue(true);

    fixture.detectChanges();

    expect(sendButton.nativeElement.disabled).toBeFalsy();

    comp.criticalError = true;
    fixture.detectChanges();

    expect(sendButton.nativeElement.disabled).toBeTruthy();

    comp.criticalError = false;
    comp.inProgress = true;
    fixture.detectChanges();

    expect(sendButton.nativeElement.disabled).toBeTruthy();

    comp.inProgress = false;
    comp.success = true;
    fixture.detectChanges();

    expect(sendButton.nativeElement.disabled).toBeTruthy();

    comp.success = false;
    (<jasmine.Spy>comp.canSubmit).and.returnValue(false);
    fixture.detectChanges();

    expect(sendButton.nativeElement.disabled).toBeTruthy();
  });

  it('send button should call submit()', () => {
    spyOn(comp, 'submit').and.callThrough();
    spyOn(comp, 'canSubmit').and.returnValue(true);

    fixture.detectChanges();

    sendButton.nativeElement.click();

    fixture.detectChanges();

    expect(comp.submit).toHaveBeenCalled();
  });

  it('send a correct wire', fakeAsync(() => {
    spyOn(comp, 'submit').and.callThrough();
    spyOn(comp, 'canSubmit').and.returnValue(true);

    const pointsOption = getPaymentMethodItem(1);
    pointsOption.nativeElement.click();

    fixture.detectChanges();

    const amountInput: DebugElement = getAmountInput();

    amountInput.nativeElement.value = '10';
    amountInput.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    //getRecurringCheckbox().nativeElement.click();

    fixture.detectChanges();

    clientMock.post.calls.reset();
    clientMock.response[ `api/v1/wire/${comp.wire.guid}` ] = { 'status': 'success' };

    sendButton.nativeElement.click();

    fixture.detectChanges();
    tick();

    expect(clientMock.post).toHaveBeenCalled();

    const args = clientMock.post.calls.mostRecent().args;

    expect(args[ 0 ]).toBe(`api/v1/wire/${comp.wire.guid}`);

    expect(args[ 1 ]).toEqual({
      payload: null,
      method: 'points',
      amount: 10,
      recurring: false
    });
  }));
});
