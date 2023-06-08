import { TestBed } from '@angular/core/testing';
import { YoutubeMigrationMarketingService } from './marketing.service';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { take } from 'rxjs';
import { productMarketingMockData } from '../../../../mocks/modules/marketing/product-marketing.mock';
import { PRODUCT_PAGE_QUERY_FULL } from '../../../../common/services/strapi/marketing-page/marketing-page.constants';

describe('YoutubeMigrationMarketingService', () => {
  let service: YoutubeMigrationMarketingService;
  let controller: ApolloTestingController;
  let mockResponse: any = {
    data: {
      youtubeMigrationMarketingPage: {
        data: {
          ...productMarketingMockData,
        },
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule.withClients(['strapi'])],
      providers: [YoutubeMigrationMarketingService],
    });

    service = TestBed.inject(YoutubeMigrationMarketingService);
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

    const op = controller.expectOne(PRODUCT_PAGE_QUERY_FULL);
    op.flush(mockResponse);
  });
});
