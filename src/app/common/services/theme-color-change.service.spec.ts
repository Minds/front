import { TestBed } from '@angular/core/testing';
import { ThemeColorChangeService } from './theme-color-change.service';
import { ConfigsService } from './configs.service';
import { MockService } from '../../utils/mock';
import { ThemeConfig } from '../types/theme-config.types';
import { MultiTenantColorScheme } from '../../../graphql/generated.engine';

describe('ThemeColorChangeService', () => {
  let service: ThemeColorChangeService;
  const mockThemeConfig: ThemeConfig = {
    color_scheme: MultiTenantColorScheme.Dark,
    primary_color: '#ff0000',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ThemeColorChangeService,
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
      ],
    });

    service = TestBed.inject(ThemeColorChangeService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('changeFromConfig', () => {
    it('should change color from provided config', () => {
      service.changeFromConfig(mockThemeConfig);
      expect(
        document.documentElement.style.getPropertyValue(
          '--primary-action-light'
        )
      ).toBe(mockThemeConfig.primary_color);
      expect(
        document.documentElement.style.getPropertyValue('--primary-action-dark')
      ).toBe(mockThemeConfig.primary_color);
    });

    it('should change color from config from ConfigService', () => {
      (service as any).configs.get.and.returnValue(mockThemeConfig);
      service.changeFromConfig(null);

      expect((service as any).configs.get).toHaveBeenCalledWith(
        'theme_override'
      );
      expect(
        document.documentElement.style.getPropertyValue(
          '--primary-action-light'
        )
      ).toBe(mockThemeConfig.primary_color);
      expect(
        document.documentElement.style.getPropertyValue('--primary-action-dark')
      ).toBe(mockThemeConfig.primary_color);
    });
  });
});
