///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { PlusVerifyComponent } from './verify.component';
import { TooltipComponentMock } from '../../../mocks/common/components/tooltip/tooltip.component';
import { ModalMock } from '../../../mocks/common/components/modal/modal';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { By } from '@angular/platform-browser';


describe('PlusVerifyComponent', () => {
  let comp: PlusVerifyComponent;
  let fixture: ComponentFixture<PlusVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlusVerifyComponent,
        TooltipComponentMock,
        ModalMock,
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
    fixture = TestBed.createComponent(PlusVerifyComponent);
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

    clientMock.response['api/v1/plus/verify'] = {
      'status': 'success',
      'channel' : { guid: 'guidguid', name: 'name', username: 'username', icontime: 11111, subscribers_count:182, impressions:18200}
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
    const modal = fixture.debugElement.query(By.css('m-modal'));
    expect(modal).not.toBeNull();
    expect(comp.form).not.toBeNull();
  });

  it('Should load correctly', () => {
    comp.submit({});
    fixture.detectChanges();
    expect(clientMock.post.calls.mostRecent().args[0]).toEqual('api/v1/plus/verify');
  });

});
