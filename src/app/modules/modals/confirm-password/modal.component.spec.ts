///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { ConfirmPasswordModalComponent } from './modal.component';
import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { AbbrPipe } from '../../../common/pipes/abbr';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { TokenPipe } from '../../../common/pipes/token.pipe';
import { Session } from '../../../services/session';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { sessionMock } from '../../../../tests/session-mock.spec';
/* tslint:disable */

describe('ConfirmPasswordCreatorComponent', () => {

  let comp: ConfirmPasswordModalComponent;
  let fixture: ComponentFixture<ConfirmPasswordModalComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MaterialMock,
        MaterialSwitchMock,
        AbbrPipe,
        TokenPipe,
        ConfirmPasswordModalComponent,
      ], // declare the test component
      imports: [
        FormsModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
      ]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(ConfirmPasswordModalComponent);

    comp = fixture.componentInstance; // LoginForm test instance
    clientMock.response = {};
    clientMock.response[`api/v2/settings/password/validate`] = {
      'status': 'success',
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

  it('should have a title, password should be initialized', () => {
    const title = fixture.debugElement.query(By.css('.m-confirm-password--modal'));
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain('Confirm password');

    expect(comp.form.value.password).toBe('');
  });

  it('password should update from form changes and call endpoint', fakeAsync(() => {
    comp.form.controls['password'].setValue('value');
    expect(comp.form.value.password).toEqual('value');
    comp._opts = {
      onComplete:() => {}
    };

    fixture.detectChanges();
    comp.submit();
    fixture.detectChanges();
    tick();
    expect(clientMock.post.calls.mostRecent().args[0]).toEqual('api/v2/settings/password/validate');

    expect(comp.overlayModal.dismiss).toHaveBeenCalled();
  }));

  it('password should update from form change and call endpoint', fakeAsync(() => {
    comp.form.controls['password'].setValue('value');
    expect(comp.form.value.password).toEqual('value');
    clientMock.response[`api/v2/settings/password/validate`] = {
      'status': 'failed',
    };
    comp.submit();
    fixture.detectChanges();
    expect(clientMock.post.calls.mostRecent().args[0]).toEqual('api/v2/settings/password/validate');
    
  }));
});
