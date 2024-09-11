import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  Enum_Componentv2Productfeaturehighlight_Colorscheme as ColorScheme,
  Enum_Productplan_Tier,
  ProductPlan,
  ProductPlanEntity,
} from '../../../../../../graphql/generated.strapi';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ProductPagePricingService } from '../../services/product-page-pricing.service';
import { BehaviorSubject } from 'rxjs';
import { ProductPageUpgradeTimePeriod } from '../../product-pages.types';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { ProductPagePricingCardsComponent } from './pricing-cards.component';

describe('ProductPagePricingCardsComponent', () => {
  let comp: ProductPagePricingCardsComponent;
  let fixture: ComponentFixture<ProductPagePricingCardsComponent>;

  const defaultSavingsText: string = 'Savings text';
  const defaultProductPlans: ProductPlanEntity[] = [
    {
      id: '0',
      attributes: {
        __typename: 'ProductPlan',
        button: {
          id: '0',
          __typename: 'ComponentV2ProductActionButton',
          action: null,
          dataRef: 'dataRef',
          navigationUrl: '',
          solid: true,
          text: 'text',
        },
        perks: [
          { id: '0', text: '1' },
          { id: '1', text: '2' },
        ],
        perksTitle: 'Free1',
        priceStartingAt: true,
        noPrice: false,
        subtitle: 'subtitle',
        tier: Enum_Productplan_Tier.Free,
        title: 'free1',
      },
    },
    {
      id: '1',
      attributes: {
        __typename: 'ProductPlan',
        button: {
          id: '1',
          __typename: 'ComponentV2ProductActionButton',
          action: null,
          dataRef: 'dataRef',
          navigationUrl: '',
          solid: true,
          text: 'text',
        },
        perks: [
          { id: '0', text: '3' },
          { id: '1', text: '4' },
        ],
        perksTitle: 'Plus',
        priceStartingAt: true,
        noPrice: false,
        subtitle: 'plus1',
        tier: Enum_Productplan_Tier.Plus,
        title: 'plus1',
      },
    },
    {
      id: '2',
      attributes: {
        __typename: 'ProductPlan',
        button: {
          id: '2',
          __typename: 'ComponentV2ProductActionButton',
          action: null,
          dataRef: 'dataRef',
          navigationUrl: '',
          solid: true,
          text: 'text',
        },
        perks: [
          { id: '0', text: '5' },
          { id: '1', text: '6' },
        ],
        perksTitle: 'Pro',
        priceStartingAt: true,
        noPrice: false,
        subtitle: 'pro1',
        tier: Enum_Productplan_Tier.Pro,
        title: 'pro1',
      },
    },
  ];

  const defaultProductPlanUpgradePeriod: ProductPageUpgradeTimePeriod =
    ProductPageUpgradeTimePeriod.Annually;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductPagePricingCardsComponent,
        MockComponent({
          selector: 'markdown',
          inputs: ['data'],
        }),
        MockComponent({
          selector: 'm-productPage__button',
          inputs: ['data', 'colorScheme'],
        }),
      ],
      providers: [
        {
          provide: ProductPagePricingService,
          useValue: MockService(ProductPagePricingService, {
            has: ['selectedTimePeriod$'],
            props: {
              selectedTimePeriod$: {
                get: () =>
                  new BehaviorSubject<ProductPageUpgradeTimePeriod>(
                    defaultProductPlanUpgradePeriod
                  ),
              },
            },
          }),
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(ProductPagePricingCardsComponent);
    comp = fixture.componentInstance;

    Object.defineProperty(comp, 'savingsText', { writable: true });
    Object.defineProperty(comp, 'productPlans', { writable: true });

    (comp as any).savingsText = defaultSavingsText;
    (comp as any).productPlans = defaultProductPlans;

    (comp as any).pricingService.selectedTimePeriod$.next(
      defaultProductPlanUpgradePeriod
    );

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();

    const cardElements: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.m-productPagePricingCards__cardContainer')
    );

    const titleElements: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.m-productPagePricingCards__cardTitle')
    );
    const subtitleElements: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.m-productPagePricingCards__cardSubtitle')
    );
    const perkTitleElements: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.m-productPagePricingCards__cardPerkTitle')
    );
    const perkTextElements: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.m-productPagePricingCards__cardPerkText')
    );

    expect(cardElements.length).toBe(3);
    expect(titleElements.length).toBe(3);
    expect(subtitleElements.length).toBe(3);
    expect(perkTextElements.length).toBe(6);

    expect(titleElements[0].nativeElement.textContent.trim()).toBe(
      defaultProductPlans[0].attributes.title
    );
    expect(titleElements[1].nativeElement.textContent.trim()).toBe(
      defaultProductPlans[1].attributes.title
    );
    expect(titleElements[2].nativeElement.textContent.trim()).toBe(
      defaultProductPlans[2].attributes.title
    );

    expect(subtitleElements[0].nativeElement.textContent.trim()).toBe(
      defaultProductPlans[0].attributes.subtitle
    );
    expect(subtitleElements[1].nativeElement.textContent.trim()).toBe(
      defaultProductPlans[1].attributes.subtitle
    );
    expect(subtitleElements[2].nativeElement.textContent.trim()).toBe(
      defaultProductPlans[2].attributes.subtitle
    );

    expect(perkTitleElements[0].nativeElement.textContent.trim()).toBe(
      defaultProductPlans[0].attributes.perksTitle
    );
    expect(perkTitleElements[1].nativeElement.textContent.trim()).toBe(
      defaultProductPlans[1].attributes.perksTitle
    );
    expect(perkTitleElements[2].nativeElement.textContent.trim()).toBe(
      defaultProductPlans[2].attributes.perksTitle
    );

    expect(perkTextElements[0].nativeElement.textContent.trim()).toBe(
      defaultProductPlans[0].attributes.perks[0].text
    );
    expect(perkTextElements[1].nativeElement.textContent.trim()).toBe(
      defaultProductPlans[0].attributes.perks[1].text
    );
    expect(perkTextElements[2].nativeElement.textContent.trim()).toBe(
      defaultProductPlans[1].attributes.perks[0].text
    );
    expect(perkTextElements[3].nativeElement.textContent.trim()).toBe(
      defaultProductPlans[1].attributes.perks[1].text
    );
    expect(perkTextElements[4].nativeElement.textContent.trim()).toBe(
      defaultProductPlans[2].attributes.perks[0].text
    );
    expect(perkTextElements[5].nativeElement.textContent.trim()).toBe(
      defaultProductPlans[2].attributes.perks[1].text
    );
  });

  it('should track by unique id for ngFor loop', () => {
    expect(
      comp.trackByFn({
        id: '0',
        attributes: {
          tier: Enum_Productplan_Tier.Free,
        } as ProductPlan,
      })
    ).toBe(Enum_Productplan_Tier.Free + '0');
  });

  it('should toggle time period', () => {
    comp.selectedTimePeriod$.next(null);

    comp.toggleTimePeriod(ProductPageUpgradeTimePeriod.Annually);
    expect(comp.selectedTimePeriod$.getValue()).toBe(
      ProductPageUpgradeTimePeriod.Annually
    );

    comp.toggleTimePeriod(ProductPageUpgradeTimePeriod.Monthly);
    expect(comp.selectedTimePeriod$.getValue()).toBe(
      ProductPageUpgradeTimePeriod.Monthly
    );
  });

  it('should get monthly price', () => {
    (comp as any).pricingService.getMonthlyPrice.and.returnValue(
      new BehaviorSubject<number>(19)
    );
    expect(
      (
        comp.getMonthlyPrice(
          Enum_Productplan_Tier.Networks
        ) as BehaviorSubject<number>
      ).getValue()
    ).toBe(19);
  });
});
