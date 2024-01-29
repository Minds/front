import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MobileAppPreviewService } from './mobile-app-preview.service';
import { of, throwError } from 'rxjs';
import {
  GetMobileConfigGQL,
  GetMobileConfigPreviewStateGQL,
  MobilePreviewStatusEnum,
  MobileSplashScreenTypeEnum,
  MobileWelcomeScreenLogoTypeEnum,
  SetMobileConfigGQL,
  SetMobileConfigMutationVariables,
} from '../../../../../../../graphql/generated.engine';
import { MockService } from '../../../../../../utils/mock';
import { ToasterService } from '../../../../../../common/services/toaster.service';

describe('MobileAppPreviewService', () => {
  let service: MobileAppPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MobileAppPreviewService,
        {
          provide: GetMobileConfigGQL,
          useValue: jasmine.createSpyObj<GetMobileConfigGQL>(['fetch']),
        },
        {
          provide: GetMobileConfigPreviewStateGQL,
          useValue: jasmine.createSpyObj<GetMobileConfigPreviewStateGQL>([
            'watch',
          ]),
        },
        {
          provide: SetMobileConfigGQL,
          useValue: jasmine.createSpyObj<SetMobileConfigGQL>(['mutate']),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    service = TestBed.inject(MobileAppPreviewService);

    (service as any).getMobileConfigGql.fetch.calls.reset();
    (service as any).getMobilePreviewStateGql.watch.calls.reset();
    (service as any).setMobileConfigGql.mutate.calls.reset();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    it('should call server to init on init function call', fakeAsync(() => {
      (service as any).getMobileConfigGql.fetch.and.returnValue(
        of({
          data: {
            mobileConfig: {
              splashScreenType: MobileSplashScreenTypeEnum.Contain,
              welcomeScreenLogoType: MobileWelcomeScreenLogoTypeEnum.Horizontal,
              previewStatus: MobilePreviewStatusEnum.Ready,
              previewQRCode: 'test',
            },
          },
        })
      );

      // emulate immediate polling call to test it is being checked and not hold up the testbed.
      (service as any).getMobilePreviewStateGql.watch.and.returnValue({
        valueChanges: of({
          data: {
            mobileConfigPreviewState: {
              previewStatus: MobilePreviewStatusEnum.Ready,
              previewQRCode: 'test',
            },
          },
        }),
      });

      service.init();
      tick();

      expect((service as any).getMobileConfigGql.fetch).toHaveBeenCalled();
      expect(
        (service as any).getMobilePreviewStateGql.watch
      ).toHaveBeenCalledWith(null, {
        pollInterval: 30000,
      });
      expect((service as any).splashScreenType$.getValue()).toBe(
        MobileSplashScreenTypeEnum.Contain
      );
      expect((service as any).welcomeScreenLogoType$.getValue()).toBe(
        MobileWelcomeScreenLogoTypeEnum.Horizontal
      );
      expect((service as any).previewStatus$.getValue()).toBe(
        MobilePreviewStatusEnum.Ready
      );
      expect((service as any).previewQRCode$.getValue()).toBe('test');
    }));

    it('should handle error on call server to init on init function call', fakeAsync(() => {
      const errorMessage: string = 'Intentional test error';
      (service as any).getMobileConfigGql.fetch.and.returnValue(
        throwError(() => {
          return { error: { message: errorMessage } };
        })
      );

      service.init();
      tick();

      expect((service as any).getMobileConfigGql.fetch).toHaveBeenCalled();
      expect((service as any).toaster.error).toHaveBeenCalledWith(errorMessage);
      expect(
        (service as any).getMobilePreviewStateGql.watch
      ).not.toHaveBeenCalled();
    }));
  });

  describe('setMobileConfig', () => {
    it('should call server to set mobile config', fakeAsync(() => {
      const mobileConfig: SetMobileConfigMutationVariables = {
        mobileSplashScreenType: MobileSplashScreenTypeEnum.Contain,
        mobilePreviewStatus: MobilePreviewStatusEnum.NoPreview,
        mobileWelcomeScreenLogoType: MobileWelcomeScreenLogoTypeEnum.Horizontal,
      };

      (service as any).setMobileConfigGql.mutate.and.returnValue(
        of(mobileConfig)
      );

      service.setMobileConfig(mobileConfig);
      tick();

      expect((service as any).setMobileConfigGql.mutate).toHaveBeenCalledWith(
        mobileConfig
      );
      expect((service as any).toaster.success).toHaveBeenCalledWith(
        'Updated successfully'
      );

      expect((service as any).splashScreenType$.getValue()).toBe(
        MobileSplashScreenTypeEnum.Contain
      );
      expect((service as any).welcomeScreenLogoType$.getValue()).toBe(
        MobileWelcomeScreenLogoTypeEnum.Horizontal
      );
      expect((service as any).previewStatus$.getValue()).toBe(
        MobilePreviewStatusEnum.NoPreview
      );
    }));

    it('should handle errors on call server to set mobile config', fakeAsync(() => {
      const mobileConfig: SetMobileConfigMutationVariables = {
        mobileSplashScreenType: MobileSplashScreenTypeEnum.Contain,
        mobilePreviewStatus: MobilePreviewStatusEnum.NoPreview,
        mobileWelcomeScreenLogoType: MobileWelcomeScreenLogoTypeEnum.Horizontal,
      };
      const errorMessage: string = 'Intentional test error';
      (service as any).setMobileConfigGql.mutate.and.returnValue(
        throwError(() => {
          return { error: { message: errorMessage } };
        })
      );

      service.setMobileConfig(mobileConfig);
      tick();

      expect((service as any).setMobileConfigGql.mutate).toHaveBeenCalledWith(
        mobileConfig
      );
      expect((service as any).toaster.error).toHaveBeenCalledWith(errorMessage);
      expect((service as any).toaster.success).not.toHaveBeenCalled();
    }));
  });
});
