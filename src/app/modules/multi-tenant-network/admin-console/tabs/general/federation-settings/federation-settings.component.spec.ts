import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NetworkAdminConsoleFederationSettingsComponent } from './federation-settings.component';
import { MultiTenantNetworkConfigService } from '../../../../services/config.service';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { MultiTenantConfig } from '../../../../../../../graphql/generated.engine';
import { multiTenantConfigMock } from '../../../../../../mocks/responses/multi-tenant-config.mock';
import { ToasterService } from '../../../../../../common/services/toaster.service';

describe('NetworkAdminConsoleFederationSettingsComponent', () => {
  let comp: NetworkAdminConsoleFederationSettingsComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleFederationSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleFederationSettingsComponent,
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
      NetworkAdminConsoleFederationSettingsComponent
    );
    comp = fixture.componentInstance;

    (comp as any).multiTenantConfigService.config$.next(multiTenantConfigMock);
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set toggle state to not enabled on init when disabled', () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        federationDisabled: true,
      });

      comp.ngOnInit();

      expect(comp.enabledToggleState).toBe('off');
    });

    it('should set toggle state to enabled on init when not disabled', () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        federationDisabled: false,
      });

      comp.ngOnInit();

      expect(comp.enabledToggleState).toBe('on');
    });

    it('should set toggle state to enabled on init when value is null', () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        federationDisabled: null,
      });

      comp.ngOnInit();

      expect(comp.enabledToggleState).toBe('on');
    });
  });

  describe('onEnabledToggle', () => {
    it('should set toggle state to enabled when successful', async () => {
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      await comp.onEnabledToggle('on');

      expect(comp.enabledToggleState).toBe('on');
    });

    it('should set toggle state to disabled when successful', async () => {
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      await comp.onEnabledToggle('off');

      expect(comp.enabledToggleState).toBe('off');
    });

    it('should set toggle state to enabled when unsuccessful', async () => {
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      await comp.onEnabledToggle('on');

      expect(comp.enabledToggleState).toBe('on');
    });

    it('should set toggle state to disabled when unsuccessful', async () => {
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      await comp.onEnabledToggle('off');

      expect(comp.enabledToggleState).toBe('off');
    });
  });
});
