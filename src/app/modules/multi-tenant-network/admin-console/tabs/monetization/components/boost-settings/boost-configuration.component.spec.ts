import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { CommonModule as NgCommonModule } from '@angular/common';
import { NetworkAdminBoostConfigurationComponent } from './boost-configuration.component';
import { MultiTenantNetworkConfigService } from '../../../../../services/config.service';
import { MultiTenantConfig } from '../../../../../../../../graphql/generated.engine';
import { multiTenantConfigMock } from '../../../../../../../mocks/responses/multi-tenant-config.mock';
import { MockComponent, MockService } from '../../../../../../../utils/mock';

describe('NetworkAdminBoostConfigurationComponent', () => {
  let comp: NetworkAdminBoostConfigurationComponent;
  let fixture: ComponentFixture<NetworkAdminBoostConfigurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NetworkAdminBoostConfigurationComponent],
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
      ],
    }).overrideComponent(NetworkAdminBoostConfigurationComponent, {
      set: {
        imports: [
          NgCommonModule,
          MockComponent({
            selector: 'm-boostEmbedBuilder',
            standalone: true,
          }),
          MockComponent({
            selector: 'm-networkAdminConsole__createBoostLink',
            standalone: true,
          }),
          MockComponent({
            selector: 'm-networkAdminConsole__enableBoostToggle',
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(NetworkAdminBoostConfigurationComponent);
    comp = fixture.componentInstance;

    (comp as any).multiTenantConfigService.config$.next(multiTenantConfigMock);
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('render', () => {
    it('should render boost embed builder and create boost link when boost is enabled', () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        boostEnabled: true,
        customHomePageEnabled: true,
      });
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('m-boostEmbedBuilder')
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector(
          'm-networkAdminConsole__createBoostLink'
        )
      ).toBeTruthy();
    });

    it('should NOT render boost embed builder and create boost link when boost is NOT enabled', () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        boostEnabled: false,
        customHomePageEnabled: true,
      });
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('m-boostEmbedBuilder')
      ).toBeFalsy();
      expect(
        fixture.nativeElement.querySelector(
          'm-networkAdminConsole__createBoostLink'
        )
      ).toBeFalsy();
    });

    it('should NOT render boost create link section when boosting is enabled but custom homepage is disabled', () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        boostEnabled: true,
        customHomePageEnabled: false,
      });
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('m-boostEmbedBuilder')
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector(
          'm-networkAdminConsole__createBoostLink'
        )
      ).toBeFalsy();
    });
  });
});
