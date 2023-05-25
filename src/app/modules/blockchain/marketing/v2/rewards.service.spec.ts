import { TestBed } from '@angular/core/testing';
import {
  REWARDS_MARKETING_PAGE_QUERY,
  RewardsMarketingService,
} from './rewards.service';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { take } from 'rxjs';

describe('RewardsMarketingService', () => {
  let service: RewardsMarketingService;
  let controller: ApolloTestingController;
  let mockResponse: any = {
    data: {
      attributes: {
        hero: {
          h1: 'h1',
          body: 'body',
          showBackgroundEffects: true,
          image: {
            data: {
              attributes: {
                url: '/image.jpeg',
              },
            },
          },
        },
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [RewardsMarketingService],
    });

    service = TestBed.inject(RewardsMarketingService);
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

    const op = controller.expectOne(REWARDS_MARKETING_PAGE_QUERY);
    op.flush(mockResponse);
  });
});
