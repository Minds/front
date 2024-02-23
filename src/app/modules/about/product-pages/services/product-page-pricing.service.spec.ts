import { TestBed } from '@angular/core/testing';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ProductPagePricingService } from './product-page-pricing.service';
import { MockService } from '../../../../utils/mock';
import {
  ProductPageUpgradeTimePeriod,
  ProductPageUpgradesConfig,
} from '../product-pages.types';
import { Enum_Productplan_Tier } from '../../../../../graphql/generated.strapi';

const mockUpgradesConfig: ProductPageUpgradesConfig = {
  plus: {
    yearly: {
      usd: 60,
    },
    monthly: {
      usd: 7,
    },
  },
  pro: {
    yearly: {
      usd: 480,
    },
    monthly: {
      usd: 60,
    },
  },
  networks_team: {
    yearly: {
      usd: 600,
    },
    monthly: {
      usd: 60,
    },
  },
  networks_community: {
    yearly: {
      usd: 6000,
    },
    monthly: {
      usd: 600,
    },
  },
  networks_enterprise: {
    yearly: {
      usd: 12000,
    },
    monthly: {
      usd: 1200,
    },
  },
  networks_on_prem: {
    yearly: {
      usd: 20000,
    },
    monthly: {
      usd: 220000,
    },
  },
};

describe('ProductPagePricingService', () => {
  let service: ProductPagePricingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductPagePricingService,
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    });

    service = TestBed.inject(ProductPagePricingService);
    Object.defineProperty(service, 'upgradesConfig', { writable: true });
    (service as any).upgradesConfig = mockUpgradesConfig;
    service.selectedTimePeriod$.next(ProductPageUpgradeTimePeriod.Monthly);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.upgradesConfig).toEqual(mockUpgradesConfig);
  });

  describe('getMonthlyPrice', () => {
    it('should get monthly price when selected tier is Free and time period is Monthly', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier = Enum_Productplan_Tier.Free;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Monthly;
      const expectedPrice: number = 0;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });

    it('should get monthly price when selected tier is Free and time period is Annually', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier = Enum_Productplan_Tier.Free;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Annually;
      const expectedPrice: number = 0;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });

    it('should get monthly price when selected tier is Plus and time period is Annually', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier = Enum_Productplan_Tier.Plus;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Annually;
      const expectedPrice: number = mockUpgradesConfig.plus.yearly.usd / 12;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });

    it('should get monthly price when selected tier is Plus and time period is Monthly', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier = Enum_Productplan_Tier.Plus;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Monthly;
      const expectedPrice: number = mockUpgradesConfig.plus.monthly.usd;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });

    it('should get monthly price when selected tier is Pro and time period is Annually', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier = Enum_Productplan_Tier.Pro;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Annually;
      const expectedPrice: number = mockUpgradesConfig.pro.yearly.usd / 12;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });

    it('should get monthly price when selected tier is Pro and time period is Monthly', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier = Enum_Productplan_Tier.Pro;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Monthly;
      const expectedPrice: number = mockUpgradesConfig.pro.monthly.usd;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });

    it('should get lowest possible monthly price when selected tier is Networks and time period is Annually', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier = Enum_Productplan_Tier.Networks;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Annually;
      const expectedPrice: number =
        mockUpgradesConfig.networks_team.yearly.usd / 12;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });

    it('should get lowest possible monthly price when selected tier is Networks and time period is Monthly', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier = Enum_Productplan_Tier.Networks;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Monthly;
      const expectedPrice: number =
        mockUpgradesConfig.networks_team.yearly.usd / 12;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });

    it('should get monthly price when selected tier is NetworksTeam and time period is Annually', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier = Enum_Productplan_Tier.NetworksTeam;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Annually;
      const expectedPrice: number =
        mockUpgradesConfig.networks_team.yearly.usd / 12;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });

    it('should get monthly price when selected tier is NetworksTeam and time period is Monthly', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier = Enum_Productplan_Tier.NetworksTeam;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Monthly;
      const expectedPrice: number =
        mockUpgradesConfig.networks_team.monthly.usd;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });

    it('should get monthly price when selected tier is NetworksCommunity and time period is Annually', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier =
        Enum_Productplan_Tier.NetworksCommunity;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Annually;
      const expectedPrice: number =
        mockUpgradesConfig.networks_community.yearly.usd / 12;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });

    it('should get monthly price when selected tier is NetworksCommunity and time period is Monthly', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier =
        Enum_Productplan_Tier.NetworksCommunity;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Monthly;
      const expectedPrice: number =
        mockUpgradesConfig.networks_community.monthly.usd;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });

    it('should get monthly price when selected tier is NetworksEnterprise and time period is Annually', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier =
        Enum_Productplan_Tier.NetworksEnterprise;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Annually;
      const expectedPrice: number =
        mockUpgradesConfig.networks_enterprise.yearly.usd / 12;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });

    it('should get monthly price when selected tier is NetworksEnterprise and time period is Monthly', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier =
        Enum_Productplan_Tier.NetworksEnterprise;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Monthly;
      const expectedPrice: number =
        mockUpgradesConfig.networks_enterprise.monthly.usd;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });

    it('should get monthly price when selected tier is NetworksOnPrem and time period is Annually', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier = Enum_Productplan_Tier.NetworksOnPrem;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Annually;
      const expectedPrice: number =
        mockUpgradesConfig.networks_on_prem.yearly.usd / 12;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });

    it('should get monthly price when selected tier is NetworksOnPrem and time period is Monthly', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier = Enum_Productplan_Tier.NetworksOnPrem;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Monthly;
      const expectedPrice: number =
        mockUpgradesConfig.networks_on_prem.monthly.usd;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });
  });
});
