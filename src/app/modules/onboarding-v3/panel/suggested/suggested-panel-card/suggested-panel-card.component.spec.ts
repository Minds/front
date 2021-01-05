import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingV3SuggestionsPanelCardComponent } from './suggested-panel-card.component';
import { MockService } from '../../../../../utils/mock';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { ApiService } from '../../../../../common/api/api.service';
import { FormToastService } from '../../../../../common/services/form-toast.service';

describe('OnboardingV3SuggestionsPanelCardComponent', () => {
  let comp: OnboardingV3SuggestionsPanelCardComponent;
  let fixture: ComponentFixture<OnboardingV3SuggestionsPanelCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingV3SuggestionsPanelCardComponent],
      providers: [
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
        {
          provide: ApiService,
          useValue: MockService(ApiService),
        },
        {
          provide: FormToastService,
          useValue: MockService(FormToastService),
        },
      ],
      imports: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      OnboardingV3SuggestionsPanelCardComponent
    );

    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('description should have entity description', () => {
    const description = 'foo';

    comp.entity = {
      briefdescription: description,
    };

    expect(comp.description).toBe(description);
  });

  it('name should have entity name', () => {
    const name = 'Minds';

    comp.entity = {
      name: name,
    };

    expect(comp.name).toBe(name);
  });

  it('username should have entity username', () => {
    const username = 'minds';

    comp.entity = {
      username: username,
    };

    expect(comp.username).toBe(username);
  });

  it('subscribersCount should have entity subscriber_count', () => {
    const subscribersCount = '123';

    comp.entity = {
      subscribers_count: subscribersCount,
    };

    expect(comp.subscribersCount).toBe(subscribersCount);
  });

  it('subscriptionsCount should have entity subscriptions_count', () => {
    const subscriptionsCount = '321';

    comp.entity = {
      subscriptions_count: subscriptionsCount,
    };

    expect(comp.subscriptionsCount).toBe(subscriptionsCount);
  });

  it('membershipCount should have entity members:count', () => {
    const membershipCount = '222';

    comp.entity = {
      'members:count': membershipCount,
    };

    expect(comp.membershipCount).toBe(membershipCount);
  });

  it('hashtags should have entity hashtags', () => {
    const tags = ['Minds'];

    comp.entity = {
      tags: tags,
    };

    expect((comp as any).hashtags).toBe(tags);
  });

  it('url for groups should have correct url for entity', () => {
    comp.entity = {
      type: 'group',
      guid: '123',
    };

    expect((comp as any).url).toBe('/groups/profile/123/feed');
  });

  it('url for user should have correct url for entity', () => {
    comp.entity = {
      type: 'user',
      username: 'minds',
    };

    expect((comp as any).url).toBe('/minds');
  });

  it('should detect if subscribed to channel', () => {
    comp.entity = {
      type: 'user',
      subscribed: true,
    };

    expect((comp as any).isSubscribed).toBe(true);
  });

  it('should detect if not subscribed to channel', () => {
    comp.entity = {
      type: 'user',
      subscribed: false,
    };

    expect((comp as any).isSubscribed).toBe(false);
  });

  it('should detect if a member of a group', () => {
    comp.entity = {
      type: 'group',
      'is:member': true,
    };

    expect((comp as any).isSubscribed).toBe(true);
  });

  it('should detect if not a member of a group', () => {
    comp.entity = {
      type: 'group',
      'is:member': false,
    };

    expect((comp as any).isSubscribed).toBe(false);
  });

  it('should get correct avatar url for channel', () => {
    comp.entity = {
      icontime: '123',
      type: 'user',
      guid: '0000111122223333',
    };

    expect((comp as any).avatarUrl).toBe(
      'nullicon/0000111122223333/medium/123'
    );
  });

  it('should get correct avatar url for group', () => {
    comp.entity = {
      icontime: '123',
      type: 'group',
      guid: '0000111122223333',
    };

    expect((comp as any).avatarUrl).toBe(
      'nullfs/v1/avatars/0000111122223333/123'
    );
  });
});
