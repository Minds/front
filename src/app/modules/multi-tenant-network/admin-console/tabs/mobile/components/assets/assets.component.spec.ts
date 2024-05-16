import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NetworkAdminConsoleMobileAssetsComponent } from './assets.component';
import {
  MobileConfigImageTypeEnum,
  MobileAppBuildImageService,
} from '../../services/mobile-app-build-image.service';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ToasterService } from '../../../../../../../common/services/toaster.service';

describe('NetworkAdminConsoleMobileAssetsComponent', () => {
  let comp: NetworkAdminConsoleMobileAssetsComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleMobileAssetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleMobileAssetsComponent,
        MockComponent({
          selector: 'm-networkAdminConsole__imageInput',
          inputs: ['image', 'type', 'inProgress'],
          outputs: ['onFileChange'],
        }),
      ],
      providers: [
        {
          provide: MobileAppBuildImageService,
          useValue: MockService(MobileAppBuildImageService, {
            has: [
              'iconPath$',
              'splashPath$',
              'squareLogoPath$',
              'horizontalLogoPath$',
              'monographicIconPath$',
              'iconFile$',
              'splashFile$',
              'squareLogoFile$',
              'horizontalLogoFile$',
              'monographicIconFile$',
            ],
            props: {
              iconPath$: { get: () => new BehaviorSubject<string>(null) },
              splashPath$: { get: () => new BehaviorSubject<string>(null) },
              squareLogoPath$: { get: () => new BehaviorSubject<string>(null) },
              horizontalLogoPath$: {
                get: () => new BehaviorSubject<string>(null),
              },
              monographicIconPath$: {
                get: () => new BehaviorSubject<string>(null),
              },
              iconFile$: { get: () => new BehaviorSubject<File>(null) },
              splashFile$: { get: () => new BehaviorSubject<File>(null) },
              squareLogoFile$: { get: () => new BehaviorSubject<File>(null) },
              horizontalLogoFile$: {
                get: () => new BehaviorSubject<File>(null),
              },
              monographicIconFile$: {
                get: () => new BehaviorSubject<File>(null),
              },
            },
          }),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleMobileAssetsComponent);
    comp = fixture.componentInstance;

    (comp as any).MobileAppBuildImageService.iconPath$.next('/icon.png');
    (comp as any).MobileAppBuildImageService.splashPath$.next('/splash.png');
    (comp as any).MobileAppBuildImageService.squareLogoPath$.next(
      '/square.png'
    );
    (comp as any).MobileAppBuildImageService.horizontalLogoPath$.next(
      '/horizontal.png'
    );
    (comp as any).MobileAppBuildImageService.monographicIconPath$.next(
      '/monographic-icon.png'
    );
    (comp as any).MobileAppBuildImageService.iconFile$.next(null);
    (comp as any).MobileAppBuildImageService.splashFile$.next(null);
    (comp as any).MobileAppBuildImageService.squareLogoFile$.next(null);
    (comp as any).MobileAppBuildImageService.horizontalLogoFile$.next(null);
    (comp as any).MobileAppBuildImageService.monographicIconFile$.next(null);

    comp.splashUploadInProgress$.next(false);
    comp.iconUploadInProgress$.next(false);
    comp.squareLogoUploadInProgress$.next(false);
    comp.horizontalLogoUploadInProgress$.next(false);
    comp.monographicIconUploadInProgress$.next(false);
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('onImageChange', () => {
    it('should handle image change for icon', fakeAsync(() => {
      const imageType: MobileConfigImageTypeEnum =
        MobileConfigImageTypeEnum.Icon;
      const file: File = new File([], 'icon.png');
      (comp as any).MobileAppBuildImageService.upload.and.returnValue(
        of({
          type: 4,
        })
      );

      comp.onImageChange(file, imageType);
      tick();

      expect(
        (comp as any).MobileAppBuildImageService.iconFile$.getValue()
      ).toBe(file);
      expect(
        (comp as any).MobileAppBuildImageService.upload
      ).toHaveBeenCalledWith(file, imageType);
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Upload successful'
      );
      expect(comp.iconUploadInProgress$.getValue()).toBe(false);
    }));

    it('should handle image change for splash', fakeAsync(() => {
      const imageType: MobileConfigImageTypeEnum =
        MobileConfigImageTypeEnum.Splash;
      const file: File = new File([], 'icon.png');
      (comp as any).MobileAppBuildImageService.upload.and.returnValue(
        of({
          type: 4,
        })
      );

      comp.onImageChange(file, imageType);
      tick();

      expect(
        (comp as any).MobileAppBuildImageService.splashFile$.getValue()
      ).toBe(file);
      expect(
        (comp as any).MobileAppBuildImageService.upload
      ).toHaveBeenCalledWith(file, imageType);
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Upload successful'
      );
      expect(comp.splashUploadInProgress$.getValue()).toBe(false);
    }));

    it('should handle image change for square logo', fakeAsync(() => {
      const imageType: MobileConfigImageTypeEnum =
        MobileConfigImageTypeEnum.SquareLogo;
      const file: File = new File([], 'icon.png');
      (comp as any).MobileAppBuildImageService.upload.and.returnValue(
        of({
          type: 4,
        })
      );

      comp.onImageChange(file, imageType);
      tick();

      expect(
        (comp as any).MobileAppBuildImageService.squareLogoFile$.getValue()
      ).toBe(file);
      expect(
        (comp as any).MobileAppBuildImageService.upload
      ).toHaveBeenCalledWith(file, imageType);
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Upload successful'
      );
      expect(comp.squareLogoUploadInProgress$.getValue()).toBe(false);
    }));

    it('should handle image change for horizontal logo', fakeAsync(() => {
      const imageType: MobileConfigImageTypeEnum =
        MobileConfigImageTypeEnum.HorizontalLogo;
      const file: File = new File([], 'icon.png');
      (comp as any).MobileAppBuildImageService.upload.and.returnValue(
        of({
          type: 4,
        })
      );

      comp.onImageChange(file, imageType);
      tick();

      expect(
        (comp as any).MobileAppBuildImageService.horizontalLogoFile$.getValue()
      ).toBe(file);
      expect(
        (comp as any).MobileAppBuildImageService.upload
      ).toHaveBeenCalledWith(file, imageType);
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Upload successful'
      );
      expect(comp.horizontalLogoUploadInProgress$.getValue()).toBe(false);
    }));

    it('should handle image change for horizontal logo', fakeAsync(() => {
      const imageType: MobileConfigImageTypeEnum =
        MobileConfigImageTypeEnum.MonographicIcon;
      const file: File = new File([], 'monographic-icon.png');
      (comp as any).MobileAppBuildImageService.upload.and.returnValue(
        of({
          type: 4,
        })
      );

      comp.onImageChange(file, imageType);
      tick();

      expect(
        (comp as any).MobileAppBuildImageService.monographicIconFile$.getValue()
      ).toBe(file);
      expect(
        (comp as any).MobileAppBuildImageService.upload
      ).toHaveBeenCalledWith(file, imageType);
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Upload successful'
      );
      expect(comp.monographicIconUploadInProgress$.getValue()).toBe(false);
    }));

    it('should ignore response types that are not 4', fakeAsync(() => {
      (comp as any).MobileAppBuildImageService.iconFile$.next(null);
      const imageType: MobileConfigImageTypeEnum =
        MobileConfigImageTypeEnum.Icon;
      const file: File = new File([], 'icon.png');
      (comp as any).MobileAppBuildImageService.upload.and.returnValue(
        of({
          type: 1,
        })
      );

      comp.onImageChange(file, imageType);
      tick();

      expect(
        (comp as any).MobileAppBuildImageService.iconFile$.getValue()
      ).toBe(file);
      expect(
        (comp as any).MobileAppBuildImageService.upload
      ).toHaveBeenCalledWith(file, imageType);
      expect((comp as any).toaster.success).not.toHaveBeenCalled();
      expect((comp as any).toaster.error).not.toHaveBeenCalled();
      expect(comp.iconUploadInProgress$.getValue()).toBe(true);
    }));

    it('should handle errors', fakeAsync(() => {
      const imageType: MobileConfigImageTypeEnum =
        MobileConfigImageTypeEnum.Icon;
      const file: File = new File([], 'icon.png');
      const errorMessage: string = 'Intentionally thrown test error';

      (comp as any).MobileAppBuildImageService.upload.and.returnValue(
        throwError(() => {
          return { error: { message: errorMessage } };
        })
      );

      comp.onImageChange(file, imageType);
      tick();

      expect((comp as any).toaster.error).toHaveBeenCalledWith(errorMessage);
      expect(
        (comp as any).MobileAppBuildImageService.upload
      ).toHaveBeenCalledWith(file, imageType);
      expect(
        (comp as any).MobileAppBuildImageService.iconFile$.getValue()
      ).toBe(null);
      expect((comp as any).toaster.success).not.toHaveBeenCalled();
      expect(comp.iconUploadInProgress$.getValue()).toBe(false);
    }));
  });
});
