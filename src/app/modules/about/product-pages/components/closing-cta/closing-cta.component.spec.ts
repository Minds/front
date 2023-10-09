import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent } from '../../../../../utils/mock';
import { ProductPageClosingCtaComponent } from './closing-cta.component';
import {
  ComponentCommonActionButton,
  Enum_Componentcommonactionbutton_Action,
  UploadFile,
} from '../../../../../../graphql/generated.strapi';
import { By } from '@angular/platform-browser';
import {
  CDN_ASSETS_URL,
  STRAPI_URL,
} from '../../../../../common/injection-tokens/url-injection-tokens';
import { DebugElement } from '@angular/core';

describe('ProductPageClosingCtaComponent', () => {
  let comp: ProductPageClosingCtaComponent;
  let fixture: ComponentFixture<ProductPageClosingCtaComponent>;

  const mockTitle: string = 'Title';
  const mockBody: string = 'Body';
  const mockButton: ComponentCommonActionButton = {
    id: '0',
    __typename: 'ComponentCommonActionButton',
    action: Enum_Componentcommonactionbutton_Action.ScrollToTop,
    dataRef: 'dataRef',
    navigationUrl: '',
    solid: true,
    text: 'text',
  };
  const mockBorderImage: Partial<UploadFile> = {
    __typename: 'UploadFile',
    alternativeText: 'altText',
    url: 'assets/strapi/placeholder.png',
  };

  const mockAssetsUrl: string = 'https://example-assets.minds.com';
  const mockStrapiUrl: string = 'https://example-strapi.minds.com';

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ProductPageClosingCtaComponent,
          MockComponent({
            selector: 'm-productPage__button',
            inputs: ['data'],
          }),
          MockComponent({
            selector: 'markdown',
            inputs: ['data'],
          }),
        ],
        providers: [
          { provide: CDN_ASSETS_URL, useValue: mockAssetsUrl },
          { provide: STRAPI_URL, useValue: mockStrapiUrl },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(ProductPageClosingCtaComponent);
    comp = fixture.componentInstance;

    Object.defineProperty(comp, 'title', { writable: true });
    Object.defineProperty(comp, 'body', { writable: true });
    Object.defineProperty(comp, 'button', { writable: true });
    Object.defineProperty(comp, 'borderImage', { writable: true });

    (comp as any).title = mockTitle;
    (comp as any).body = mockBody;
    (comp as any).button = mockButton;
    (comp as any).borderImage = mockBorderImage;

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

    const borderImage: DebugElement = fixture.debugElement.query(
      By.css('.m-productClosingCta__borderImage')
    );
    expect(borderImage).toBeTruthy();
    expect(borderImage.nativeElement.src).toBe(
      mockStrapiUrl + mockBorderImage.url
    );
    expect(borderImage.nativeElement.alt).toBe(mockBorderImage.alternativeText);

    expect(fixture.debugElement.query(By.css('markdown'))).toBeTruthy();

    expect(
      fixture.debugElement.query(By.css('m-productPage__button'))
    ).toBeTruthy();
  });
});
