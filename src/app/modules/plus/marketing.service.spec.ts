import { TestBed } from '@angular/core/testing';
import {
  PLUS_MARKETING_PAGE_QUERY,
  PlusMarketingService,
} from './marketing.service';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { take } from 'rxjs';
import { productMarketingMockData } from '../../mocks/modules/marketing/product-marketing.mock';

describe('PlusMarketingService', () => {
  let service: PlusMarketingService;
  let controller: ApolloTestingController;
  let mockResponse: any = {
    data: {
      plusMarketingPage: {
        data: {
          ...productMarketingMockData,
        },
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [PlusMarketingService],
    });

    service = TestBed.inject(PlusMarketingService);
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

    const op = controller.expectOne(PLUS_MARKETING_PAGE_QUERY);
    op.flush(mockResponse);
  });
});
