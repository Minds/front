import { AnalyticsService } from './../../../services/analytics';
import { RecentSubscriptionsService } from './../../../common/services/recent-subscriptions.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiService } from '../../../common/api/api.service';
import { apiServiceMock } from '../../boost/modal/boost-modal.service.spec';
import { ChannelRecommendationComponent } from './channel-recommendation.component';
import { ExperimentsService } from '../../experiments/experiments.service';
import { MockService } from '../../../utils/mock';

describe('ChannelRecommendationComponent', () => {
  let component: ChannelRecommendationComponent;
  let fixture: ComponentFixture<ChannelRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChannelRecommendationComponent],
      providers: [
        {
          provide: ApiService,
          useValue: apiServiceMock,
        },
        {
          provide: ExperimentsService,
          useValue: MockService(ExperimentsService),
        },
        {
          provide: RecentSubscriptionsService,
          useValue: MockService(RecentSubscriptionsService),
        },
        {
          provide: AnalyticsService,
          useValue: MockService(AnalyticsService),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
