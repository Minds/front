import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import {
  FAVICON_PATH,
  HORIZONTAL_LOGO_PATH,
  MultiTenantConfigImageService,
  SQUARE_LOGO_PATH,
} from '../../../services/config-image.service';
import { NetworkAdminConsoleCustomizeComponent } from './customize.component';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { MultiTenantNetworkConfigService } from '../../../services/config.service';
import { MultiTenantConfigImageRefreshService } from '../../../services/config-image-refresh.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { MetaService } from '../../../../../common/services/meta.service';
import { SITE_URL } from '../../../../../common/injection-tokens/url-injection-tokens';
import { multiTenantConfigMock } from '../../../../../mocks/responses/multi-tenant-config.mock';
import {
  MultiTenantColorScheme,
  MultiTenantConfig,
} from '../../../../../../graphql/generated.engine';

describe('NetworkAdminConsoleCustomizeComponent', () => {
  let comp: NetworkAdminConsoleCustomizeComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleCustomizeComponent>;

  const squareLogoPath$ = new BehaviorSubject<string>(SQUARE_LOGO_PATH);
  const faviconPath$ = new BehaviorSubject<string>(FAVICON_PATH);
  const horizontalLogoPath$ = new BehaviorSubject<string>(HORIZONTAL_LOGO_PATH);

  const siteUrl: string = 'https://example.minds.com/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleCustomizeComponent,
        MockComponent({
          selector: 'm-networkAdminCustomScript',
        }),
      ],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: MultiTenantConfigImageService,
          useValue: MockService(MultiTenantConfigImageService, {
            has: ['squareLogoPath$', 'faviconPath$', 'horizontalLogoPath$'],
            props: {
              squareLogoPath$: {
                get: () => squareLogoPath$,
              },
              faviconPath$: {
                get: () => faviconPath$,
              },
              horizontalLogoPath$: {
                get: () => horizontalLogoPath$,
              },
            },
          }),
        },
        {
          provide: MultiTenantNetworkConfigService,
          useValue: MockService(MultiTenantNetworkConfigService, {
            has: ['config$'],
            props: {
              config$: {
                get: () =>
                  new BehaviorSubject<MultiTenantConfig>(multiTenantConfigMock),
              },
            },
          }),
        },
        {
          provide: MultiTenantConfigImageRefreshService,
          useValue: MockService(MultiTenantConfigImageRefreshService),
        },
        FormBuilder,
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: MetaService, useValue: MockService(MetaService) },
        { provide: SITE_URL, useValue: siteUrl },
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleCustomizeComponent);
    comp = fixture.componentInstance;

    (comp as any).multiTenantConfigService.config$.next(multiTenantConfigMock);
    comp.squareLogoFile$.next(null);
    comp.horizontalLogoFile$.next(null);
    comp.faviconFile$.next(null);
    squareLogoPath$.next(SQUARE_LOGO_PATH);
    faviconPath$.next(FAVICON_PATH);
    horizontalLogoPath$.next(HORIZONTAL_LOGO_PATH);
  });

  it('should create the component', fakeAsync(() => {
    expect(comp).toBeTruthy();
    comp.ngOnInit();
    tick();

    expect(comp.primaryColorHexFormControl.getRawValue()).toBe(
      multiTenantConfigMock.primaryColor
    );
    expect(comp.colorSchemeFormControl.getRawValue()).toBe(
      multiTenantConfigMock.colorScheme
    );
  }));

  describe('onSubmit', () => {
    it('should submit images and update config requests', fakeAsync(() => {
      comp.squareLogoFile$.next(new File([], 'square.png'));
      comp.horizontalLogoFile$.next(new File([], 'horizontal.png'));
      comp.faviconFile$.next(new File([], 'favicon.png'));
      (comp as any).colorSchemeFormControl.setValue(
        multiTenantConfigMock.colorScheme
      );
      (comp as any).primaryColorHexFormControl.setValue(
        multiTenantConfigMock.primaryColor
      );
      (comp as any).colorSchemeFormControl.markAsDirty();
      (comp as any).primaryColorHexFormControl.markAsDirty();
      (comp as any).configImageService.upload.and.returnValue(of(true));
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      comp.onSubmit();
      tick();

      expect((comp as any).configImageService.upload).toHaveBeenCalledTimes(3);
      expect(
        (comp as any).configImageRefreshCountService
          .updateSquareLogoLastCacheTimestamp
      ).toHaveBeenCalled();
      expect(
        (comp as any).configImageRefreshCountService
          .updateHorizontalLogoLastCacheTimestamp
      ).toHaveBeenCalled();
      expect(
        (comp as any).configImageRefreshCountService
          .updateFaviconLastCacheTimestamp
      ).toHaveBeenCalled();
      expect((comp as any).metaService.setDynamicFavicon).toHaveBeenCalledWith(
        FAVICON_PATH
      );
      expect(
        (comp as any).multiTenantConfigService.updateConfig
      ).toHaveBeenCalledWith({
        colorScheme: multiTenantConfigMock.colorScheme,
        primaryColor: multiTenantConfigMock.primaryColor,
      });
    }));

    it('should submit an image with no config requests', fakeAsync(() => {
      comp.squareLogoFile$.next(new File([], 'square.png'));
      (comp as any).colorSchemeFormControl.markAsPristine();
      (comp as any).primaryColorHexFormControl.markAsPristine();
      (comp as any).configImageService.upload.and.returnValue(of(true));

      comp.onSubmit();
      tick();

      expect((comp as any).configImageService.upload).toHaveBeenCalledTimes(1);
      expect(
        (comp as any).multiTenantConfigService.updateConfig
      ).not.toHaveBeenCalled();
    }));

    it('should submit update config with no images', fakeAsync(() => {
      (comp as any).colorSchemeFormControl.setValue(
        multiTenantConfigMock.colorScheme
      );
      (comp as any).primaryColorHexFormControl.setValue(
        multiTenantConfigMock.primaryColor
      );
      (comp as any).colorSchemeFormControl.markAsDirty();
      (comp as any).primaryColorHexFormControl.markAsDirty();
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      comp.onSubmit();
      tick();

      expect((comp as any).configImageService.upload).not.toHaveBeenCalled();
      expect(
        (comp as any).multiTenantConfigService.updateConfig
      ).toHaveBeenCalledWith({
        colorScheme: multiTenantConfigMock.colorScheme,
        primaryColor: multiTenantConfigMock.primaryColor,
      });
    }));
  });

  describe('onSquareLogoSelected', () => {
    it('should update component state on square logo selected', () => {
      (comp as any).configImageService.validateFileType.and.returnValue(true);
      const file: File = new File([], 'square');

      comp.onSquareLogoSelected(file);

      expect(comp.squareLogoFile$.getValue()).toEqual(file);
    });

    it('should NOT update component state when NULL square logo selected', () => {
      (comp as any).configImageService.validateFileType.and.returnValue(true);

      comp.onSquareLogoSelected(null);

      expect(comp.squareLogoFile$.getValue()).toBeNull();
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'A valid file must be provided.'
      );
    });

    it('should NOT update component state when square logo selected with invalid file type', () => {
      (comp as any).configImageService.validateFileType.and.returnValue(false);
      const file: File = new File([], 'square');

      comp.onSquareLogoSelected(file);

      expect(comp.squareLogoFile$.getValue()).toBeNull();
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'A valid file must be provided.'
      );
    });
  });

  describe('onFaviconSelected', () => {
    it('should update component state on favicon selected', () => {
      (comp as any).configImageService.validateFileType.and.returnValue(true);
      const file: File = new File([], 'favicon');

      comp.onFaviconSelected(file);

      expect(comp.faviconFile$.getValue()).toEqual(file);
    });

    it('should NOT update component state when NULL favicon selected', () => {
      (comp as any).configImageService.validateFileType.and.returnValue(true);

      comp.onFaviconSelected(null);

      expect(comp.faviconFile$.getValue()).toBeNull();
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'A valid file must be provided.'
      );
    });

    it('should NOT update component state when favicon selected with invalid file type', () => {
      (comp as any).configImageService.validateFileType.and.returnValue(false);
      const file: File = new File([], 'favicon');

      comp.onFaviconSelected(file);

      expect(comp.faviconFile$.getValue()).toBeNull();
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'A valid file must be provided.'
      );
    });
  });

  describe('onHorizontalLogoSelected', () => {
    it('should update component state on horizontal logo selected', () => {
      (comp as any).configImageService.validateFileType.and.returnValue(true);
      const file: File = new File([], 'horizontal_logo');

      comp.onHorizontalLogoSelected(file);

      expect(comp.horizontalLogoFile$.getValue()).toEqual(file);
    });

    it('should NOT update component state when NULL horizontal logo selected', () => {
      (comp as any).configImageService.validateFileType.and.returnValue(true);

      comp.onHorizontalLogoSelected(null);

      expect(comp.horizontalLogoFile$.getValue()).toBeNull();
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'A valid file must be provided.'
      );
    });

    it('should NOT update component state when horizontal logo selected with invalid file type', () => {
      (comp as any).configImageService.validateFileType.and.returnValue(false);
      const file: File = new File([], 'horizontal_logo');

      comp.onHorizontalLogoSelected(file);

      expect(comp.horizontalLogoFile$.getValue()).toBeNull();
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'A valid file must be provided.'
      );
    });
  });

  describe('onColorSchemeContainerClick', () => {
    it('should set form value on color scheme container click', () => {
      comp.colorSchemeFormControl.setValue(MultiTenantColorScheme.Light);
      comp.colorSchemeFormControl.markAsPristine();

      comp.onColorSchemeContainerClick(MultiTenantColorScheme.Dark);

      expect(comp.colorSchemeFormControl.value).toBe(
        MultiTenantColorScheme.Dark
      );
      expect(comp.colorSchemeFormControl.dirty).toBeTrue();
    });
  });
});
