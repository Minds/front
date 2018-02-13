///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { clientMock } from '../../../../tests/client-mock.spec';
import { AbbrPipe } from '../../../common/pipes/abbr';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { FormsModule } from '@angular/forms';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { BanModalComponent } from './modal.component';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';

describe('BanModalComponent', () => {
  let comp: BanModalComponent;
  let fixture: ComponentFixture<BanModalComponent>;


  function getSubjectItem(i: number): DebugElement {
    return fixture.debugElement.queryAll(By.css(`.mdl-radio__button`))[i];
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [MaterialMock, MaterialSwitchMock, AbbrPipe, BanModalComponent], // declare the test component
      imports: [FormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
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
    fixture = TestBed.createComponent(BanModalComponent);
    clientMock.response = {};

    comp = fixture.componentInstance;

    //set the user
    comp.data = {
      'guid': '1',
      'type': 'user',
      'name': 'test',
      'username': 'test',
      'language': 'en',
      'banned': 'no',
      'city': 'Parana',
      'merchant': false,
      'boostProPlus': false,
      'fb': false,
      'mature': 1,
      'monetized': '',
      'signup_method': false,
      'feature_flags': false,
      'programs': [],
      'plus': false,
      'verified': true,
      'disabled_boost': false,
      'wire_rewards': null,
      'chat': true,
      'subscribed': false,
      'subscriber': false,
      'subscribers_count': 73,
      'subscriptions_count': 29,
      'impressions': 14761,
      'boost_rating': '2'
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

  it('should have a title', () => {
    const title = fixture.debugElement.query(By.css('.m-report-creator--header span'));
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain('Ban');
  });

  it('should have a disabled send button and get the guid from the object', () => {
    const button = fixture.debugElement.query(By.css('.m-report-creator--button-submit'));
    expect(button.properties.disabled).toBe(true);
  });


  it('should have a subject list with the expected items', () => {
    const subjectList = fixture.debugElement.query(By.css('.m-report-creator--subjects'));
    const subjectListInputs = fixture.debugElement.queryAll(By.css('.m-report-creator--subjects-subject'));
    expect(subjectList).not.toBeNull();
    expect(subjectListInputs.length).toBe(10);
  });

  it('once a item is clicked submit shouldnt be disabled', () => {
    const item = getSubjectItem(2);
    item.nativeElement.click();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.m-report-creator--button-submit'));
    expect(comp.subject).toEqual(3);
    expect(button.properties.disabled).toBe(false);
  });

  it('once a item is clicked and is not submittable, next button should appear, and 2nd step', () => {
    const item = getSubjectItem(9);
    item.nativeElement.click();
    fixture.detectChanges();
    const next = fixture.debugElement.query(By.css('.m-report-creator--button-next'));
    expect(next).not.toBeNull();
    next.nativeElement.click();
    fixture.detectChanges();
    expect(comp.next).toBe(true);
    const button = fixture.debugElement.query(By.css('.m-report-creator--button-submit'));
    expect(button.properties.disabled).toBe(false);
  });

  it('should show success msg after submission, calling with the expected params', fakeAsync(() => {
    clientMock.put.calls.reset();
    clientMock.response[`api/v1/admin/ban/1`] = { 'status': 'success' };

    const item = getSubjectItem(1);
    item.nativeElement.click();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.m-report-creator--button-submit'));
    expect(button.properties.disabled).toBe(false);
    button.nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(clientMock.put).toHaveBeenCalled();
    expect(clientMock.put.calls.mostRecent().args[1]).toEqual({
      subject: {
        label: 'Should be marked as explicit',
        value: 2
      }, note: ''
    });
    expect(comp.success).toBe(true);
    expect(comp.inProgress).toBe(false);
  }));

  it('should show error msg after submission, calling with the expected params', fakeAsync(() => {
    clientMock.put.calls.reset();
    clientMock.response[`api/v1/admin/ban/1`] = {
      'status': 'error',
      'message': 'error message',
    };

    const item = getSubjectItem(1);
    item.nativeElement.click();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.m-report-creator--button-submit'));
    expect(button.properties.disabled).toBe(false);
    button.nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(clientMock.put).toHaveBeenCalled();
    expect(clientMock.put.calls.mostRecent().args[1]).toEqual({
      subject: {
        label: 'Should be marked as explicit',
        value: 2
      }, note: ''
    });
    expect(comp.success).toBe(false);
    expect(comp.inProgress).toBe(false);
  }));

  it('once an item is clicked if it\'s the copyright one, next button shouldnt appear', () => {
    const item = getSubjectItem(8);
    item.nativeElement.click();
    fixture.detectChanges();
    const next = fixture.debugElement.query(By.css('.m-report-creator--button-next'));
    expect(next).toBeNull();
  });
});
