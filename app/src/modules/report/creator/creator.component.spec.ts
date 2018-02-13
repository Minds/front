///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, Directive, DebugElement, EventEmitter, Input, Output } from '@angular/core';

import { ReportCreatorComponent } from './creator.component';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { clientMock } from '../../../../tests/client-mock.spec';
import { AbbrPipe } from '../../../common/pipes/abbr';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { FormsModule } from '@angular/forms';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { OverlayModalService } from '../../../services/ux/overlay-modal';

import { REASONS } from '../../../services/list-options';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';

/* tslint:disable */
@Directive({
  selector: '[mdlRadio]',
  inputs: ['mdlRadio', 'checked', 'mdlRadioValue']
})
export class MdlRadioMock {
  
}

describe('ReportCreatorComponent', () => {
  let comp: ReportCreatorComponent;
  let fixture: ComponentFixture<ReportCreatorComponent>;

  function getSubjectItem(i: number): DebugElement {
    return fixture.debugElement.queryAll(By.css(`.mdl-radio__button`))[i];
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ MaterialMock, MdlRadioMock, MaterialSwitchMock, AbbrPipe, ReportCreatorComponent ], // declare the test component
      imports: [ FormsModule ],
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
    fixture = TestBed.createComponent(ReportCreatorComponent);
    clientMock.response = {};
    fixture.detectChanges();
    comp = fixture.componentInstance;
    comp.guid = '1';

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
    expect(title.nativeElement.textContent).toContain('Report');
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
    clientMock.post.calls.reset();
    clientMock.response[ `api/v1/entities/report/1` ] = {
      'status': 'success',
      done: true,
    };

    const item = getSubjectItem(1);
    item.nativeElement.click();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.m-report-creator--button-submit'));
    expect(button.properties.disabled).toBe(false);
    button.nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({ subject: 2, note: '' });
    expect(comp.success).toBe(true);
    expect(comp.inProgress).toBe(false);
  }));

  it('should not show succes if param is not true', fakeAsync(() => {
    clientMock.post.calls.reset();
    clientMock.response[ `api/v1/entities/report/1` ] = {
      'status': 'success',
      done: false,
    };

    const item = getSubjectItem(1);
    item.nativeElement.click();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.m-report-creator--button-submit'));
    expect(button.properties.disabled).toBe(false);
    button.nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({ subject: 2, note: '' });
    expect(comp.success).toBe(false);
    expect(comp.inProgress).toBe(false);
  }));

  it('should show error msg after submission, calling with the expected params', fakeAsync(() => {
    clientMock.post.calls.reset();
    clientMock.response[ `api/v1/entities/report/1` ] = {
      'status': 'error',
      done: false,
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
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({ subject: 2, note: '' });
    expect(comp.success).toBe(false);
    expect(comp.inProgress).toBe(false);
  }));


  /*it('should show error msg after submission, calling with the expected params', fakeAsync(() => {
    clientMock.post.calls.reset();
    clientMock.response[ `api/v1/entities/report/1` ] = {
      'status': 'error',
      done: false,
      'message': 'error message',
    };

    const item = getSubjectItem(1);
    item.nativeElement.click();
    fixture.detectChanges();
    comp.showErrors();
    fixture.detectChanges();
    comp.subject = null;
    comp.showErrors();
    fixture.detectChanges();
    expect(comp.error).toBe('There was an error sending your report.');
  }));*/

  it('once a item is clicked and its copyright one, next button should appear, and 2nd step should allow closing', () => {
    const item = getSubjectItem(8);
    item.nativeElement.click();
    fixture.detectChanges();
    const next = fixture.debugElement.query(By.css('.m-report-creator--button-next'));
    expect(next).not.toBeNull();
    next.nativeElement.click();
    expect(comp.subject).toEqual(10);
    expect(comp.next).toBe(true);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.m-report-creator--close button'));
    expect(button).not.toBeNull();
    button.nativeElement.click();
  });
});
