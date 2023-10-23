import { TestBed } from '@angular/core/testing';
import {
  GetV2ProductPageBySlugGQL,
  GetV2ProductPageBySlugQuery,
} from '../../../../../graphql/generated.strapi';
import { ProductPageService } from './product-page.service';
import { of, take, throwError } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';

describe('ProductPageService', () => {
  let service: ProductPageService;

  const urlSlug: string = 'urlSlug';
  const mockResponse: ApolloQueryResult<GetV2ProductPageBySlugQuery> = {
    loading: false,
    networkStatus: 7,
    data: {
      v2ProductPages: {
        data: [
          {
            attributes: {
              slug: urlSlug,
            },
          },
        ],
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductPageService,
        {
          provide: GetV2ProductPageBySlugGQL,
          useValue: jasmine.createSpyObj<GetV2ProductPageBySlugGQL>(['fetch']),
        },
      ],
    });

    service = TestBed.inject(ProductPageService);
    (service as any).getV2ProductPageBySlugGQL.fetch.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProductPageBySlug', () => {
    it('should get product page by slug', (done: DoneFn) => {
      const urlSlug: string = 'urlSlug';

      (service as any).getV2ProductPageBySlugGQL.fetch
        .withArgs({ slug: urlSlug })
        .and.returnValue(of(mockResponse));

      service
        .getProductPageBySlug(urlSlug)
        .pipe(take(1))
        .subscribe((response: GetV2ProductPageBySlugQuery) => {
          expect(
            (service as any).getV2ProductPageBySlugGQL.fetch
          ).toHaveBeenCalledWith({ slug: urlSlug });
          expect(response).toEqual(mockResponse.data);
          done();
        });
    });

    it('should return null when there is an error getting product page by slug', (done: DoneFn) => {
      const errorText: string = 'errorText';

      (service as any).getV2ProductPageBySlugGQL.fetch
        .withArgs({ slug: urlSlug })
        .and.returnValue(throwError(() => errorText));

      service
        .getProductPageBySlug(urlSlug)
        .pipe(take(1))
        .subscribe((response: GetV2ProductPageBySlugQuery) => {
          expect(
            (service as any).getV2ProductPageBySlugGQL.fetch
          ).toHaveBeenCalledWith({ slug: urlSlug });
          expect(response).toEqual(null);
          done();
        });
    });
  });
});
