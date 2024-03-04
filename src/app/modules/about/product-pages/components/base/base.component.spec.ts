import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProductPageBaseComponent } from './base.component';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { ProductPageService } from '../../services/product-page.service';
import { SidebarNavigationService } from '../../../../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../../../../common/layout/page-layout.service';
import { StrapiMetaService } from '../../../../../common/services/strapi-meta.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import {
  Enum_Componentv2Productfeaturehighlight_Alignimage,
  Enum_Componentv2Productfeaturehighlight_Colorscheme,
  GetV2ProductPageBySlugQuery,
} from '../../../../../../graphql/generated.strapi';
import { ProductPageDynamicComponent } from '../../product-pages.types';
import { By } from '@angular/platform-browser';
import { TopbarService } from '../../../../../common/layout/topbar.service';
import { PLATFORM_ID } from '@angular/core';

describe('ProductPageBaseComponent', () => {
  let comp: ProductPageBaseComponent;
  let fixture: ComponentFixture<ProductPageBaseComponent>;

  const defaultUrlSlug: string = 'upgrades';
  const mockProductPage: GetV2ProductPageBySlugQuery = {
    v2ProductPages: {
      data: [
        {
          attributes: {
            slug: defaultUrlSlug,
            metadata: {
              title: 'metatitle',
            },
            productPage: [
              {
                id: '0',
                __typename: 'ComponentV2ProductHero',
                text: 'text',
                buttons: null,
              },
              {
                id: '1',
                __typename: 'ComponentV2ProductPricingCards',
                savingsText: 'text',
                productPlans: { data: [] },
              },
              {
                id: '2',
                __typename: 'ComponentV2ProductFeatureTable',
                title: 'text',
                subtitle: 'text',
                columns: { data: [] },
              },
              {
                id: '3',
                __typename: 'ComponentV2ProductFeatureShowcase',
                items: [],
              },
              {
                id: '4',
                __typename: 'ComponentV2ProductBasicExplainer',
                title: 'title',
                body: 'body',
                button: null,
              },
              {
                id: '5',
                __typename: 'ComponentV2ProductFeatureHighlight',
                title: 'title',
                body: 'body',
                button: null,
                colorScheme:
                  Enum_Componentv2Productfeaturehighlight_Colorscheme.Light,
                image: null,
                backgroundColor: '#000',
                alignImage:
                  Enum_Componentv2Productfeaturehighlight_Alignimage.Left,
              },
              {
                id: '6',
                __typename: 'ComponentV2ProductClosingCta',
                title: 'title',
                body: 'body',
                button: null,
                borderImage: null,
              },
            ],
          },
        },
      ],
    },
    footer: {
      data: {
        attributes: {
          __typename: 'Footer',
          columns: [],
          copyrightText: 'copyrightText',
          logo: {},
          showLanguageBar: true,
          slogan: 'slogan',
          bottomLinks: [],
        },
      },
    },
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ProductPageBaseComponent,
          MockComponent({
            selector: 'm-productPage__hero',
            inputs: ['text', 'buttons'],
          }),
          MockComponent({
            selector: 'm-productPage__imageCard',
            inputs: ['image'],
          }),
          MockComponent({
            selector: 'm-productPage__pricingCards',
            inputs: ['savingsText', 'productPlans'],
          }),
          MockComponent({
            selector: 'm-productPage__featureTable',
            inputs: ['title', 'subtitle', 'columns'],
          }),
          MockComponent({
            selector: 'm-productPage__featureShowcase',
            inputs: ['featureShowcase'],
          }),
          MockComponent({
            selector: 'm-productPage__basicExplainer',
            inputs: ['title', 'body', 'button'],
          }),
          MockComponent({
            selector: 'm-productPage__featureHighlight',
            inputs: [
              'title',
              'body',
              'button',
              'colorScheme',
              'image',
              'backgroundColor',
              'alignImage',
              'footnotes',
            ],
          }),
          MockComponent({
            selector: 'm-productPage__closingCta',
            inputs: ['title', 'body', 'button', 'borderImage'],
          }),
        ],
        providers: [
          {
            provide: ProductPageService,
            useValue: MockService(ProductPageService),
          },
          {
            provide: SidebarNavigationService,
            useValue: MockService(SidebarNavigationService),
          },
          {
            provide: PageLayoutService,
            useValue: MockService(PageLayoutService),
          },
          {
            provide: TopbarService,
            useValue: MockService(TopbarService, {
              has: ['isMinimalLightMode$'],
              props: {
                isMinimalLightMode$: {
                  get: () => new BehaviorSubject<boolean>(true),
                },
              },
            }),
          },
          {
            provide: StrapiMetaService,
            useValue: MockService(StrapiMetaService),
          },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                paramMap: convertToParamMap({
                  slug: defaultUrlSlug,
                }),
              },
            },
          },
          { provide: Router, useValue: MockService(Router) },
          { provide: PLATFORM_ID, value: 'browser' },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(ProductPageBaseComponent);
    comp = fixture.componentInstance;

    (comp as any).service.getProductPageBySlug.and.returnValue(
      of(mockProductPage)
    );
    (comp as any).topbarService.isMinimalLightMode$.next(false);

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

    expect((comp as any).navigationService.setVisible).toHaveBeenCalledWith(
      false
    );
    expect((comp as any).pageLayoutService.useFullWidth).toHaveBeenCalled();
    expect(
      (comp as any).topbarService.isMinimalLightMode$.getValue()
    ).toBeTrue();
    expect((comp as any).service.getProductPageBySlug).toHaveBeenCalled();
    expect((comp as any).components$.getValue()).toBe(
      mockProductPage.v2ProductPages.data[0].attributes.productPage
    );
    expect((comp as any).strapiMetaService.apply).toHaveBeenCalledWith(
      mockProductPage.v2ProductPages.data[0].attributes.metadata
    );
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('m-productPage__hero'))
    ).toBeTruthy();

    expect(
      fixture.debugElement.query(By.css('m-productPage__pricingCards'))
    ).toBeTruthy();

    expect(
      fixture.debugElement.query(By.css('m-productPage__featureTable'))
    ).toBeTruthy();

    expect(
      fixture.debugElement.query(By.css('m-productPage__featureShowcase'))
    ).toBeTruthy();

    expect(
      fixture.debugElement.query(By.css('m-productPage__basicExplainer'))
    ).toBeTruthy();

    expect(
      fixture.debugElement.query(By.css('m-productPage__featureHighlight'))
    ).toBeTruthy();

    expect(
      fixture.debugElement.query(By.css('m-productPage__closingCta'))
    ).toBeTruthy();
  });

  it('should generate unique track by function id', () => {
    expect(
      comp.trackByFn(
        mockProductPage.v2ProductPages.data[0].attributes
          .productPage[0] as ProductPageDynamicComponent
      )
    );
  });
});
