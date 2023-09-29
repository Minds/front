import { TestBed } from '@angular/core/testing';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ProductPagePricingService } from './product-page-pricing.service';
import { MockService } from '../../../../utils/mock';
import { mockUpgradesConfig } from '../../../gift-card/gift-card.service.spec';
import { ProductPageUpgradeTimePeriod } from '../product-pages.types';
import { Enum_Productplan_Tier } from '../../../../../graphql/generated.strapi';

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
    it('should get monthly price when selected time period is Free and tier is Monthly', (done: DoneFn) => {
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

    it('should get monthly price when selected time period is Free and tier is Annually', (done: DoneFn) => {
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

    it('should get monthly price when selected time period is Plus and tier is Annually', (done: DoneFn) => {
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

    it('should get monthly price when selected time period is Plus and tier is Monthly', (done: DoneFn) => {
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

    it('should get monthly price when selected time period is Pro and tier is Annually', (done: DoneFn) => {
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

    it('should get monthly price when selected time period is Pro and tier is Monthly', (done: DoneFn) => {
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

    it('should get monthly price when selected time period is Networks and tier is Annually', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier = Enum_Productplan_Tier.Networks;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Annually;
      const expectedPrice: number = 48;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });

    it('should get monthly price when selected time period is Networks and tier is Monthly', (done: DoneFn) => {
      const tier: Enum_Productplan_Tier = Enum_Productplan_Tier.Networks;
      const selectedTimePeriod: ProductPageUpgradeTimePeriod =
        ProductPageUpgradeTimePeriod.Monthly;
      const expectedPrice: number = 48;

      service.selectedTimePeriod$.next(selectedTimePeriod);
      service.getMonthlyPrice(tier).subscribe((price: number) => {
        expect(price).toEqual(expectedPrice);
        done();
      });
    });
  });
});
