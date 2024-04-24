import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NetworkAdminConsoleEnableLandingPageToggleComponent } from './enable-landing-page-toggle.component';
import { MultiTenantNetworkConfigService } from '../../../../services/config.service';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { MultiTenantConfig } from '../../../../../../../graphql/generated.engine';
import { multiTenantConfigMock } from '../../../../../../mocks/responses/multi-tenant-config.mock';
import { ToasterService } from '../../../../../../common/services/toaster.service';

describe('NetworkAdminConsoleEnableLandingPageToggleComponent', () => {
  let comp: NetworkAdminConsoleEnableLandingPageToggleComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleEnableLandingPageToggleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleEnableLandingPageToggleComponent,
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
      NetworkAdminConsoleEnableLandingPageToggleComponent
    );
    comp = fixture.componentInstance;

    (comp as any).multiTenantConfigService.config$.next(multiTenantConfigMock);
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it("should set toggle state to 'on' on init when enabled", () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        customHomePageEnabled: true,
      });

      comp.ngOnInit();

      expect(comp.enabledToggleState).toBe('on');
    });

    it("should set toggle state to 'off' on init value is false", () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        customHomePageEnabled: false,
      });

      comp.ngOnInit();

      expect(comp.enabledToggleState).toBe('off');
    });

    it("should set toggle state to 'off' on init when value is null", () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        customHomePageEnabled: null,
      });

      comp.ngOnInit();

      expect(comp.enabledToggleState).toBe('off');
    });
  });

  describe('onEnabledToggle', () => {
    it("should set toggle state to 'on' when successful", async () => {
      comp.enabledToggleState = 'off';
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      await comp.onEnabledToggle('on');

      expect(comp.enabledToggleState).toBe('on');
      expect(
        (comp as any).multiTenantConfigService.updateConfig
      ).toHaveBeenCalledOnceWith({ customHomePageEnabled: true });
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Successfully updated settings'
      );
    });

    it("should set toggle state to 'off' when successful", async () => {
      comp.enabledToggleState = 'on';
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      await comp.onEnabledToggle('off');

      expect(comp.enabledToggleState).toBe('off');
      expect(
        (comp as any).multiTenantConfigService.updateConfig
      ).toHaveBeenCalledOnceWith({ customHomePageEnabled: false });
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Successfully updated settings'
      );
    });

    it("should set toggle state back to 'off' when unsuccessful", async () => {
      comp.enabledToggleState = 'off';
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(false)
      );

      await comp.onEnabledToggle('on');

      expect(comp.enabledToggleState).toBe('off');
      expect(
        (comp as any).multiTenantConfigService.updateConfig
      ).toHaveBeenCalledOnceWith({ customHomePageEnabled: true });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'Unable to submit changes, please try again later'
      );
    });

    it("should set toggle state back to 'on' when unsuccessful", async () => {
      comp.enabledToggleState = 'on';
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(false)
      );

      await comp.onEnabledToggle('off');

      expect(comp.enabledToggleState).toBe('on');
      expect(
        (comp as any).multiTenantConfigService.updateConfig
      ).toHaveBeenCalledOnceWith({ customHomePageEnabled: false });
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'Unable to submit changes, please try again later'
      );
    });
  });
});
