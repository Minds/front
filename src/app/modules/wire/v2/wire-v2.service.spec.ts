import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../../common/api/api.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { Session } from '../../../services/session';
import { MockService } from '../../../utils/mock';
import { PlusService } from '../../plus/plus.service';
import { ProService } from '../../pro/pro.service';
import { WalletV2Service } from '../../wallet/components/wallet-v2.service';
import { WireV2Service } from './wire-v2.service';
import { WireService as WireV1Service } from '../wire.service';
import { lastValueFrom } from 'rxjs';

describe('WireV2Service', () => {
  let service: WireV2Service;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    TestBed.configureTestingModule({
      providers: [
        WireV2Service,
        { provide: WalletV2Service, useValue: MockService(WalletV2Service) },
        { provide: ApiService, useValue: MockService(ApiService) },
        { provide: WireV1Service, useValue: MockService(WireV1Service) },
        { provide: PlusService, useValue: MockService(PlusService) },
        { provide: ProService, useValue: MockService(ProService) },
        { provide: Session, useValue: MockService(Session) },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    service = TestBed.inject(WireV2Service);

    service.upgrades = {
      plus: {
        lifetime: {
          usd: 100,
          can_have_trail: true,
        },
      },
    };
    service.upgradeType$.next(null);
    service.upgradeInterval$.next(null);
    service.type$.next('usd');
    service.isUpgrade$.next(false);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should see if upgrade can be trial', () => {
    service.upgrades = {
      plus: {
        lifetime: {
          usd: 100,
          can_have_trail: true,
        },
      },
    };
    service.upgradeType$.next('plus');
    service.upgradeInterval$.next('lifetime');
    service.type$.next('usd');
    service.isUpgrade$.next(true);

    expectAsync(lastValueFrom(service.upgradeCanHaveTrial$)).toBeResolvedTo(
      true
    );
  });

  it('should see if upgrade can NOT be trial because it is explicitly set to not have a trial', () => {
    service.upgrades = {
      plus: {
        lifetime: {
          usd: 100,
          can_have_trail: false,
        },
      },
    };
    service.upgradeType$.next('plus');
    service.upgradeInterval$.next('lifetime');
    service.type$.next('usd');
    service.isUpgrade$.next(true);

    expectAsync(lastValueFrom(service.upgradeCanHaveTrial$)).toBeResolvedTo(
      false
    );
  });

  it('should see if upgrade can NOT be trial because payment type is not USD', () => {
    service.upgrades = {
      plus: {
        lifetime: {
          usd: 100,
          can_have_trail: true,
        },
      },
    };
    service.upgradeType$.next('plus');
    service.upgradeInterval$.next('lifetime');
    service.type$.next('tokens');
    service.isUpgrade$.next(true);

    expectAsync(lastValueFrom(service.upgradeCanHaveTrial$)).toBeResolvedTo(
      false
    );
  });

  it('should see if upgrade can NOT be trial because the modal is not open for an upgrade', () => {
    service.upgrades = {
      plus: {
        lifetime: {
          usd: 100,
          can_have_trail: true,
        },
      },
    };
    service.upgradeType$.next('plus');
    service.upgradeInterval$.next('lifetime');
    service.type$.next('usd');
    service.isUpgrade$.next(false);

    expectAsync(lastValueFrom(service.upgradeCanHaveTrial$)).toBeResolvedTo(
      false
    );
  });
});
