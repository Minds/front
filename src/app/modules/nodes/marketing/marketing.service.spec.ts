import { TestBed } from '@angular/core/testing';
import {
  NODES_MARKETING_PAGE_QUERY,
  NodesMarketingService,
} from './marketing.service';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { take } from 'rxjs';
import { productMarketingMockData } from '../../../mocks/modules/marketing/product-marketing.mock';

describe('NodesMarketingService', () => {
  let service: NodesMarketingService;
  let controller: ApolloTestingController;
  let mockResponse: any = {
    data: {
      nodesMarketingPage: {
        data: {
          ...productMarketingMockData,
        },
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [NodesMarketingService],
    });

    service = TestBed.inject(NodesMarketingService);
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

    const op = controller.expectOne(NODES_MARKETING_PAGE_QUERY);
    op.flush(mockResponse);
  });
});
