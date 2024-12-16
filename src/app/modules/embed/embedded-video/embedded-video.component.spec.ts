import { XhrFactory } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { REQUEST, RESPONSE } from '../../../../express.tokens';
import { DefaultPlyrDriver } from 'ngx-plyr-mg';
import { BehaviorSubject, of } from 'rxjs';
import { clientMock } from '../../../../tests/client-mock.spec';
import { ServerXhr } from '../../../app.server.module';
import { ConfigsService } from '../../../common/services/configs.service';
import { DiagnosticsService } from '../../../common/services/diagnostics/diagnostics.service';
import { ServerDiagnosticsService } from '../../../common/services/diagnostics/server-diagnostics.service';
import {
  HeadersService,
  ServerHeadersService,
} from '../../../common/services/headers.service';
import { SENTRY } from '../../../common/services/diagnostics/diagnostics.service';
import { MetaService } from '../../../common/services/meta.service';
import {
  RedirectService,
  ServerRedirectService,
} from '../../../common/services/redirect.service';
import { RelatedContentService } from '../../../common/services/related-content.service';
import { Client } from '../../../services/api/client';
import { MockService } from '../../../utils/mock';
import { HlsjsPlyrDriver } from '../../media/components/video-player/hls-driver';
import { EmbedModule } from '../embed.module';
import * as Sentry from '@sentry/browser';
import { EmbeddedVideoComponent } from './embedded-video.component';
import { By } from '@angular/platform-browser';
import { AnalyticsService } from '../../../services/analytics';
import { siteServiceMock } from '../../../mocks/services/site-service-mock.spec';
import { POSTHOG_JS } from '../../../common/services/posthog/posthog-injection-tokens';
import posthog from 'posthog-js';
import { ToasterService } from '../../../common/services/toaster.service';
import { CookieService } from '../../../common/services/cookie.service';

const GUID = '1155576347020644352';
const OWNER_GUID = '1153095520021913602';
const ICON_TIME = '1600296735';
const USERNAME = 'test';
const TITLE = 'Test title';

const ENTITY = {
  guid: GUID,
  type: 'object',
  subtype: 'video',
  time_created: '1600887025',
  time_updated: '1603284571',
  container_guid: OWNER_GUID,
  owner_guid: OWNER_GUID,
  access_id: '2',
  tags: [],
  nsfw: [],
  nsfw_lock: [],
  allow_comments: true,
  title: TITLE,
  description: '<?xml encoding="utf-8" ?>\n',
  featured: false,
  featured_id: false,
  ownerObj: {
    guid: OWNER_GUID,
    type: 'user',
    subtype: false,
    time_created: '1600295395',
    time_updated: false,
    container_guid: '0',
    owner_guid: '0',
    site_guid: false,
    access_id: '2',
    tags: ['art', 'technology', 'minds'],
    nsfw: [],
    nsfw_lock: [],
    allow_comments: false,
    name: 'manishoo',
    username: USERNAME,
    language: 'en',
    icontime: ICON_TIME,
    legacy_guid: false,
    featured_id: false,
    banned: 'no',
    ban_reason: false,
    website: false,
    briefdescription: 'I love music, philosophy, and technology!',
    gender: false,
    city: '',
    merchant: false,
    boostProPlus: false,
    fb: false,
    mature: '1',
    monetized: false,
    signup_method: false,
    social_profiles: [],
    feature_flags: false,
    programs: [],
    plus: false,
    hashtags: false,
    verified: true,
    founder: false,
    disabled_boost: false,
    boost_autorotate: true,
    categories: [],
    wire_rewards: null,
    pinned_posts: [],
    is_mature: false,
    mature_lock: false,
    last_accepted_tos: '1558597098',
    opted_in_hashtags: '3',
    last_avatar_upload: '1600296220',
    canary: true,
    theme: 'light',
    toaster_notifications: true,
    mode: '0',
    btc_address: '',
    surge_token: '',
    hide_share_buttons: false,
    allow_unsubscribed_contact: true,
    dismissed_widgets: ['discovery-disclaimer-2020'],
    chat: true,
    urn: 'urn:user:1153095520021913602',
    subscribed: false,
    subscriber: false,
    boost_rating: '1',
    pro: false,
    rewards: false,
    p2p_media_enabled: false,
    is_admin: false,
    onchain_booster: '0',
    email_confirmed: true,
    rating: '1',
    disable_autoplay_videos: false,
    yt_channels: [],
  },
  category: false,
  'comments:count': '0',
  'thumbs:up:count': 0,
  'thumbs:up:user_guids': false,
  'thumbs:down:count': 0,
  'thumbs:down:user_guids': false,
  flags: { full_hd: false, mature: false },
  wire_threshold: '0',
  width: 1080,
  height: 1920,
  thumbnail: false,
  cinemr_guid: GUID,
  license: 'all-rights-reserved',
  monetized: false,
  mature: false,
  boost_rejection_reason: -1,
  paywall: false,
  permaweb_id: '',
  urn: 'urn:video:GUID',
  thumbnail_src: 'https://cdn.minds.com/fs/v1/thumbnail/GUID/medium/',
  src: {
    '360.mp4': 'https://cdn-cinemr.minds.com/cinemr_com/GUID/360.mp4',
    '720.mp4': 'https://cdn-cinemr.minds.com/cinemr_com/GUID/720.mp4',
  },
  'play:count': 0,
  rating: 2,
  time_sent: null,
  youtube_id: '',
  youtube_channel_id: '',
  transcoding_status: '',
};
const CLIENT_RESPONSE = {
  status: 'success',
  entity: ENTITY,
  sources: [
    {
      guid: GUID,
      src: 'https://cdn-cinemr.minds.com/cinemr_com/GUID/360.mp4',
      type: 'video/mp4',
      size: 360,
      label: 'X264_360p',
    },
    {
      guid: GUID,
      src: 'https://cdn-cinemr.minds.com/cinemr_com/GUID/720.mp4',
      type: 'video/mp4',
      size: 720,
      label: 'X264_720p',
    },
    {
      guid: GUID,
      src: 'https://cdn-cinemr.minds.com/cinemr_com/GUID/720.webm',
      type: 'video/webm',
      size: 720,
      label: 'Webm_720p',
    },
    {
      guid: GUID,
      src: 'https://cdn-cinemr.minds.com/cinemr_com/GUID/360.webm',
      type: 'video/webm',
      size: 360,
      label: 'Webm_360p',
    },
  ],
  poster: 'https://cdn.minds.com/fs/v1/thumbnail/GUID/medium/',
  transcode_status: 'completed',
};

describe('EmbeddedVideoComponent', () => {
  let component: EmbeddedVideoComponent;
  let fixture: ComponentFixture<EmbeddedVideoComponent>;
  let metaServiceMock: MetaService = MockService(MetaService) as any;

  function setup(guid, autoplay) {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: {
        queryParamMap: new BehaviorSubject(convertToParamMap({ autoplay })),
        paramMap: new BehaviorSubject(convertToParamMap({ guid })),
      },
    });

    TestBed.overrideProvider(ToasterService, {
      useValue: MockService(ToasterService),
    });

    TestBed.compileComponents();
    fixture = TestBed.createComponent(EmbeddedVideoComponent);
    component = fixture.componentInstance;
  }

  beforeEach(() => {
    const configsServiceMock = MockService(ConfigsService, {
      get: (key) => {
        const config = {
          site_url: 'https://minds.com/',
          cdn_url: 'https://cdn.minds.com/',
        };
        return config[key];
      },
    });

    TestBed.configureTestingModule({
      declarations: [EmbeddedVideoComponent],
      providers: [
        { provide: DiagnosticsService, useClass: ServerDiagnosticsService },
        { provide: XhrFactory, useClass: ServerXhr },
        CookieService,
        {
          provide: RedirectService,
          useClass: ServerRedirectService,
        },
        {
          provide: HeadersService,
          useClass: ServerHeadersService,
        },
        {
          provide: HlsjsPlyrDriver,
          useClass: DefaultPlyrDriver,
        },
        { provide: Client, useValue: clientMock },
        { provide: MetaService, useValue: metaServiceMock },
        {
          provide: RelatedContentService,
          useValue: MockService(RelatedContentService),
        },
        {
          provide: ConfigsService,
          useValue: configsServiceMock,
        },
        {
          provide: REQUEST,
          useValue: {},
        },
        {
          provide: RESPONSE,
          useValue: {},
        },
        { provide: 'ORIGIN_URL', useValue: location.origin },
        {
          provide: 'QUERY_STRING',
          useFactory: () => '',
        },
        {
          provide: SENTRY,
          useValue: Sentry,
        },
        {
          provide: POSTHOG_JS,
          useValue: posthog,
        },
        {
          provide: AnalyticsService,
          useValue: MockService(AnalyticsService),
        },
      ],
      imports: [EmbedModule],
    });

    siteServiceMock.baseUrl = 'https://www.minds.com/';
    siteServiceMock.cdnUrl = 'https://cdn.minds.com/';

    clientMock.response = CLIENT_RESPONSE;
  });

  it('should create', () => {
    setup(null, null);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set autoplay from url params when in query params', () => {
    setup(null, 'true');
    fixture.detectChanges();
    expect(component.autoplay).toBe(true);
  });

  it('should not set autoplay from url params when not in query params', () => {
    setup(GUID, null);
    fixture.detectChanges();
    expect(component.autoplay).toBe(false);
  });

  it('should call load when guid was in url params', () => {
    setup(GUID, null);
    spyOn(component, 'load').and.callThrough();
    fixture.detectChanges();
    expect(component.load).toHaveBeenCalled();
  });

  it('should not call load when guid was not in url params', () => {
    setup(null, null);
    spyOn(component, 'load').and.callThrough();
    fixture.detectChanges();
    expect(component.load).not.toHaveBeenCalled();
  });

  it('should request for entity when load is called', () => {
    setup(GUID, null);
    fixture.detectChanges();
    expect(clientMock.get).toHaveBeenCalled();
    expect(clientMock.get.calls.mostRecent().args[0]).toBe(
      `api/v2/media/video/${GUID}`
    );
  });

  it('should set entity correctly when guid was in url params', fakeAsync(() => {
    setup(GUID, null);
    fixture.detectChanges();
    tick();
    expect(component.entity).toBe(ENTITY);
  }));

  it('should set channelUrl correctly after loading is finished', fakeAsync(() => {
    setup(GUID, null);
    fixture.detectChanges();
    tick();
    expect(component.channelUrl).toBe(`https://minds.com/${USERNAME}`);
  }));

  it('should set mediaUrl correctly after loading is finished', fakeAsync(() => {
    setup(GUID, null);
    fixture.detectChanges();
    tick();
    expect(component.mediaUrl).toBe(`https://minds.com/media/${GUID}`);
  }));

  it('should set metaData correctly after loading is finished', fakeAsync(() => {
    setup(GUID, null);
    fixture.detectChanges();
    tick();
    expect(component.title).toBe(TITLE);
    expect(metaServiceMock.setTitle).toHaveBeenCalledWith(TITLE);
    expect(metaServiceMock.setDescription).toHaveBeenCalledWith(
      ENTITY.description
    );
    expect(metaServiceMock.setOgImage).toHaveBeenCalledWith(
      ENTITY.thumbnail_src
    );
  }));

  it('should set avatar correctly', () => {
    setup(GUID, null);
    fixture.detectChanges();

    expect(component.getAvatarSrc(ENTITY.ownerObj)).toBe(
      `https://cdn.minds.com/icon/${OWNER_GUID}/large/${ICON_TIME}`
    );
  });

  it('should set top visibility to true when controls are shown', fakeAsync(() => {
    setup(GUID, null);
    fixture.detectChanges();
    component.onControlsShown();
    expect(component.topVisible).toBe(true);
  }));

  it('should set top visibility to false when controls are hidden', fakeAsync(() => {
    setup(GUID, null);
    fixture.detectChanges();
    component.onControlsHidden();
    expect(component.topVisible).toBe(false);
  }));
});
