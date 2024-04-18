import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MultiTenantNetworkConfigService } from './config.service';
import {
  GetMultiTenantConfigGQL,
  MultiTenantColorScheme,
  SetMultiTenantConfigGQL,
  SetMultiTenantConfigMutationVariables,
} from '../../../../graphql/generated.engine';
import { ThemeService } from '../../../common/services/theme.service';
import { BehaviorSubject, of, take } from 'rxjs';
import { MockService } from '../../../utils/mock';
import { ThemeColorChangeService } from '../../../common/services/theme-color-change.service';
import { multiTenantConfigMock } from '../../../mocks/responses/multi-tenant-config.mock';

describe('MultiTenantNetworkConfigService', () => {
  let service: MultiTenantNetworkConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MultiTenantNetworkConfigService,
        {
          provide: GetMultiTenantConfigGQL,
          useValue: jasmine.createSpyObj<GetMultiTenantConfigGQL>(['fetch']),
        },
        {
          provide: SetMultiTenantConfigGQL,
          useValue: jasmine.createSpyObj<SetMultiTenantConfigGQL>(['mutate']),
        },
        {
          provide: ThemeService,
          useValue: MockService(ThemeService, {
            has: ['isDark$'],
            props: {
              isDark$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        {
          provide: ThemeColorChangeService,
          useValue: MockService(ThemeColorChangeService),
        },
      ],
    });

    service = TestBed.inject(MultiTenantNetworkConfigService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchConfig', () => {
    it('should fetch config', fakeAsync(() => {
      (service as any).configLoaded$.next(false);
      (service as any).getMultiTenantConfigGQL.fetch.and.returnValue(
        of({
          data: {
            multiTenantConfig: multiTenantConfigMock,
          },
        })
      );
      service.fetchConfig();
      tick();

      expect((service as any).config$.getValue()).toEqual(
        multiTenantConfigMock
      );
      expect((service as any).configLoaded$.getValue()).toBeTrue();
    }));

    it('should return empty object when fetching and getting no results', fakeAsync(() => {
      (service as any).getMultiTenantConfigGQL.fetch.and.returnValue(
        of({
          data: {
            multiTenantConfig: null,
          },
        })
      );
      service.fetchConfig();
      tick();

      expect((service as any).config$.getValue()).toEqual({});
    }));
  });

  describe('updateConfig', () => {
    it('should update configs and toggle to dark mode', (done: DoneFn) => {
      const colorScheme: MultiTenantColorScheme = MultiTenantColorScheme.Dark;
      const siteName: string = 'siteName';
      const primaryColor: string = '#ff0000';
      const values: any = {
        colorScheme: colorScheme,
        siteName: siteName,
        primaryColor: primaryColor,
      };

      (service as any).setMultiTenantConfigGQL.mutate.and.returnValue(
        of({
          data: {
            multiTenantConfig: multiTenantConfigMock,
          },
        })
      );

      service
        .updateConfig(values)
        .pipe(take(1))
        .subscribe((val) => {
          expect(
            (service as any).setMultiTenantConfigGQL.mutate
          ).toHaveBeenCalledWith(values);
          expect(service.config$.getValue()).toEqual(values);
          expect(
            (service as any).themeColorChangeService.changeFromConfig
          ).toHaveBeenCalled();
          expect((service as any).themeService.isDark$.getValue()).toBeTrue();
          done();
        });
    });

    it('should update configs and toggle to light mode', (done: DoneFn) => {
      const colorScheme: MultiTenantColorScheme = MultiTenantColorScheme.Light;
      const siteName: string = 'siteName';
      const primaryColor: string = '#ff0000';
      const values: any = {
        colorScheme: colorScheme,
        siteName: siteName,
        primaryColor: primaryColor,
      };

      (service as any).setMultiTenantConfigGQL.mutate.and.returnValue(
        of({
          data: {
            multiTenantConfig: multiTenantConfigMock,
          },
        })
      );

      service
        .updateConfig(values)
        .pipe(take(1))
        .subscribe((val) => {
          expect(
            (service as any).setMultiTenantConfigGQL.mutate
          ).toHaveBeenCalledWith(values);
          expect(service.config$.getValue()).toEqual(values);
          expect(
            (service as any).themeColorChangeService.changeFromConfig
          ).toHaveBeenCalled();
          expect((service as any).themeService.isDark$.getValue()).toBeFalse();
          done();
        });
    });
  });
});
