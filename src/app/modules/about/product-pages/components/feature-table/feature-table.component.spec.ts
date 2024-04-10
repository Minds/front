import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProductPageFeatureTableComponent } from './feature-table.component';
import {
  Enum_Feattablecolumn_Tier,
  Enum_Productplan_Tier,
  FeatTableColumnEntity,
} from '../../../../../../graphql/generated.strapi';
import { By } from '@angular/platform-browser';
import { ProductPagePricingService } from '../../services/product-page-pricing.service';
import { MockService } from '../../../../../utils/mock';
import { BehaviorSubject, of } from 'rxjs';

describe('ProductPageFeatureShowcaseComponent', () => {
  let comp: ProductPageFeatureTableComponent;
  let fixture: ComponentFixture<ProductPageFeatureTableComponent>;

  const defaultTitle: string = 'title';
  const defaultSubtitle: string = 'subtitle';
  const defaultColumns: FeatTableColumnEntity[] = [
    {
      id: '0',
      attributes: {
        featTableHeader: {
          id: '0',
          __typename: 'ComponentV2ProductFeatureTableHeader',
          button: {
            id: '0',
            __typename: 'ComponentV2ProductActionButton',
            action: null,
            dataRef: 'dataRef',
            navigationUrl: '',
            solid: true,
            text: 'text',
          },
          title: 'title0',
        },
        sections: {
          data: [
            {
              attributes: {
                __typename: 'FeatTableSection',
                headerText: 'headerText0',
                items: {
                  data: [
                    {
                      attributes: {
                        __typename: 'FeatTableItem',
                        checkbox: true,
                        columnText: null,
                        productFeature: {
                          data: {
                            attributes: {
                              explainerText: 'explainerText0',
                              featureName: 'featureName0',
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        tier: Enum_Feattablecolumn_Tier.Free,
      },
    },
    {
      id: '1',
      attributes: {
        featTableHeader: {
          id: '1',
          __typename: 'ComponentV2ProductFeatureTableHeader',
          button: {
            id: '1',
            __typename: 'ComponentV2ProductActionButton',
            action: null,
            dataRef: 'dataRef',
            navigationUrl: '',
            solid: true,
            text: 'text',
          },
          title: 'title1',
        },
        sections: {
          data: [
            {
              attributes: {
                __typename: 'FeatTableSection',
                headerText: 'headerText1',
                items: {
                  data: [
                    {
                      attributes: {
                        __typename: 'FeatTableItem',
                        checkbox: true,
                        columnText: null,
                        productFeature: {
                          data: {
                            attributes: {
                              explainerText: 'explainerText1',
                              featureName: 'featureName1',
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        tier: Enum_Feattablecolumn_Tier.Free,
      },
    },
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProductPageFeatureTableComponent],
      providers: [
        {
          provide: ProductPagePricingService,
          useValue: MockService(ProductPagePricingService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(ProductPageFeatureTableComponent);
    comp = fixture.componentInstance;

    Object.defineProperty(comp, 'title', { writable: true });
    Object.defineProperty(comp, 'subtitle', { writable: true });
    Object.defineProperty(comp, 'columns', { writable: true });

    (comp as any).title = defaultTitle;
    (comp as any).subtitle = defaultSubtitle;
    (comp as any).columns = defaultColumns;

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

    expect(
      fixture.debugElement.query(By.css('.m-productPageFeatTable__title'))
        .nativeElement.textContent
    ).toBe(defaultTitle);

    expect(
      fixture.debugElement.query(By.css('.m-productPageFeatTable__subtitle'))
        .nativeElement.textContent
    ).toBe(defaultSubtitle);

    expect(
      fixture.debugElement.queryAll(By.css('.m-productPageFeatTable__column'))
        .length
    ).toBeTruthy(3);
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

  it('should select mobile tab on mobile tab click', () => {
    comp.onMobileTabClick(1);
    expect(comp.selectedMobileTabIndex$.getValue()).toBe(1);

    comp.onMobileTabClick(2);
    expect(comp.selectedMobileTabIndex$.getValue()).toBe(2);
  });
});
