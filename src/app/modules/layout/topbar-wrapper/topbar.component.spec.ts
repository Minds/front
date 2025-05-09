import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TopbarWrapperComponent } from './topbar.component';
import { MockComponent, MockService } from '../../../utils/mock';
import { Session } from '../../../services/session';
import { Router } from '@angular/router';
import { TopbarService } from '../../../common/layout/topbar.service';
import { BehaviorSubject } from 'rxjs';

describe('TopbarWrapperComponent', () => {
  let comp: TopbarWrapperComponent;
  let fixture: ComponentFixture<TopbarWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TopbarWrapperComponent,
        MockComponent({
          selector: 'm-topbar',
        }),
        MockComponent({
          selector: 'm-search--bar',
          inputs: ['defaultSizes'],
        }),
        MockComponent({
          selector: 'm-tooltip',
        }),
        MockComponent({
          selector: 'm-topbar__walletBalance',
        }),
        MockComponent({
          selector: 'm-icon',
          inputs: ['from', 'iconId', 'sizeFactor', 'rem'],
          outputs: ['click'],
        }),
        MockComponent({
          selector: 'm-notifications--topbar-toggle',
        }),
      ],
      providers: [
        {
          provide: Session,
          useValue: MockService(Session),
        },
        {
          provide: Router,
          useValue: MockService(Router),
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
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(TopbarWrapperComponent);
    comp = fixture.componentInstance;

    (comp as any).topbarService.isMinimalLightMode$.next(false);

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

  describe('onGiftIconClick', () => {
    it('should navigate on gift icon click', () => {
      comp.onGiftIconClick();
      expect((comp as any).router.navigate).toHaveBeenCalledOnceWith([
        '/wallet/credits/send',
      ]);
    });
  });

  describe('isMinimalLightMode$', () => {
    it('should get isMinimalLightMode$ from service', () => {
      (comp as any).topbarService.isMinimalLightMode$.next(true);
      expect((comp as any).isMinimalLightMode$.getValue()).toBeTrue();

      (comp as any).topbarService.isMinimalLightMode$.next(false);
      expect((comp as any).isMinimalLightMode$.getValue()).toBeFalse();
    });
  });
});
