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
    it('should render boost embed builder when boost is enabled', () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        boostEnabled: true,
      });
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('m-boostEmbedBuilder')
      ).toBeTruthy();
    });

    it('should NOT render boost embed builder when boost is NOT enabled', () => {
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        boostEnabled: false,
      });
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('m-boostEmbedBuilder')
      ).toBeFalsy();
    });
  });
});
