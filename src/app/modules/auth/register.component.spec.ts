import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../services/session';
import { sessionMock } from '../../../tests/session-mock.spec';
import { clientMock } from '../../../tests/client-mock.spec';
import { Client } from '../../services/api/client';
import { signupModalServiceMock } from '../../mocks/modules/modals/signup/signup-modal-service.mock';
import { SignupModalService } from '../modals/signup/service';
import { loginReferrerServiceMock } from '../../mocks/services/login-referrer-service-mock.spec';
import { LoginReferrerService } from '../../services/login-referrer.service';
import { OnboardingService } from '../onboarding/onboarding.service';
import { onboardingServiceMock } from '../../mocks/modules/onboarding/onboarding.service.mock.spec';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MockComponent } from '../../utils/mock';

describe('RegisterComponent', () => {

  let comp: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [MockComponent(({selector: 'minds-form-register', template:'', inputs:['referrer'], outputs: ['done']})), RegisterComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: SignupModalService, useValue: signupModalServiceMock },
        { provide: LoginReferrerService, useValue: loginReferrerServiceMock },
        { provide: OnboardingService, useValue: onboardingServiceMock },
      ]
    })
      .compileComponents();
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);

    comp = fixture.componentInstance;

    window.Minds.cdn_assets_url = 'http://dev.minds.io/';
    comp.flags.canPlayInlineVideos = true;

    fixture.detectChanges();
  });

  it('should have a video with webm and mp4 sources', () => {
    const video: DebugElement = fixture.debugElement.query(By.css('.m-video-banner video'));
    expect(video).not.toBeNull();
    expect(video.nativeElement.poster).toBe('http://dev.minds.io/assets/videos/earth-1/earth-1.png');

    const webmSource: DebugElement = fixture.debugElement.query(By.css('video source:first-child'));
    const mp4Source: DebugElement = fixture.debugElement.query(By.css('video source:last-child'));

    expect(webmSource).not.toBeNull();
    expect(webmSource.nativeElement.src).toBe('http://dev.minds.io/assets/videos/earth-1/earth-1.webm');

    expect(mp4Source).not.toBeNull();
    expect(mp4Source.nativeElement.src).toBe('http://dev.minds.io/assets/videos/earth-1/earth-1.mp4');
  });

  it('should have a register prompt and the form', ()=> {
    const h3: DebugElement = fixture.debugElement.query(By.css('h3'));
    expect(h3).not.toBeNull();
    expect(h3.nativeElement.textContent).toBe('Not on Minds? Start a channel');

    expect(fixture.debugElement.query(By.css('minds-form-register'))).not.toBeNull();
  });

  it('should redirect when registered', ()=> {
    comp.registered();
    expect(onboardingServiceMock.show).toHaveBeenCalled();
    expect(signupModalServiceMock.setDisplay).toHaveBeenCalled();
    expect(signupModalServiceMock.setDisplay.calls.mostRecent().args[0]).toBe('onboarding');
    expect(signupModalServiceMock.open).toHaveBeenCalled();

    expect(loginReferrerServiceMock.navigate).toHaveBeenCalled();
    expect(loginReferrerServiceMock.navigate.calls.mostRecent().args[0]).toEqual({defaultUrl: '/test;onboarding=1'});
  });
});
