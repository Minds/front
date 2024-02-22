import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitySiteMembershipCtaComponent } from './site-membership-cta.component';
import { ActivityEntity, ActivityService } from '../activity.service';
import { MockService } from '../../../../utils/mock';
import { ReplaySubject } from 'rxjs';
import { WINDOW } from '../../../../common/injection-tokens/common-injection-tokens';
import userMock from '../../../../mocks/responses/user.mock';

describe('ActivitySiteMembershipCtaComponent', () => {
  let comp: ActivitySiteMembershipCtaComponent;
  let fixture: ComponentFixture<ActivitySiteMembershipCtaComponent>;

  const mockEntity: ActivityEntity = {
    guid: '1234567891234560',
    ownerObj: userMock,
    containerObj: null,
    message: 'mockMessage',
    title: 'mockTitle',
    blurb: 'mockBlurb',
    custom_type: null,
    custom_data: {},
    entity_guid: '1234567891234561',
    thumbnail_src: 'https://example.minds.com/newsfeed/1234567891',
    perma_url: 'https://example.minds.com/newsfeed/1234567892',
    time_created: Date.now(),
    edited: false,
    nsfw: [],
    paywall: false,
    impressions: 0,
    boostToggle: false,
    goal_button_text: null,
    goal_button_url: null,
  };

  const mockWindow: Window = window;
  const entityMock$ = new ReplaySubject<ActivityEntity>();
  let displayOptionsMock = {
    minimalMode: false,
  };

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [ActivitySiteMembershipCtaComponent],
      providers: [
        {
          provide: ActivityService,
          useValue: MockService(ActivityService, {
            has: ['displayOptions', 'entity$'],
            props: {
              displayOptions: {
                get: () => displayOptionsMock,
              },
              entity$: {
                get: () => entityMock$,
              },
            },
          }),
        },
        { provide: WINDOW, useValue: mockWindow },
      ],
    });

    fixture = TestBed.createComponent(ActivitySiteMembershipCtaComponent);
    comp = fixture.componentInstance;

    spyOn((comp as any).window, 'open');

    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should open checkout flow on click', () => {
    entityMock$.next(mockEntity);

    comp.onClick(new MouseEvent('click'));

    expect(window.open).toHaveBeenCalledWith(
      '/api/v3/payments/site-memberships/paywalled-entities/1234567891234560/checkout?redirectPath=/newsfeed/1234567891234560',
      '_self'
    );
  });
});
