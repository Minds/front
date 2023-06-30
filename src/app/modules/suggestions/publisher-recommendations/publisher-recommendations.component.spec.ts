import { AnalyticsService } from '../../../services/analytics';
import { RecentSubscriptionsService } from '../../../common/services/recent-subscriptions.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiService } from '../../../common/api/api.service';
import { PublisherRecommendationsComponent } from './publisher-recommendations.component';
import { ExperimentsService } from '../../experiments/experiments.service';
import { MockService } from '../../../utils/mock';
import { NewsfeedService } from '../../newsfeed/services/newsfeed.service';
import { MindsUser } from '../../../interfaces/entities';
import userMock from '../../../mocks/responses/user.mock';
import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';

describe('PublisherRecommendationsComponent', () => {
  let component: PublisherRecommendationsComponent;
  let fixture: ComponentFixture<PublisherRecommendationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublisherRecommendationsComponent],
      providers: [
        {
          provide: ApiService,
          useValue: MockService(ApiService),
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
        {
          provide: NewsfeedService,
          useValue: MockService(NewsfeedService),
        },
        {
          provide: ClientMetaDirective,
          useValue: MockService(ClientMetaDirective),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisherRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call to record view', () => {
    let user: MindsUser = userMock;
    let position: number = 1;

    user.boosted_guid = null;

    component.trackView(user, position);

    expect(
      (component as any).analyticsService.trackEntityView
    ).toHaveBeenCalled();
    expect(
      (component as any).newsfeedService.recordView
    ).not.toHaveBeenCalled();
  });

  it('should call to record view via newsfeed service for boosts', () => {
    let user: MindsUser = userMock;
    let position: number = 1;

    user.boosted_guid = '123';

    component.trackView(user, position);

    expect((component as any).newsfeedService.recordView).toHaveBeenCalled();
    expect(
      (component as any).analyticsService.trackEntityView
    ).not.toHaveBeenCalled();
  });
});
