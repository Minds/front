import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';

import {
  Component,
  DebugElement,
  ChangeDetectorRef,
  Input,
  Output,
} from '@angular/core';
import { TokenCompletedOnboardingComponent } from './completed.component';
import { clientMock } from '../../../../../../tests/client-mock.spec';
import { Client } from '../../../../../services/api/client';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';

import { of } from 'rxjs/internal/observable/of';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MockComponent,
  MockDirective,
  MockService,
} from '../../../../../utils/mock';
import { Session } from '../../../../../services/session';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { sessionMock } from '../../../../../../tests/session-mock.spec';

import { storageMock } from '../../../../../../tests/storage-mock.spec';
import { Storage } from '../../../../../services/storage';

describe('TokenCompletedOnboardingComponent', () => {
  let comp: TokenCompletedOnboardingComponent;
  let fixture: ComponentFixture<TokenCompletedOnboardingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TokenCompletedOnboardingComponent],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: ChangeDetectorRef, useValue: ChangeDetectorRef },
        { provide: Router, useValue: RouterTestingModule },
        { provide: Session, useValue: sessionMock },
        { provide: Storage, useValue: storageMock },
      ],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(TokenCompletedOnboardingComponent);
    comp = fixture.componentInstance;
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

  it('should show complete button', fakeAsync(() => {
    spyOn(comp.next, 'next').and.stub();
    expect(fixture.debugElement.query(By.css(`button`))).not.toBeNull();
    comp.complete();
    expect(comp.next.next).toHaveBeenCalled();
  }));
});
