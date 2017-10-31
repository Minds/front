///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick, flushMicrotasks } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
// import { AbbrPipe } from '../../../common/pipes/abbr';
// import { MaterialMock } from '../../../../tests/material-mock.spec';
// import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';
// import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
// import { OverlayModalService } from '../../../services/ux/overlay-modal';
// import { Scheduler } from '../../../common/components/scheduler/scheduler';

import { BoostConsoleComponent, BoostConsoleType, BoostConsoleFilter } from './console.component';
import { BoostService } from '../boost.service';

describe('BoostConsoleComponent', () => {
  let boostConsoleComponent: BoostConsoleComponent;
  let fixture: ComponentFixture<BoostConsoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BoostConsoleComponent
      ],
      imports: [],
      providers: [
        { provide: Client, useValue: clientMock },
        BoostService
      ]
    }).compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(BoostConsoleComponent);
    boostConsoleComponent = fixture.componentInstance;
    
    // Set up mock HTTP client
    clientMock.response = {};

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

  it('should pass a smoke test', () => {
    expect(1+1).toEqual(2);
  });

});
