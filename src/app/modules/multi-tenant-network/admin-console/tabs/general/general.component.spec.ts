import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { MultiTenantNetworkConfigService } from '../../../services/config.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { MetaService } from '../../../../../common/services/meta.service';
import { multiTenantConfigMock } from '../../../../../mocks/responses/multi-tenant-config.mock';
import { NetworkAdminConsoleGeneralComponent } from './general.component';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { BehaviorSubject, of } from 'rxjs';
import { MultiTenantConfig } from '../../../../../../graphql/generated.engine';
import { SiteMembershipsCountService } from '../../../../site-memberships/services/site-membership-count.service';

describe('NetworkAdminConsoleGeneralComponent', () => {
  let comp: NetworkAdminConsoleGeneralComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleGeneralComponent,
        MockComponent({
          selector: 'm-networkAdminConsole__federationSettings',
        }),
        MockComponent({ selector: 'm-networkAdminConsole__featured' }),
        MockComponent({
          selector: 'm-networkAdminConsole__enableLandingPageToggle',
        }),
        MockComponent({
          selector: 'm-networkAdminConsole__enableWalledGardenToggle',
        }),
        MockComponent({
          selector: 'm-networkAdminConsole__digestEmailSettings',
        }),
        MockComponent({
          selector: 'm-networkAdminConsole__replyEmailSettings',
        }),
        MockComponent({
          selector: 'm-networkAdminConsole__landingPageDescription',
        }),
        MockComponent({
          selector: 'm-networkAdminConsole__configSettingsToggle',
          inputs: ['fieldName', 'title', 'description', 'toggleText'],
        }),
        MockComponent({ selector: 'm-networkAdminConsole__bookMeeting' }),
        MockComponent({ selector: 'm-loadingSpinner', inputs: ['inProgress'] }),
        MockComponent({ selector: 'm-formError', inputs: ['error'] }),
      ],
      imports: [ReactiveFormsModule],
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
        {
          provide: SiteMembershipsCountService,
          useValue: MockService(SiteMembershipsCountService, {
            has: ['count$'],
            props: {
              count$: { get: () => new BehaviorSubject<number>(0) },
            },
          }),
        },
        FormBuilder,
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: MetaService, useValue: MockService(MetaService) },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleGeneralComponent);
    comp = fixture.componentInstance;

    (comp as any).multiTenantConfigService.config$.next(multiTenantConfigMock);
  });

  it('should create the component', fakeAsync(() => {
    expect(comp).toBeTruthy();
    comp.ngOnInit();
    tick();

    expect(comp.networkNameFormControl.getRawValue()).toBe(
      multiTenantConfigMock.siteName
    );
  }));

  describe('onSubmit', () => {
    it('should submit changes', fakeAsync(() => {
      const siteName: string = 'Test site 2';
      comp.networkNameFormControl.setValue(siteName);

      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      comp.onSubmit();
      tick();

      expect((comp as any).configs.set).toHaveBeenCalledWith(
        'site_name',
        siteName
      );
      expect((comp as any).metaService.reset).toHaveBeenCalled();
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Successfully updated settings.'
      );
    }));
  });
});
