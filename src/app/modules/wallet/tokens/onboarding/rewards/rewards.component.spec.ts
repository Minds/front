import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  Component,
  DebugElement,
  ChangeDetectorRef,
  Input,
  Output,
} from '@angular/core';
import { TokenRewardsOnboardingComponent } from './rewards.component';
import { clientMock } from '../../../../../../tests/client-mock.spec';
import { Client } from '../../../../../services/api/client';
import {
  MockComponent,
  MockDirective,
  MockService,
} from '../../../../../utils/mock';
import { Session } from '../../../../../services/session';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { sessionMock } from '../../../../../../tests/session-mock.spec';
import { Router } from '@angular/router';
import { ConfigsService } from '../../../../../common/services/configs.service';

describe('TokenRewardsOnboardingComponent', () => {
  let comp: TokenRewardsOnboardingComponent;
  let fixture: ComponentFixture<TokenRewardsOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TokenRewardsOnboardingComponent,
        MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
        MockComponent({ selector: 'm-tooltip', inputs: ['icon', 'i18n'] }),
        MockComponent({ selector: 'm-phone-input' }),
        MockComponent({
          selector: 'm-token--onboarding--video',
          inputs: ['src'],
        }),
      ],
      imports: [FormsModule],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: ChangeDetectorRef, useValue: ChangeDetectorRef },
        { provide: Session, useValue: sessionMock },
        { provide: Router, useValue: RouterTestingModule },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    clientMock.response = {};
    clientMock.response[`api/v2/blockchain/rewards/verify`] = {
      status: 'success',
      secret: '0',
    };
    clientMock.response[`api/v2/blockchain/rewards/confirm`] = {
      status: 'success',
      secret: '0',
    };
    fixture = TestBed.createComponent(TokenRewardsOnboardingComponent);
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

  it('should show verify structure', fakeAsync(() => {
    expect(fixture.debugElement.query(By.css(`m-phone-input`))).not.toBeNull();
    expect(
      fixture.debugElement.query(By.css(`.m-token--onboarding--subtext`))
    ).not.toBeNull();
    expect(
      fixture.debugElement.query(By.css(`.m-token--onboarding--slide`))
    ).not.toBeNull();
    expect(
      fixture.debugElement.query(By.css(`m-token--onboarding--video`))
    ).not.toBeNull();
  }));

  it('should call proper endpoints', fakeAsync(() => {
    comp.number = 1111;
    comp.verify();
    tick();
    comp.cancel();
    tick();
    fixture.detectChanges();
    expect(clientMock.post.calls.mostRecent().args[0]).toBe(
      'api/v2/blockchain/rewards/verify'
    );
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      number: 1111,
    });
  }));

  it('should show confirm endpoints', fakeAsync(() => {
    comp.number = 1111;
    comp.confirm();
    tick();
    comp.join();
    fixture.detectChanges();
    expect(clientMock.post.calls.mostRecent().args[0]).toBe(
      'api/v2/blockchain/rewards/confirm'
    );
  }));

  it('should show confim endpoints and fail', fakeAsync(() => {
    spyOn(sessionMock, 'getLoggedInUser').and.returnValue({
      guid: 1234,
      rewards: ['s'],
    });
    clientMock.response[`api/v2/blockchain/rewards/confirm`] = {
      status: 'error',
      secret: '0',
    };
    fixture = TestBed.createComponent(TokenRewardsOnboardingComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    comp.number = 1111;
    comp.confirm();
    tick();

    fixture.detectChanges();
    expect(clientMock.post.calls.mostRecent().args[0]).toBe(
      'api/v2/blockchain/rewards/confirm'
    );
  }));
});
