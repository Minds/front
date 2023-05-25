import { TestBed } from '@angular/core/testing';
import {
  TOKEN_MARKETING_PAGE_QUERY,
  TokenMarketingService,
} from './token.service';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { take } from 'rxjs';
import { productMarketingMockData } from '../../../../mocks/modules/marketing/product-marketing.mock';

describe('TokenMarketingService', () => {
  let service: TokenMarketingService;
  let controller: ApolloTestingController;
  let mockResponse: any = {
    data: {
      tokenMarketingPage: {
        data: {
          ...productMarketingMockData,
        },
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [TokenMarketingService],
    });

    service = TestBed.inject(TokenMarketingService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get copyData through apollo', (done: DoneFn) => {
    (service as any).copyData.valueChanges.pipe(take(1)).subscribe(copyData => {
      expect(copyData.data).toEqual(mockResponse.data);
      controller.verify();
      done();
    });

    const op = controller.expectOne(TOKEN_MARKETING_PAGE_QUERY);
    op.flush(mockResponse);
  });
});
