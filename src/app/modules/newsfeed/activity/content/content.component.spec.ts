import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectorRef, ElementRef, Injector } from '@angular/core';
import {
  ActivityEntity,
  ActivityService,
} from '../../activity/activity.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ModalService } from '../../../../services/ux/modal.service';
import { Router } from '@angular/router';
import { RedirectService } from '../../../../common/services/redirect.service';
import { Session } from '../../../../services/session';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ActivityModalCreatorService } from '../modal/modal-creator.service';
import { PersistentFeedExperimentService } from '../../../experiments/sub-services/persistent-feed-experiment.service';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';
import { ActivityContentComponent } from './content.component';
import { BehaviorSubject } from 'rxjs';
import userMock from '../../../../mocks/responses/user.mock';
import { TagsPipeMock } from '../../../../mocks/pipes/tagsPipe.mock';

describe('ActivityContentComponent', () => {
  let comp: ActivityContentComponent;
  let fixture: ComponentFixture<ActivityContentComponent>;

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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ActivityContentComponent,
        MockComponent({
          selector: 'm-richEmbed',
          inputs: ['src', 'maxheight', 'isModal', 'displayAsColumn'],
          outputs: ['mediaModalRequested'],
        }),
        MockComponent({
          selector: 'm-videoPlayer--scrollaware',
          inputs: ['guid', 'shouldPlayInModal', 'isModal', 'isLivestream'],
          outputs: ['mediaModalRequested'],
        }),
        MockComponent({
          selector: 'm-activityContent__multiImage',
          outputs: ['onClick'],
        }),
        MockComponent({
          selector: 'm-activity__quote',
          inputs: ['parentService', 'entity'],
        }),
        MockComponent({
          selector: 'm-activity__permalink',
        }),
        MockComponent({
          selector: 'm-readMore',
          inputs: ['text', 'targetLength', 'disabled', 'paywallContext'],
          outputs: ['onToggle'],
        }),
        MockComponent({
          selector: 'm-translate',
          inputs: ['open', 'entity', 'translateEvent'],
          outputs: ['onTranslate', 'onTranslateError'],
        }),
        MockComponent({
          selector: 'm-activity__paywall',
          inputs: ['hideText'],
        }),
        TagsPipeMock,
      ],
      providers: [
        {
          provide: ActivityService,
          useValue: MockService(ActivityService, {
            has: [
              'entity$',
              'height$',
              'paywallUnlockedEmitter',
              'canonicalUrl$',
              'isRemind$',
              'isQuote$',
              'isSupermindReply$',
              'isMultiImage$',
              'activeMultiImageIndex$',
              'shouldShowPaywallBadge$',
              'displayOptions',
            ],
            props: {
              entity$: { get: () => new BehaviorSubject<any>(mockEntity) },
              height$: { get: () => new BehaviorSubject<number>(1) },
              paywallUnlockedEmitter: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              canonicalUrl$: { get: () => new BehaviorSubject<string>('') },
              isRemind$: { get: () => new BehaviorSubject<boolean>(false) },
              isQuote$: { get: () => new BehaviorSubject<boolean>(false) },
              isSupermindReply$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              isMultiImage$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              activeMultiImageIndex$: {
                get: () => new BehaviorSubject<number>(null),
              },
              shouldShowPaywallBadge$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              displayOptions: {
                get: () => {
                  return {
                    minimalMode: false,
                    sidbarMode: false,
                  };
                },
              },
            },
          }),
        },
        { provide: ModalService, useValue: MockService(ModalService) },
        { provide: Router, useValue: MockService(Router) },
        { provide: RedirectService, useValue: MockService(RedirectService) },
        { provide: Session, useValue: MockService(Session) },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: Injector, useValue: MockService(Injector) },
        {
          provide: ActivityModalCreatorService,
          useValue: MockService(ActivityModalCreatorService),
        },
        {
          provide: PersistentFeedExperimentService,
          useValue: MockService(PersistentFeedExperimentService),
        },
        { provide: ElementRef, useValue: MockService(ElementRef) },
        {
          provide: ChangeDetectorRef,
          useValue: MockService(ChangeDetectorRef),
        },
        { provide: IS_TENANT_NETWORK, useValue: false },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(ActivityContentComponent);
    comp = fixture.componentInstance;

    (comp as any).session.getLoggedInUser.and.returnValue(userMock);
    comp.isMultiImage = false;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('bodyText', () => {
    it('should return the body for a deleted remind', () => {
      comp.entity = {
        ...mockEntity,
        remind_deleted: true,
        message: ' ',
      };
      expect(comp.bodyText).toEqual('');
    });

    it('should return the message as body for an image when title and message do not match ', () => {
      comp.entity = {
        ...mockEntity,
        custom_type: 'batch',
        message: 'message',
        title: 'title',
      };
      expect(comp.bodyText).toEqual(comp.entity.message);
    });

    it('should return no body for an image when title and message do match ', () => {
      comp.entity = {
        ...mockEntity,
        custom_type: 'batch',
        message: 'message',
        title: 'message',
      };
      expect(comp.bodyText).toEqual('');
    });

    it('should return the message as body for a video when title and message do not match ', () => {
      comp.entity = {
        ...mockEntity,
        custom_type: 'video',
        message: 'message',
        title: 'title',
      };
      expect(comp.bodyText).toEqual(comp.entity.message);
    });

    it('should return no body for a video when title and message do match ', () => {
      comp.entity = {
        ...mockEntity,
        custom_type: 'video',
        message: 'message',
        title: 'message',
      };
      expect(comp.bodyText).toEqual('');
    });

    it('should return the message as body for multi-image when title and message do not match ', () => {
      comp.entity = {
        ...mockEntity,
        custom_type: 'video',
        message: 'message',
        title: 'title',
      };
      expect(comp.bodyText).toEqual(comp.entity.message);
    });

    it('should return no body for multi-image when title and message do match ', () => {
      comp.entity = {
        ...mockEntity,
        custom_type: 'batch',
        message: 'message',
        title: 'message',
      };
      comp.isMultiImage = true;
      expect(comp.bodyText).toEqual('');
    });

    it('should return no body for blog when there is no message ', () => {
      comp.entity = {
        ...mockEntity,
        content_type: 'blog',
        message: '',
        title: 'message',
      };
      expect(comp.bodyText).toEqual('');
    });

    it('should return no body for blog when title and message match ', () => {
      comp.entity = {
        ...mockEntity,
        content_type: 'blog',
        message: 'message',
        title: 'message',
      };
      expect(comp.bodyText).toEqual('');
    });

    it('should return no body for rich-embed when title is set but no message', () => {
      comp.entity = {
        ...mockEntity,
        custom_type: null,
        perma_url: 'https://example.minds.com/newsfeed/1234567892',
        message: '',
        title: 'message',
      };
      expect(comp.bodyText).toEqual('');
    });

    it('should return message for embed for non video, activity blog or rich-embed', () => {
      comp.entity = {
        ...mockEntity,
        custom_type: null,
        thumbnail_src: null,
        perma_url: null,
        message: 'message',
        title: 'title',
      };
      expect(comp.bodyText).toEqual(comp.entity.message);
    });

    it('should return title for embed for non video, activity blog or rich-embed', () => {
      comp.entity = {
        ...mockEntity,
        custom_type: null,
        thumbnail_src: null,
        perma_url: null,
        message: null,
        title: 'title',
      };
      expect(comp.titleText).toEqual(comp.entity.title);
    });
  });
});
