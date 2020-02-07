import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ForgotPasswordComponent } from './forgot-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import {
  Component,
  DebugElement,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { clientMock } from '../../../../tests/client-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { Session } from '../../../services/session';
import { Client } from '../../../services/api/client';
import { MockDirective } from '../../../utils/mock';

@Component({
  selector: '',
  template: '',
})
class BlankComponent {
  @Input() referrer: string;
  @Output() done: EventEmitter<any> = new EventEmitter<any>();
}

describe('ForgotPasswordComponent', () => {
  let comp: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  function getUsernameInput(): DebugElement {
    return fixture.debugElement.query(By.css('input#username'));
  }

  function getContinueButton(): DebugElement {
    return fixture.debugElement.query(
      By.css('.m-forgot-password--step-1 button')
    );
  }

  function getResetButton(): DebugElement {
    return fixture.debugElement.query(
      By.css('.m-forgot-password--step-3 button')
    );
  }

  function getPassword1Input(): DebugElement {
    return fixture.debugElement.query(By.css('input#password'));
  }

  function getPassword2Input(): DebugElement {
    return fixture.debugElement.query(By.css('input#password2'));
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
        BlankComponent,
        ForgotPasswordComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'newsfeed', component: BlankComponent },
        ]),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
      ],
    }).compileComponents();
  }));

  // synchronous beforeEach
  beforeEach(() => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    fixture = TestBed.createComponent(ForgotPasswordComponent);

    comp = fixture.componentInstance;

    clientMock.response = {};

    fixture.detectChanges();
  });

  it('should have a prompt to enter your username', () => {
    const prompt = fixture.debugElement.query(
      By.css('.m-forgot-password--step-1 .mdl-card__supporting-text')
    );
    expect(prompt).not.toBeNull();
    expect(prompt.nativeElement.textContent).toContain(
      'To request a new password, enter your username'
    );
  });

  it('should have a username input and a continue button', () => {
    expect(getUsernameInput()).not.toBeNull();
    const button = getContinueButton();
    expect(button).not.toBeNull();
    expect(button.nativeElement.textContent).toContain('Continue');
  });
  it('should move to step 2 after clicking on continue', fakeAsync(() => {
    spyOn(comp, 'request').and.callThrough();
    const url = 'api/v1/forgotpassword/request';

    clientMock.response[url] = { status: 'success' };

    const input = getUsernameInput();
    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    getContinueButton().nativeElement.click();
    jasmine.clock().tick(10);
    tick();
    fixture.detectChanges();

    expect(comp.request).toHaveBeenCalled();
    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toBe(url);
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      username: 'test',
    });
    expect(comp.step).toBe(2);
  }));

  it('should prompt the user that an email with the code has been sent on step 2', () => {
    comp.step = 2;
    fixture.detectChanges();

    const prompt = fixture.debugElement.query(
      By.css('.m-forgot-password--step-2 .mdl-card__supporting-text')
    );
    expect(prompt).not.toBeNull();
    expect(prompt.nativeElement.textContent).toContain(
      'We have sent an unlock code to your registered email address.'
    );
  });

  it('should allow the user to change its password in step 3', fakeAsync(() => {
    comp.step = 3;
    comp.username = 'test';
    comp.code = 'code';

    fixture.detectChanges();

    const prompt = fixture.debugElement.query(
      By.css('.m-forgot-password--step-3 .mdl-card__supporting-text')
    );
    expect(prompt).not.toBeNull();
    expect(prompt.nativeElement.textContent).toContain(
      'Please enter your new password'
    );

    const input1 = getPassword1Input();
    expect(input1).not.toBeNull();

    const input2 = getPassword2Input();
    expect(input2).not.toBeNull();

    input1.nativeElement.value = '123456';
    input1.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    input2.nativeElement.value = '123456';
    input2.nativeElement.dispatchEvent(new Event('input'));
    input2.nativeElement.dispatchEvent(new Event('keyup'));

    fixture.detectChanges();

    clientMock.post.calls.reset();
    const url = 'api/v1/forgotpassword/reset';
    clientMock.post[url] = { status: 'success' };

    getResetButton().nativeElement.click();
    jasmine.clock().tick(10);
    tick();
    fixture.detectChanges();

    expect(clientMock.post).toHaveBeenCalled();
    const args = clientMock.post.calls.mostRecent().args;
    expect(args[0]).toBe(url);
    expect(args[1]).toEqual({
      password: '123456',
      code: 'code',
      username: 'test',
    });
    expect(sessionMock.login).toHaveBeenCalled();
  }));
});
