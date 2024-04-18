import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ChannelActionsPostSubscriptionsComponent } from './post-subscriptions.component';
import { BehaviorSubject } from 'rxjs';
import { MockService } from '../../../../utils/mock';
import { ChannelsV2Service } from '../channels-v2.service';
import { PostSubscriptionsService } from '../../../notifications/post-subscriptions/post-subscriptions.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { PostSubscriptionFrequencyEnum } from '../../../../../graphql/generated.engine';
import { CommonModule } from '../../../../common/common.module';

describe('ChannelActionsPostSubscriptionsComponent', () => {
  let comp: ChannelActionsPostSubscriptionsComponent;
  let fixture: ComponentFixture<ChannelActionsPostSubscriptionsComponent>;

  let serviceMock;

  beforeEach(async () => {
    serviceMock = MockService(PostSubscriptionsService, {
      async getPostSubscription(entityGuid: string) {
        return {
          frequency: PostSubscriptionFrequencyEnum.Never,
        };
      },
    });

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ChannelActionsPostSubscriptionsComponent],
      providers: [
        {
          provide: ChannelsV2Service,
          useValue: MockService(ChannelsV2Service, {
            has: ['guid$'],
            props: {
              guid$: {
                get: () => new BehaviorSubject<string>('123'),
              },
            },
          }),
        },
        {
          provide: PostSubscriptionsService,
          useValue: serviceMock,
        },
        ToasterService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelActionsPostSubscriptionsComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should change frequency on click', fakeAsync(async () => {
    // Should not be needed...
    comp.frequency = PostSubscriptionFrequencyEnum.Never;

    expect(comp.frequency).toBe(PostSubscriptionFrequencyEnum.Never);

    comp.onClick();

    expect(comp.submitting).withContext('should be submitting').toBe(true);

    tick();

    serviceMock.updatePostSubscription.and.returnValue(true);

    expect(serviceMock.updatePostSubscription).toHaveBeenCalled();

    tick();

    expect(comp.submitting).withContext('should not be submitting').toBe(false);

    expect(comp.frequency).toBe(PostSubscriptionFrequencyEnum.Always);
  }));
});
