///<reference path="../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Client } from '../../services/api/client';
import { clientMock } from '../../../tests/client-mock.spec';
import { PlusVerify } from '../../mocks/modules/plus/verify';
import { FooterComponentMock } from '../../mocks/modules/plus/footer';
import { FaqMock } from '../../mocks/modules/plus/faq';
import { PlusSubscription } from '../../mocks/modules/plus/subscription';
import { PlusSubscriptionComponent } from './subscription.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialMock } from '../../../tests/material-mock.spec';
import { MaterialSwitchMock } from '../../../tests/material-switch-mock.spec';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { By } from '@angular/platform-browser';


@Component({
    selector: 'minds-payments-stripe-checkout',
    outputs: ['inputed', 'done'],
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

describe('PlusSubscriptionComponent', () => {
  let comp: PlusSubscriptionComponent;
  let fixture: ComponentFixture<PlusSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MaterialMock,
        MaterialSwitchMock,
        PlusSubscriptionComponent,
        PlusSubscription,
        StripeCheckoutMock,
        PlusVerify,
        FaqMock
      ],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: Client, useValue: clientMock }
      ]
    }).compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(PlusSubscriptionComponent);
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
      "plus": true,
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

    clientMock.response['api/v1/plus/subscription'] = {
      'status': 'success',
      'source' : 'xxxxx'
    };

    clientMock.response['api/v1/plus/subscription'] = {
      'status': 'success',
      'active' : true
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
    jasmine.clock().uninstall();
  });

  it('Should load correctly', fakeAsync(() => {
    comp.user = {
      "feature_flags": false,
      "programs": ["affiliate"],
      "plus": true,
      "verified": false,
      "disabled_boost": false,
      "show_boosts": false,
      "chat": true,
      "subscribed": false,
    }
    const subscription = fixture.debugElement.query(By.css('.m-plus--subscription'));
    expect(subscription).not.toBeNull();
    fixture.detectChanges();
    expect(comp.isPlus()).toBe(true);
    comp.cancel();

    tick();
    fixture.detectChanges();

    expect(comp.isPlus()).toBe(false);
  }));

  it('Should load correctly plus is false', fakeAsync(() => {
    comp.user = {
      "feature_flags": false,
      "programs": ["affiliate"],
      "plus": false,
      "verified": false,
      "disabled_boost": false,
      "show_boosts": false,
      "chat": true,
      "subscribed": false,
    }
    const subscription = fixture.debugElement.query(By.css('.m-plus--subscription'));
    expect(subscription).not.toBeNull();
    fixture.detectChanges();
    expect(comp.isPlus()).toBe(false);
    comp.purchase();
    tick();
    fixture.detectChanges();

    expect(comp.isPlus()).toBe(true);
  }));

});
