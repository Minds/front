import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { PageLayoutService } from '../../../../../common/layout/page-layout.service';
import { TopbarService } from '../../../../../common/layout/topbar.service';
import { NetworksCheckoutPageComponent } from './checkout-page.component';

describe('NetworksCheckoutPageComponent', () => {
  let comp: NetworksCheckoutPageComponent;
  let fixture: ComponentFixture<NetworksCheckoutPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworksCheckoutPageComponent,
        MockComponent({ selector: 'm-networksCheckout__base' }),
      ],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: PageLayoutService,
          useValue: MockService(PageLayoutService),
        },
        {
          provide: TopbarService,
          useValue: MockService(TopbarService, {
            has: ['isMinimalLightMode$'],
            props: {
              isMinimalLightMode$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworksCheckoutPageComponent);
    comp = fixture.componentInstance;
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init and set full width with minimal light mode', () => {
      comp.ngOnInit();

      expect((comp as any).pageLayoutService.useFullWidth).toHaveBeenCalled();
      expect(
        (comp as any).topbarService.isMinimalLightMode$.getValue()
      ).toBeTrue();
    });
  });

  describe('ngOnDestroy', () => {
    it('should destroy and reset full width with minimal light mode', () => {
      comp.ngOnDestroy();

      expect(
        (comp as any).pageLayoutService.cancelFullWidth
      ).toHaveBeenCalled();
      expect(
        (comp as any).topbarService.isMinimalLightMode$.getValue()
      ).toBeFalse();
    });
  });
});
