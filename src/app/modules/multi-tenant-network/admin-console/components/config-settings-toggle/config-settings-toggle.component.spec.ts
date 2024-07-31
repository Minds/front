import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NetworkAdminConsoleConfigSettingsToggleComponent } from './config-settings-toggle.component';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { MultiTenantNetworkConfigService } from '../../../services/config.service';
import { MultiTenantConfig } from '../../../../../../graphql/generated.engine';
import { multiTenantConfigMock } from '../../../../../mocks/responses/multi-tenant-config.mock';
import { ToasterService } from '../../../../../common/services/toaster.service';

describe('NetworkAdminConsoleConfigSettingsToggleComponent', () => {
  let comp: NetworkAdminConsoleConfigSettingsToggleComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleConfigSettingsToggleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleConfigSettingsToggleComponent,
        MockComponent({
          selector: 'm-toggle',
          inputs: ['mModel', 'leftValue', 'rightValue', 'offState'],
          outputs: ['mModelChange'],
        }),
      ],
      providers: [
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
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    fixture = TestBed.createComponent(
      NetworkAdminConsoleConfigSettingsToggleComponent
    );
    comp = fixture.componentInstance;

    comp.fieldName = 'digestEmailEnabled';
    comp.title = 'Digest Email';
    comp.description = 'Enable digest email';
    comp.toggleText = 'Enable digest email';

    (comp as any).multiTenantConfigService.config$.next(multiTenantConfigMock);
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set toggle state to not enabled on init when disabled', () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        digestEmailEnabled: false,
      });

      comp.ngOnInit();

      expect(comp.enabledToggleState).toBe('off');
    });

    it('should set toggle state to enabled on init when enabled', () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        digestEmailEnabled: true,
      });

      comp.ngOnInit();

      expect(comp.enabledToggleState).toBe('on');
    });
  });

  describe('onEnabledToggle', () => {
    it('should set toggle state to enabled when successful', async () => {
      (comp as any).digestEmailEnabled = false;
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      await comp.onEnabledToggle('on');

      expect(comp.enabledToggleState).toBe('on');
    });

    it('should set toggle state to disabled when successful', async () => {
      (comp as any).digestEmailEnabled = true;
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      await comp.onEnabledToggle('off');

      expect(comp.enabledToggleState).toBe('off');
    });

    it('should set toggle state to enabled when unsuccessful', async () => {
      (comp as any).digestEmailEnabled = true;
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      await comp.onEnabledToggle('on');

      expect(comp.enabledToggleState).toBe('on');
    });

    it('should set toggle state to disabled when unsuccessful', async () => {
      (comp as any).digestEmailEnabled = false;
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      await comp.onEnabledToggle('off');

      expect(comp.enabledToggleState).toBe('off');
    });
  });
});
