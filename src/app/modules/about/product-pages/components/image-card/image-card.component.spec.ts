import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent } from '../../../../../utils/mock';
import { ProductPageImageCardComponent } from './image-card.component';
import { By } from '@angular/platform-browser';
import { STRAPI_URL } from '../../../../../common/injection-tokens/url-injection-tokens';
import { DebugElement } from '@angular/core';
import { UploadFile } from '../../../../../../graphql/generated.strapi';

describe('ProductPageImageCardComponent', () => {
  let comp: ProductPageImageCardComponent;
  let fixture: ComponentFixture<ProductPageImageCardComponent>;

  const mockStrapiUrl: string = 'https://example-strapi.minds.com';
  const defaultImage: Partial<UploadFile> = {
    __typename: 'UploadFile',
    alternativeText: 'altText',
    url: 'assets/strapi/placeholder.png',
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ProductPageImageCardComponent,
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
    fixture = TestBed.createComponent(ProductPageImageCardComponent);
    comp = fixture.componentInstance;

    Object.defineProperty(comp, 'image', { writable: true });
    (comp as any).image = defaultImage;

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

    const imageElement: DebugElement = fixture.debugElement.query(
      By.css('.m-productPageImageCard__image')
    );

    expect(imageElement.nativeElement.src).toBe(
      mockStrapiUrl + defaultImage.url
    );
    expect(imageElement.nativeElement.alt).toBe(defaultImage.alternativeText);
  });
});
