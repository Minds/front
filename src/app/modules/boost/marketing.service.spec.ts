import { TestBed } from '@angular/core/testing';
import {
  BOOST_MARKETING_PAGE_QUERY,
  BoostMarketingService,
} from './marketing.service';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { take } from 'rxjs';
import { productMarketingMockData } from '../../mocks/modules/marketing/product-marketing.mock';

describe('BoostMarketingService', () => {
  let service: BoostMarketingService;
  let controller: ApolloTestingController;
  let mockResponse: any = {
    data: {
      boostMarketingPage: {
        data: {
          ...productMarketingMockData,
        },
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [BoostMarketingService],
    });

    service = TestBed.inject(BoostMarketingService);
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

    const op = controller.expectOne(BOOST_MARKETING_PAGE_QUERY);
    op.flush(mockResponse);
  });
});
