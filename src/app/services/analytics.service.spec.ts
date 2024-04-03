import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CookieModule,
  CookieOptionsProvider,
  CookieService,
  COOKIE_OPTIONS,
} from '@mindsorg/ngx-universal';
import { clientMock } from '../../tests/client-mock.spec';
import { sessionMock } from '../../tests/session-mock.spec';
import { SiteService } from '../common/services/site.service';
import { AnalyticsService, SnowplowContext } from './analytics';
import { Client } from './api';
import { Session } from './session';
import { siteServiceMock } from '../mocks/services/site-service-mock.spec';
import { ConfigsService } from '../common/services/configs.service';
import { MockService } from '../utils/mock';
import posthog from 'posthog-js';
import { Router } from '@angular/router';

describe('AnalyticsService', () => {
  let service: AnalyticsService, router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CookieModule],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: SiteService, useValue: siteServiceMock },
        {
          provide: COOKIE_OPTIONS,
          useValue: CookieOptionsProvider,
        },
        AnalyticsService,
        { provide: Session, useValue: sessionMock },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService, {
            get: () => {
              return {
                posthog: {
                  feature_flags: [],
                },
              };
            },
          }),
        },
      ],
    });

    service = TestBed.inject(AnalyticsService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should submit click_event to snowplow', () => {
    clientMock.response = {};

    clientMock.response['https://sp.minds.com/com.minds/t'] = {};

    service.onDocumentClick(new MouseEvent('click'));
  });

  it('should build an entity_context from a given entity', () => {
    const guid = '~guid~',
      type = '~type~',
      subType = '~subtype~',
      ownerGuid = '~ownerGuid~',
      accessId = '~accessId~',
      containerGuid = '~containerGuid~';

    const builtEntityContext: SnowplowContext = service.buildEntityContext({
      guid: guid,
      type: type,
      subtype: subType,
      owner_guid: ownerGuid,
      access_id: accessId,
      container_guid: containerGuid,
    });

    expect(builtEntityContext).toEqual({
      schema: 'iglu:com.minds/entity_context/jsonschema/1-0-0',
      data: {
        entity_guid: guid,
        entity_type: type,
        entity_subtype: subType,
        entity_owner_guid: ownerGuid,
        entity_access_id: accessId,
        entity_container_guid: containerGuid,
      },
    });
  });

  it('should emit a pageview event to posthog on navigation change', fakeAsync(() => {
    spyOn(posthog, 'capture');

    router.initialNavigation();
    tick();

    expect(posthog.capture).toHaveBeenCalledWith('$pageview');
    expect(posthog.capture).toHaveBeenCalledTimes(1);
  }));

  it('should identify a user on session emission', fakeAsync(() => {
    spyOn(posthog, 'identify');

    sessionMock.loggedinEmitter.emit(true);
    tick();

    expect(posthog.identify).toHaveBeenCalledWith('1000');
  }));

  it('should reset identity on logout', fakeAsync(() => {
    spyOn(posthog, 'reset');

    sessionMock.loggedinEmitter.emit(false);
    tick();

    expect(posthog.reset).toHaveBeenCalled();
  }));

  it('should send an event when a click happens', fakeAsync(() => {
    spyOn(posthog, 'capture');

    service.trackClick('spec-test');

    expect(posthog.capture).toHaveBeenCalledWith('user_generic_click', {
      ref: 'spec-test',
    });
  }));

  it('should send an event when a click happens with entity context', fakeAsync(() => {
    spyOn(posthog, 'capture');

    service.trackClick('spec-test', [
      {
        schema: 'iglu:com.minds/entity_context/jsonschema/1-0-0',
        data: {
          entity_guid: '123',
          entity_type: 'activity',
          entity_owner_guid: '456',
        },
      },
    ]);

    expect(posthog.capture).toHaveBeenCalledWith('user_generic_click', {
      ref: 'spec-test',
      entity_guid: '123',
      entity_type: 'activity',
      entity_subtype: undefined,
      entity_owner_guid: '456',
    });
  }));
});
