import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  Component,
  DebugElement,
  ChangeDetectorRef,
  Input,
  Output,
  ComponentFactoryResolver,
} from '@angular/core';
import { TokenOnboardingComponent } from './onboarding.component';
import { TokenCompletedOnboardingComponent } from './completed/completed.component';
import { TokenOnboardingService } from './onboarding.service';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { Client } from '../../../../services/api/client';
import {
  MockComponent,
  MockDirective,
  MockService,
} from '../../../../utils/mock';
import { Session } from '../../../../services/session';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { sessionMock } from '../../../../../tests/session-mock.spec';

import { Router } from '@angular/router';
import { storageMock } from '../../../../../tests/storage-mock.spec';
import { Storage } from '../../../../services/storage';

let tokenOnboardingService = new (function () {
  this.slide = null;
})();

describe('TokenOnboardingComponent', () => {
  let comp: TokenOnboardingComponent;
  let fixture: ComponentFixture<TokenOnboardingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TokenOnboardingComponent],
      imports: [FormsModule],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: ChangeDetectorRef, useValue: ChangeDetectorRef },
        { provide: Session, useValue: sessionMock },
        { provide: Router, useValue: RouterTestingModule },
        { provide: Storage, useValue: storageMock },
        { provide: TokenOnboardingService, useValue: tokenOnboardingService },
        {
          provide: ComponentFactoryResolver,
          useValue: ComponentFactoryResolver,
        },
      ],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(TokenOnboardingComponent);
    comp = fixture.componentInstance;

    comp.host = { viewContainerRef: { clear: () => {} } };

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

  it('should have proper structure', fakeAsync(() => {
    spyOn(sessionMock, 'getLoggedInUser').and.returnValue({
      guid: 1234,
      rewards: ['s'],
      eth_wallet: '0x0x0x',
    });
    fixture = TestBed.createComponent(TokenOnboardingComponent);
    comp = fixture.componentInstance;
    comp.detectChanges();
    expect(
      fixture.debugElement.query(By.css(`.m-token--onboarding`))
    ).not.toBeNull();
  }));
});
