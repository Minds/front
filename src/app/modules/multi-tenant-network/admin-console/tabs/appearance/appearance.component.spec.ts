import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { MultiTenantConfigImageService } from '../../../services/config-image.service';
import { NetworkAdminConsoleAppearanceComponent } from './appearance.component';
import { MockService } from '../../../../../utils/mock';
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

describe('NetworkAdminConsoleAppearanceComponent', () => {
  let comp: NetworkAdminConsoleAppearanceComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleAppearanceComponent>;

  const squareLogoCount$ = new BehaviorSubject<number>(0);
  const faviconCount$ = new BehaviorSubject<number>(0);
  const horizontalLogoCount$ = new BehaviorSubject<number>(0);

  const siteUrl: string = 'https://example.minds.com/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkAdminConsoleAppearanceComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: MultiTenantConfigImageService,
          useValue: MockService(MultiTenantConfigImageService),
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
          useValue: MockService(MultiTenantConfigImageRefreshService, {
            has: ['squareLogoCount$', 'faviconCount$', 'horizontalLogoCount$'],
            props: {
              squareLogoCount$: {
                get: () => squareLogoCount$,
              },
              faviconCount$: {
                get: () => faviconCount$,
              },
              horizontalLogoCount$: {
                get: () => horizontalLogoCount$,
              },
            },
          }),
        },
        FormBuilder,
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: MetaService, useValue: MockService(MetaService) },
        { provide: SITE_URL, useValue: siteUrl },
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleAppearanceComponent);
    comp = fixture.componentInstance;

    (comp as any).multiTenantConfigService.config$.next(multiTenantConfigMock);
    comp.squareLogoFile$.next(null);
    comp.horizontalLogoFile$.next(null);
    comp.faviconFile$.next(null);
    squareLogoCount$.next(0);
    faviconCount$.next(0);
    horizontalLogoCount$.next(0);
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
        (comp as any).configImageRefreshCountService.incremenetSquareLogoCount
      ).toHaveBeenCalled();
      expect(
        (comp as any).configImageRefreshCountService
          .incremenetHorizontalLogoCount
      ).toHaveBeenCalled();
      expect(
        (comp as any).configImageRefreshCountService.incremenetFaviconCount
      ).toHaveBeenCalled();
      expect((comp as any).metaService.setDynamicFavicon).toHaveBeenCalledWith(
        `/api/v3/multi-tenant/configs/image/favicon?refresh=${faviconCount$.getValue()}`
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
