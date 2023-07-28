import { TestBed, ComponentFixture } from '@angular/core/testing';
import { GiftCardClaimLoggedOutPanelComponent } from './logged-out-panel.component';
import { AuthModalService } from '../../../../auth/modal/auth-modal.service';
import { GiftCardClaimPanelService } from '../panel.service';
import { Session } from '../../../../../services/session';
import { BehaviorSubject } from 'rxjs';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { GiftCardClaimPanelEnum } from '../claim-panel.enum';

describe('GiftCardClaimLoggedOutPanelComponent', () => {
  let comp: GiftCardClaimLoggedOutPanelComponent;
  let fixture: ComponentFixture<GiftCardClaimLoggedOutPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GiftCardClaimLoggedOutPanelComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['color'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        { provide: AuthModalService, useValue: MockService(AuthModalService) },
        {
          provide: GiftCardClaimPanelService,
          useValue: MockService(GiftCardClaimPanelService, {
            has: ['activePanel$'],
            props: {
              activePanel$: {
                get: () =>
                  new BehaviorSubject<GiftCardClaimPanelEnum>(
                    GiftCardClaimPanelEnum.LoggedOut
                  ),
              },
            },
          }),
        },
        {
          provide: Session,
          useValue: MockService(Session, {
            has: ['loggedinEmitter'],
            props: {
              loggedinEmitter: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
      ],
    });

    fixture = TestBed.createComponent(GiftCardClaimLoggedOutPanelComponent);
    comp = fixture.componentInstance;

    (comp as any).session.loggedinEmitter.next(false);
    (comp as any).panelService.activePanel$.next(
      GiftCardClaimPanelEnum.LoggedOut
    );
  });

  it('should create component', () => {
    expect(comp).toBeTruthy();
  });

  it('should open auth modal with login form display', () => {
    const formDisplay: 'login' | 'register' = 'login';
    comp.openAuthModal(formDisplay);
    expect((comp as any).authModal.open).toHaveBeenCalledWith({
      formDisplay: formDisplay,
    });
  });

  it('should open auth modal with register form display', () => {
    const formDisplay: 'login' | 'register' = 'register';
    comp.openAuthModal(formDisplay);
    expect((comp as any).authModal.open).toHaveBeenCalledWith({
      formDisplay: formDisplay,
    });
  });

  it('should redirect to redeem panel on login', () => {
    comp.ngOnInit();
    (comp as any).session.loggedinEmitter.next(true);
    expect((comp as any).panelService.activePanel$.getValue()).toBe(
      GiftCardClaimPanelEnum.Redeem
    );
  });

  it('should NOT redirect to redeem panel on logged out emitting false', () => {
    comp.ngOnInit();
    (comp as any).session.loggedinEmitter.next(false);
    expect((comp as any).panelService.activePanel$.getValue()).toBe(
      GiftCardClaimPanelEnum.LoggedOut
    );
  });

  it('should NOT redirect to redeem panel on init when not logged in', () => {
    (comp as any).session.loggedinEmitter.next(false);
    comp.ngOnInit();
    expect((comp as any).panelService.activePanel$.getValue()).toBe(
      GiftCardClaimPanelEnum.LoggedOut
    );
  });
});
