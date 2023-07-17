import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { GiftCardClaimPanelEnum } from './panels/claim-panel.enum';
import { Session } from '../../../services/session';
import { GiftCardClaimComponent } from './claim.component';
import { MockComponent, MockService } from '../../../utils/mock';
import { GiftCardClaimPanelService } from './panels/panel.service';

describe('GiftCardClaimComponent', () => {
  let comp: GiftCardClaimComponent;
  let fixture: ComponentFixture<GiftCardClaimComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GiftCardClaimComponent,
        MockComponent({
          selector: 'm-giftCardClaimPanel__redeem',
        }),
        MockComponent({
          selector: 'm-giftCardClaimPanel__success',
        }),
        MockComponent({
          selector: 'm-giftCardClaimPanel__loggedOut',
        }),
      ],
      providers: [
        {
          provide: GiftCardClaimPanelService,
          useValue: MockService(GiftCardClaimPanelService, {
            has: ['activePanel$'],
            props: {
              activePanel$: {
                get: () =>
                  new BehaviorSubject<GiftCardClaimPanelEnum>(
                    GiftCardClaimPanelEnum.Redeem
                  ),
              },
            },
          }),
        },
        {
          provide: Session,
          useValue: MockService(Session),
        },
      ],
    });

    fixture = TestBed.createComponent(GiftCardClaimComponent);
    comp = fixture.componentInstance;

    (comp as any).session.isLoggedIn.and.returnValue(true);
    (comp as any).panelService.activePanel$.next(GiftCardClaimPanelEnum.Redeem);
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set activePanel$ to LoggedOut on init if user is not logged in', () => {
      (comp as any).session.isLoggedIn.and.returnValue(false);

      comp.ngOnInit();

      expect((comp as any).panelService.activePanel$.getValue()).toEqual(
        GiftCardClaimPanelEnum.LoggedOut
      );
    });
  });
});
