import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminConsoleMobileSplashConfigComponent } from './splash-config.component';
import { MobileAppPreviewService } from '../../services/mobile-app-preview.service';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import {
  MobileSplashScreenTypeEnum,
  MobileWelcomeScreenLogoTypeEnum,
} from '../../../../../../../../graphql/generated.engine';

describe('NetworkAdminConsoleMobileSplashConfigComponent', () => {
  let comp: NetworkAdminConsoleMobileSplashConfigComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleMobileSplashConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleMobileSplashConfigComponent,
        MockComponent({
          selector: 'm-networkAdminConsole__radioBox',
          inputs: ['title', 'subtitle', 'saving', 'value', 'ngModel'],
          outputs: ['ngModelChange'],
        }),
      ],
      providers: [
        {
          provide: MobileAppPreviewService,
          useValue: MockService(MobileAppPreviewService, {
            has: [
              'splashScreenType$',
              'welcomeScreenLogoType$',
              'setMobileConfigInProgress$',
            ],
            props: {
              splashScreenType$: {
                get: () =>
                  new BehaviorSubject<MobileSplashScreenTypeEnum>(
                    MobileSplashScreenTypeEnum.Contain
                  ),
              },
              welcomeScreenLogoType$: {
                get: () =>
                  new BehaviorSubject<MobileWelcomeScreenLogoTypeEnum>(
                    MobileWelcomeScreenLogoTypeEnum.Horizontal
                  ),
              },
              setMobileConfigInProgress$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
      ],
    });

    fixture = TestBed.createComponent(
      NetworkAdminConsoleMobileSplashConfigComponent
    );
    comp = fixture.componentInstance;
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('setWelcomeScreenType', () => {
    it('should set welcome screen type', () => {
      const value: MobileWelcomeScreenLogoTypeEnum =
        MobileWelcomeScreenLogoTypeEnum.Horizontal;
      comp.welcomeScreenLogoType$.next(MobileWelcomeScreenLogoTypeEnum.Square);
      comp.setWelcomeScreenType(value);
      expect(
        (comp as any).MobileAppPreviewService.setMobileConfig
      ).toHaveBeenCalledWith({ mobileWelcomeScreenLogoType: value });
    });

    it('should not set welcome screen type if value is null', () => {
      const value: MobileWelcomeScreenLogoTypeEnum = null;
      comp.setWelcomeScreenType(value);
      expect(
        (comp as any).MobileAppPreviewService.setMobileConfig
      ).not.toHaveBeenCalled();
    });

    it('should not set welcome screen type if value is the same as current value', () => {
      const value: MobileWelcomeScreenLogoTypeEnum =
        MobileWelcomeScreenLogoTypeEnum.Horizontal;
      comp.welcomeScreenLogoType$.next(value);

      comp.setWelcomeScreenType(value);
      expect(
        (comp as any).MobileAppPreviewService.setMobileConfig
      ).not.toHaveBeenCalled();
    });
  });

  describe('setSplashScreenType', () => {
    it('should set welcome screen type', () => {
      const value: MobileSplashScreenTypeEnum =
        MobileSplashScreenTypeEnum.Contain;
      comp.splashScreenType$.next(MobileSplashScreenTypeEnum.Cover);
      comp.setSplashScreenType(value);
      expect(
        (comp as any).MobileAppPreviewService.setMobileConfig
      ).toHaveBeenCalledWith({ mobileSplashScreenType: value });
    });

    it('should not set welcome screen type if value is null', () => {
      const value: MobileSplashScreenTypeEnum = null;
      comp.setSplashScreenType(value);
      expect(
        (comp as any).MobileAppPreviewService.setMobileConfig
      ).not.toHaveBeenCalled();
    });

    it('should not set welcome screen type if value is the same as current value', () => {
      const value: MobileSplashScreenTypeEnum =
        MobileSplashScreenTypeEnum.Cover;
      comp.splashScreenType$.next(MobileSplashScreenTypeEnum.Cover);
      comp.setSplashScreenType(value);
      expect(
        (comp as any).MobileAppPreviewService.setMobileConfig
      ).not.toHaveBeenCalled();
    });
  });
});
