import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProductPageFeatureHighlightComponent } from './feature-highlight.component';
import {
  ComponentDynamicProductPageActionButton as ActionButton,
  Enum_Componentdynamicproductpagefeaturehighlight_Alignimage as AlignImage,
  Enum_Componentdynamicproductpagefeaturehighlight_Colorscheme as ColorScheme,
  UploadFile,
} from '../../../../../../graphql/generated.strapi';
import { STRAPI_URL } from '../../../../../common/injection-tokens/url-injection-tokens';
import { DebugElement } from '@angular/core';
import { MockComponent } from '../../../../../utils/mock';

describe('ProductPageFeatureHighlightComponent', () => {
  let comp: ProductPageFeatureHighlightComponent;
  let fixture: ComponentFixture<ProductPageFeatureHighlightComponent>;

  const defaultTitle: string = 'title';
  const defaultBody: string = 'body';
  const defaultButton: ActionButton = {
    id: '0',
    __typename: 'ComponentDynamicProductPageActionButton',
    action: null,
    dataRef: 'dataRef',
    navigationUrl: '',
    solid: true,
    text: 'text',
  };
  const defaultColorScheme = ColorScheme.Light;
  const defaultImage: Partial<UploadFile> = {
    __typename: 'UploadFile',
    alternativeText: 'altText',
    url: 'assets/strapi/placeholder.png',
  };
  const defaultAlignImage: AlignImage = AlignImage.Left;
  const defaultBackgroundColor: string = '#000';
  const mockStrapiUrl: string = 'https://example-strapi.minds.com';

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ProductPageFeatureHighlightComponent,
          MockComponent({
            selector: 'm-productPage__button',
            inputs: ['data', 'colorScheme'],
          }),
          MockComponent({
            selector: 'markdown',
            inputs: ['data'],
          }),
        ],
        providers: [{ provide: STRAPI_URL, useValue: mockStrapiUrl }],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(ProductPageFeatureHighlightComponent);
    comp = fixture.componentInstance;

    Object.defineProperty(comp, 'title', { writable: true });
    Object.defineProperty(comp, 'body', { writable: true });
    Object.defineProperty(comp, 'button', { writable: true });
    Object.defineProperty(comp, 'colorScheme', { writable: true });
    Object.defineProperty(comp, 'image', { writable: true });
    Object.defineProperty(comp, 'alignImage', { writable: true });
    Object.defineProperty(comp, 'backgroundColor', { writable: true });

    (comp as any).title = defaultTitle;
    (comp as any).body = defaultBody;
    (comp as any).button = defaultButton;
    (comp as any).colorScheme = defaultColorScheme;
    (comp as any).image = defaultImage;
    (comp as any).alignImage = defaultAlignImage;
    (comp as any).backgroundColor = defaultBackgroundColor;

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

    const titleElement: DebugElement = fixture.debugElement.query(By.css('h1'));

    const bodyElement: DebugElement = fixture.debugElement.query(
      By.css('markdown')
    );

    const buttonElement: DebugElement = fixture.debugElement.query(
      By.css('m-productPage__button')
    );

    const imageElement: DebugElement = fixture.debugElement.query(
      By.css('.m-productPageFeatHighlight__imageContainer img')
    );

    expect(titleElement.nativeElement.innerText).toBe(defaultTitle);
    expect(bodyElement).toBeTruthy();
    expect(buttonElement).toBeTruthy();
    expect(imageElement.nativeElement.src).toBe(
      mockStrapiUrl + defaultImage.url
    );
    expect(imageElement.nativeElement.alt).toBe(defaultImage.alternativeText);
  });

  it('should style host class with background-color', () => {
    expect(fixture.nativeElement.style.backgroundColor).toBe('rgb(0, 0, 0)');
  });

  it('should have left alignment class when leftAlign is true', () => {
    (comp as any).alignImage = AlignImage.Left;

    comp.ngOnInit();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains(
        'm-productPageFeatHighlight__host--left'
      )
    ).toBeTrue();
  });

  it('should have right alignment class when rightAlign is true', () => {
    (comp as any).alignImage = AlignImage.Right;

    comp.ngOnInit();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains(
        'm-productPageFeatHighlight__host--right'
      )
    ).toBeTrue();
  });

  it('should have dark mode class when darkMode is true', () => {
    (comp as any).colorScheme = ColorScheme.Dark;

    comp.ngOnInit();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains(
        'm-productPageFeatHighlight__host--dark'
      )
    ).toBeTrue();
  });

  it('should have light mode class when lightMode is true', () => {
    (comp as any).colorScheme = ColorScheme.Dark;

    comp.ngOnInit();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains(
        'm-productPageFeatHighlight__host--light'
      )
    ).toBeTrue();
  });
});
