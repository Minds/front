import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProductPageFeatureShowcaseComponent } from './feature-showcase.component';
import { STRAPI_URL } from '../../../../../common/injection-tokens/url-injection-tokens';
import {
  ComponentV2ProductFeatureShowcaseItem,
  UploadFile,
} from '../../../../../../graphql/generated.strapi';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockComponent } from '../../../../../utils/mock';

describe('ProductPageFeatureShowcaseComponent', () => {
  let comp: ProductPageFeatureShowcaseComponent;
  let fixture: ComponentFixture<ProductPageFeatureShowcaseComponent>;

  const mockStrapiUrl: string = 'https://example-strapi.minds.com';
  const defaultFeatureShowcase: ComponentV2ProductFeatureShowcaseItem[] = [
    {
      __typename: 'ComponentV2ProductFeatureShowcaseItem',
      body: 'body0',
      id: '0',
      image: {
        data: {
          attributes: {
            __typename: 'UploadFile',
            alternativeText: 'altText0',
            url: 'assets/strapi/placeholder0.png',
          } as UploadFile,
        },
      },
      title: 'title0',
    },
    {
      __typename: 'ComponentV2ProductFeatureShowcaseItem',
      body: 'body1',
      id: '1',
      image: {
        data: {
          attributes: {
            __typename: 'UploadFile',
            alternativeText: 'altText1',
            url: 'assets/strapi/placeholder1.png',
          } as UploadFile,
        },
      },
      title: 'title1',
    },
    {
      __typename: 'ComponentV2ProductFeatureShowcaseItem',
      body: 'body2',
      id: '2',
      image: {
        data: {
          attributes: {
            __typename: 'UploadFile',
            alternativeText: 'altText2',
            url: 'assets/strapi/placeholder2.png',
          } as UploadFile,
        },
      },
      title: 'title2',
    },
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductPageFeatureShowcaseComponent,
        MockComponent({
          selector: 'markdown',
          inputs: ['data'],
        }),
      ],
      providers: [{ provide: STRAPI_URL, useValue: mockStrapiUrl }],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(ProductPageFeatureShowcaseComponent);
    comp = fixture.componentInstance;

    Object.defineProperty(comp, 'featureShowcase', { writable: true });
    (comp as any).featureShowcase = defaultFeatureShowcase;

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

    const itemElements: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.m-featureShowcase__card')
    );
    const imageElements: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.m-featureShowcase__image')
    );
    const titleElements: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.m-featureShowcase__title')
    );
    const bodyElements: DebugElement[] = fixture.debugElement.queryAll(
      By.css('markdown')
    );

    expect(itemElements.length).toBe(3);
    expect(imageElements.length).toBe(3);
    expect(titleElements.length).toBe(3);
    expect(bodyElements.length).toBe(3);

    expect(imageElements[0].nativeElement.src).toBe(
      mockStrapiUrl + defaultFeatureShowcase[0].image.data.attributes.url
    );
    expect(imageElements[0].nativeElement.alt).toBe(
      defaultFeatureShowcase[0].image.data.attributes.alternativeText
    );
    expect(imageElements[1].nativeElement.src).toBe(
      mockStrapiUrl + defaultFeatureShowcase[1].image.data.attributes.url
    );
    expect(imageElements[1].nativeElement.alt).toBe(
      defaultFeatureShowcase[1].image.data.attributes.alternativeText
    );
    expect(imageElements[2].nativeElement.src).toBe(
      mockStrapiUrl + defaultFeatureShowcase[2].image.data.attributes.url
    );
    expect(imageElements[2].nativeElement.alt).toBe(
      defaultFeatureShowcase[2].image.data.attributes.alternativeText
    );

    expect(titleElements[0].nativeElement.textContent).toBe(
      defaultFeatureShowcase[0].title
    );
    expect(titleElements[1].nativeElement.textContent).toBe(
      defaultFeatureShowcase[1].title
    );
    expect(titleElements[2].nativeElement.textContent).toBe(
      defaultFeatureShowcase[2].title
    );
  });
});
