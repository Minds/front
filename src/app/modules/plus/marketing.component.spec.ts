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
import { PlusMarketingComponent } from './marketing.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { By } from '@angular/platform-browser';


describe('PlusMarketingComponent', () => {
  let comp: PlusMarketingComponent;
  let fixture: ComponentFixture<PlusMarketingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlusMarketingComponent,
        PlusSubscription,
        FooterComponentMock,
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
    fixture = TestBed.createComponent(PlusMarketingComponent);
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

    clientMock.response['api/v1/plus'] = {
      'status': 'success',
      'active' : false
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


  it('Should load correctly', () => {
    const marketing = fixture.debugElement.query(By.css('.m-marketing--hero'));
    const marketingInner = fixture.debugElement.query(By.css('.m-marketing--hero--inner'));
    expect(marketing).not.toBeNull();
    expect(marketingInner).not.toBeNull();
  });

});
