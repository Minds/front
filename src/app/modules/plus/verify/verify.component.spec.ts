///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  Component,
  DebugElement,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
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
      declarations: [PlusVerifyComponent, TooltipComponentMock, ModalMock],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule],
      providers: [{ provide: Client, useValue: clientMock }],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(PlusVerifyComponent);
    comp = fixture.componentInstance;

    // Set up mock HTTP client
    clientMock.response = {};

    clientMock.response['api/v1/plus/verify'] = {
      status: 'success',
      channel: {
        guid: 'guidguid',
        name: 'name',
        username: 'username',
        icontime: 11111,
        subscribers_count: 182,
        impressions: 18200,
      },
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
    expect(clientMock.post.calls.mostRecent().args[0]).toEqual(
      'api/v1/plus/verify'
    );
  });
});
