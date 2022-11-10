import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Session } from '../../../services/session';
import { MockComponent, MockService } from '../../../utils/mock';
import { AuthModalService } from '../../auth/modal/auth-modal.service';
import { ComposerModalService } from '../../composer/components/modal/modal.service';
import { ComposerService } from '../../composer/services/composer.service';
import { SupermindExperimentService } from '../../experiments/sub-services/supermind-experiment.service';
import { SupermindButtonComponent } from './supermind-button.component';

describe('SupermindButtonComponent', () => {
  let comp: SupermindButtonComponent;
  let fixture: ComponentFixture<SupermindButtonComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          SupermindButtonComponent,
          MockComponent({
            selector: 'm-button',
            inputs: ['solid', 'borderless', 'color', 'size'],
            outputs: ['onAction'],
          }),
          MockComponent({
            selector: 'm-icon',
            inputs: ['from', 'iconId', 'sizeFactor', 'rem'],
          }),
        ],
        providers: [
          {
            provide: Session,
            useValue: MockService(Session),
          },
          {
            provide: AuthModalService,
            useValue: MockService(AuthModalService),
          },
          {
            provide: ComposerModalService,
            useValue: MockService(ComposerModalService),
          },
          {
            provide: ComposerService,
            useValue: MockService(ComposerService, {
              has: ['remind$', 'supermindRequest$'],
              props: {
                remind$: { get: () => new BehaviorSubject<any>(null) },
                supermindRequest$: {
                  get: () => new BehaviorSubject<any>(null),
                },
              },
            }),
          },
          {
            provide: SupermindExperimentService,
            useValue: MockService(SupermindExperimentService),
          },
          {
            provide: Injector,
            useValue: MockService(Injector),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(SupermindButtonComponent);
    comp = fixture.componentInstance;

    (comp as any).supermindExperiment.isActive.and.returnValue(true);
    (comp as any).composerService.remind$.next(null);
    (comp as any).composerService.supermindRequest$.next(null);

    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  it('should present composer modal on click when logged in for user', fakeAsync(() => {
    expect((comp as any).composerService.remind$.getValue()).toBe(null);
    expect((comp as any).composerService.supermindRequest$.getValue()).toBe(
      null
    );

    const entityUsername: string = 'entityUsername';
    const entityOwnerUsername: string = null;
    const entityType: string = 'user';
    comp.entity = {
      type: entityType,
      username: entityUsername,
      ownerObj: {
        username: entityOwnerUsername,
      },
    };

    (comp as any).session.getLoggedInUser.and.returnValue({ guid: 123 });
    (comp as any).composerModalService.setInjector.and.returnValue(
      (comp as any).composerModalService
    );

    comp.onClick(null);
    tick();

    expect((comp as any).composerService.remind$.getValue()).toEqual(null);
    expect((comp as any).composerService.supermindRequest$.getValue()).toEqual({
      receiver_guid: entityUsername,
      reply_type: 0,
      payment_options: {
        payment_type: 0,
        amount: 10,
      },
      twitter_required: false,
      terms_agreed: false,
      refund_policy_agreed: false,
    });
    expect((comp as any).composerModalService.setInjector).toHaveBeenCalledWith(
      (comp as any).injector
    );
    expect((comp as any).composerModalService.present).toHaveBeenCalled();
  }));

  it('should present composer modal on click when logged in for non-user entities', fakeAsync(() => {
    expect((comp as any).composerService.remind$.getValue()).toBe(null);
    expect((comp as any).composerService.supermindRequest$.getValue()).toBe(
      null
    );

    const entityUsername: string = null;
    const entityOwnerUsername: string = 'entityOwnerUsername';
    const entityType: string = 'activity';
    comp.entity = {
      type: entityType,
      username: entityUsername,
      ownerObj: {
        username: entityOwnerUsername,
      },
    };

    (comp as any).session.getLoggedInUser.and.returnValue({ guid: 123 });
    (comp as any).composerModalService.setInjector.and.returnValue(
      (comp as any).composerModalService
    );

    comp.onClick(null);
    tick();

    expect((comp as any).composerService.remind$.getValue()).toEqual(
      (comp as any).entity
    );
    expect((comp as any).composerService.supermindRequest$.getValue()).toEqual({
      receiver_guid: entityOwnerUsername,
      reply_type: 0,
      payment_options: {
        payment_type: 0,
        amount: 10,
      },
      twitter_required: false,
      terms_agreed: false,
      refund_policy_agreed: false,
    });
    expect((comp as any).composerModalService.setInjector).toHaveBeenCalledWith(
      (comp as any).injector
    );
    expect((comp as any).composerModalService.present).toHaveBeenCalled();
  }));

  it('should present auth modal to register on click when not logged in', fakeAsync(() => {
    (comp as any).session.getLoggedInUser.and.returnValue(null);

    comp.onClick(null);
    tick();

    expect((comp as any).session.getLoggedInUser).toHaveBeenCalled();
    expect((comp as any).authModal.open).toHaveBeenCalledWith({
      formDisplay: 'register',
    });
    expect((comp as any).composerService.remind$.getValue()).toEqual(null);
    expect((comp as any).composerService.supermindRequest$.getValue()).toEqual(
      null
    );
    expect(
      (comp as any).composerModalService.setInjector
    ).not.toHaveBeenCalled();
    expect((comp as any).composerModalService.present).not.toHaveBeenCalled();
  }));
});
