import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { FeedNoticeService } from '../../services/feed-notice.service';
import { Session } from '../../../../services/session';
import {
  OnboardingStepName,
  OnboardingV3Service,
} from '../../../onboarding-v3/onboarding-v3.service';
import { OnboardingV3PanelService } from '../../../onboarding-v3/panel/onboarding-panel.service';
import { SetupChannelNoticeComponent } from './setup-channel-notice.component';
import { BehaviorSubject } from 'rxjs';
import { sessionMock } from '../../../../../tests/session-mock.spec';

describe('SetupChannelNoticeComponent', () => {
  let comp: SetupChannelNoticeComponent;
  let fixture: ComponentFixture<SetupChannelNoticeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          SetupChannelNoticeComponent,
          MockComponent({
            selector: 'm-feedNotice',
            inputs: ['icon', 'dismissible'],
            outputs: ['dismissClick'],
          }),
          MockComponent({
            selector: 'm-button',
            inputs: ['color', 'solid', 'size'],
            outputs: ['onAction'],
          }),
        ],
        providers: [
          {
            provide: Session,
            useValue: sessionMock,
          },
          {
            provide: FeedNoticeService,
            useValue: MockService(FeedNoticeService),
          },
          {
            provide: OnboardingV3Service,
            useValue: MockService(OnboardingV3Service, {
              has: ['completed$'],
              props: {
                completed$: { get: () => new BehaviorSubject<boolean>(false) },
              },
            }),
          },
          {
            provide: OnboardingV3PanelService,
            useValue: MockService(OnboardingV3PanelService, {
              has: ['currentStep$'],
              props: {
                currentStep$: {
                  get: () => new BehaviorSubject<OnboardingStepName>(null),
                },
              },
            }),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(SetupChannelNoticeComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  afterEach(() => {
    sessionMock.user = {
      ...sessionMock.user,
      username: 'test',
    };
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should dismiss modal when completed', () => {
    (comp as any).onboarding.completed$.next(true);
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'setup-channel'
    );
  });

  it('should get username', () => {
    sessionMock.user = {
      ...sessionMock.user,
      username: 'username',
    };
    expect(comp.username).toBe('@username');
  });

  it('should trim long usernames', () => {
    sessionMock.user = {
      ...sessionMock.user,
      username: '11111111111111111111111111111111111111111111111111',
    };
    expect(comp.username).toBe('@111111111111111111111111111111111...');
  });

  it('should get header text', () => {
    sessionMock.user = {
      ...sessionMock.user,
      username: 'test',
    };
    expect(comp.headerText).toBe('Who is @test?');
  });

  it('it should open onboarding modal on primary option click', () => {
    comp.onPrimaryOptionClick(null);
    expect((comp as any).onboardingPanel.currentStep$.getValue()).toBe(
      'SetupChannelStep'
    );
    expect((comp as any).onboarding.open).toHaveBeenCalled();
  });

  it('should call feed notice dismiss', () => {
    comp.dismiss();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'setup-channel'
    );
  });
});
