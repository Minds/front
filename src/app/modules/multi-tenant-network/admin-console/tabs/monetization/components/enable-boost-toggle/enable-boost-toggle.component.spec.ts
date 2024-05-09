import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NetworkAdminEnableBoostToggleComponent } from './enable-boost-toggle.component';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { MultiTenantNetworkConfigService } from '../../../../../services/config.service';
import { MultiTenantConfig } from '../../../../../../../../graphql/generated.engine';
import { multiTenantConfigMock } from '../../../../../../../mocks/responses/multi-tenant-config.mock';
import { ToasterService } from '../../../../../../../common/services/toaster.service';

describe('NetworkAdminEnableBoostToggleComponent', () => {
  let comp: NetworkAdminEnableBoostToggleComponent;
  let fixture: ComponentFixture<NetworkAdminEnableBoostToggleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminEnableBoostToggleComponent,
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

    fixture = TestBed.createComponent(NetworkAdminEnableBoostToggleComponent);
    comp = fixture.componentInstance;

    (comp as any).multiTenantConfigService.config$.next(multiTenantConfigMock);
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set toggle state to enabled on init when boost is enabled', () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        boostEnabled: true,
      });

      comp.ngOnInit();

      expect(comp.enabledToggleState).toBe('on');
    });

    it('should set toggle state to disabled on init when boost is disabled', () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        boostEnabled: false,
      });

      comp.ngOnInit();

      expect(comp.enabledToggleState).toBe('off');
    });

    it('should set toggle state to disabled on init when value is null', () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        boostEnabled: null,
      });

      comp.ngOnInit();

      expect(comp.enabledToggleState).toBe('off');
    });
  });

  describe('onEnabledToggle', () => {
    it('should set toggle state to enabled when successful', async () => {
      (comp as any).enabledToggleState = 'off';
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      await comp.onEnabledToggle('on');

      expect(comp.enabledToggleState).toBe('on');
    });

    it('should set toggle state to disabled when successful', async () => {
      (comp as any).enabledToggleState = 'on';
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      await comp.onEnabledToggle('off');

      expect(comp.enabledToggleState).toBe('off');
    });

    it('should set toggle state back to enabled when unsuccessful', async () => {
      (comp as any).enabledToggleState = 'on';
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(false)
      );

      await comp.onEnabledToggle('off');

      expect(comp.enabledToggleState).toBe('on');
    });
  });
});
