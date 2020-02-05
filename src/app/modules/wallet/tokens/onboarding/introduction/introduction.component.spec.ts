import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import {
  Component,
  DebugElement,
  ChangeDetectorRef,
  Input,
  Output,
} from '@angular/core';
import { TokenIntroductionOnboardingComponent } from './introduction.component';
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
import { ConfigsService } from '../../../../../common/services/configs.service';

describe('TokenIntroductionOnboardingComponent', () => {
  let comp: TokenIntroductionOnboardingComponent;
  let fixture: ComponentFixture<TokenIntroductionOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TokenIntroductionOnboardingComponent,
        MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
        MockComponent({
          selector: 'm-token--onboarding--video',
          inputs: ['src'],
        }),
      ],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: ChangeDetectorRef, useValue: ChangeDetectorRef },
        { provide: Router, useValue: RouterTestingModule },
        { provide: Session, useValue: sessionMock },
        { provide: Storage, useValue: storageMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(TokenIntroductionOnboardingComponent);
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

  it('should show next button and proper structure', () => {
    spyOn(comp.next, 'next').and.stub();
    expect(fixture.debugElement.query(By.css(`button`))).not.toBeNull();
    expect(
      fixture.debugElement.query(By.css(`.m-token--onboarding--slide`))
    ).not.toBeNull();
    expect(
      fixture.debugElement.query(By.css(`m-token--onboarding--video`))
    ).not.toBeNull();
    let next = fixture.debugElement.query(By.css(`button`));
    next.nativeElement.click();
    expect(comp.next.next).toHaveBeenCalled();
  });
});
