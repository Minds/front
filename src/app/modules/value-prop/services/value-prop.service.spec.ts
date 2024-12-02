import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { STRAPI_URL } from '../../../common/injection-tokens/url-injection-tokens';
import { ValuePropService } from './value-prop.service';
import {
  GetValuePropCardsDocument,
  ValuePropCard,
} from '../../../../graphql/generated.strapi';
import { take } from 'rxjs';
import { PresentableValuePropCard } from '../value-prop.types';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('ValuePropService', () => {
  let service: ValuePropService;
  let controller: ApolloTestingController;
  let strapiUrl: string = 'http://example.minds.com';
  let valuePropCardMockResponse = [
    {
      id: 0,
      attributes: {
        __typename: 'ValuePropCard',
        createdAt: Date.now(),
        media: {
          data: {
            attributes: {
              url: '/test.png',
              height: 800,
              width: 800,
              alternativeText: 'Alt text 0',
              mime: 'image/png',
            },
          },
        },
        order: 0,
        publishedAt: Date.now(),
        title: 'Title 0',
        updatedAt: Date.now(),
      },
    },
    {
      id: 1,
      attributes: {
        __typename: 'ValuePropCard',
        createdAt: Date.now(),
        media: {
          data: {
            attributes: {
              url: '/test1.png',
              height: 800,
              width: 800,
              alternativeText: 'Alt text 1',
              mime: 'image/png',
            },
          },
        },
        order: 1,
        publishedAt: Date.now(),
        title: 'Title 1',
        updatedAt: Date.now(),
      },
    },
    {
      id: 2,
      attributes: {
        __typename: 'ValuePropCard',
        createdAt: Date.now(),
        media: {
          data: {
            attributes: {
              url: '/test2.png',
              height: 800,
              width: 800,
              alternativeText: 'Alt text 2',
              mime: 'image/png',
            },
          },
        },
        order: 2,
        publishedAt: Date.now(),
        title: 'Title 2',
        updatedAt: Date.now(),
      },
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule.withClients(['strapi'])],
      providers: [
        ValuePropService,
        { provide: STRAPI_URL, useValue: strapiUrl },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ValuePropService);
    controller = TestBed.inject(ApolloTestingController);

    (service as any).shownCards = [];
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRawValuePropCards$', () => {
    it('should get raw value prop cards', (done: DoneFn) => {
      const expectedResult: ValuePropCard[] = valuePropCardMockResponse.map(
        (valuePropCard) => {
          let attributes = valuePropCard.attributes;
          delete attributes.__typename;
          delete attributes.createdAt;
          delete attributes.publishedAt;
          delete attributes.updatedAt;
          delete attributes.media.data.attributes.height;
          delete attributes.media.data.attributes.width;
          return attributes;
        }
      ) as ValuePropCard[];

      (service as any).getRawValuePropCards$
        .pipe(take(1))
        .subscribe((rawValuePropCards: ValuePropCard[]) => {
          expect(rawValuePropCards).toEqual(expectedResult);
          done();
        });

      // Apollo will expect this query
      const op = controller.expectOne(GetValuePropCardsDocument);

      // Mock the Apollo response
      op.flush({
        data: {
          valuePropCards: {
            data: valuePropCardMockResponse,
          },
        },
      });
    });
  });

  describe('valuePropCards$', () => {
    it('should get value prop cards', (done: DoneFn) => {
      const expectedResult: PresentableValuePropCard[] =
        valuePropCardMockResponse.map(
          (valuePropCard): PresentableValuePropCard => {
            return {
              title: valuePropCard.attributes.title,
              imageUrl:
                'http://example.minds.com' +
                valuePropCard.attributes.media.data.attributes.url,
              altText:
                valuePropCard.attributes.media.data.attributes.alternativeText,
              order: valuePropCard.attributes.order,
            };
          }
        ) as PresentableValuePropCard[];

      (service as any).valuePropCards$
        .pipe(take(1))
        .subscribe((valuePropCards: PresentableValuePropCard[]) => {
          expect(valuePropCards).toEqual(expectedResult);
          done();
        });

      // Apollo will expect this query
      const op = controller.expectOne(GetValuePropCardsDocument);

      // Mock the Apollo response
      op.flush({
        data: {
          valuePropCards: {
            data: valuePropCardMockResponse,
          },
        },
      });
    });
  });

  describe('nextUnshownCard$', () => {
    it('should get next unshown value prop card', (done: DoneFn) => {
      (service as any).shownCards = [0, 1];

      const expectedResult: PresentableValuePropCard[] =
        valuePropCardMockResponse.map(
          (valuePropCard): PresentableValuePropCard => {
            return {
              title: valuePropCard.attributes.title,
              imageUrl:
                'http://example.minds.com' +
                valuePropCard.attributes.media.data.attributes.url,
              altText:
                valuePropCard.attributes.media.data.attributes.alternativeText,
              order: valuePropCard.attributes.order,
            };
          }
        ) as PresentableValuePropCard[];

      (service as any).nextUnshownCard$
        .pipe(take(1))
        .subscribe((nextUnshownCard: PresentableValuePropCard) => {
          expect(nextUnshownCard).toEqual(expectedResult[2]);
          done();
        });

      // Apollo will expect this query
      const op = controller.expectOne(GetValuePropCardsDocument);

      // Mock the Apollo response
      op.flush({
        data: {
          valuePropCards: {
            data: valuePropCardMockResponse,
          },
        },
      });
    });

    it('should return null when there is no next unshown value prop card', (done: DoneFn) => {
      (service as any).shownCards = [0, 1, 2];

      (service as any).nextUnshownCard$
        .pipe(take(1))
        .subscribe((nextUnshownCard: PresentableValuePropCard) => {
          expect(nextUnshownCard).toEqual(null);
          done();
        });

      // Apollo will expect this query
      const op = controller.expectOne(GetValuePropCardsDocument);

      // Mock the Apollo response
      op.flush({
        data: {
          valuePropCards: {
            data: valuePropCardMockResponse,
          },
        },
      });
    });
  });

  describe('setCardAsShown', () => {
    it('should set cards as shown', () => {
      expect((service as any).shownCards).toEqual([]);

      service.setCardAsShown({
        title: 'title',
        imageUrl: 'http://example.minds.com/example.png',
        altText: 'alt text',
        order: 0,
      });
      expect((service as any).shownCards).toEqual([0]);

      service.setCardAsShown({
        title: 'title',
        imageUrl: 'http://example.minds.com/example.png',
        altText: 'alt text',
        order: 1,
      });
      expect((service as any).shownCards).toEqual([0, 1]);
    });
  });
});
