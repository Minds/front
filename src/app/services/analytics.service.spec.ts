import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
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
import userMock from '../mocks/responses/user.mock';
import { POSTHOG_JS } from '../common/services/posthog/posthog-injection-tokens';

describe('AnalyticsService', () => {
  let service: AnalyticsService,
    router: Router,
    configService: Partial<ConfigsService>;

  beforeEach(() => {
    configService = {
      get: (key) => {
        if (key === 'posthog') {
          return <any>{
            feature_flags: [],
          };
        }
        return null;
      },
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: POSTHOG_JS,
          useValue: posthog,
        },
        { provide: Client, useValue: clientMock },
        { provide: SiteService, useValue: siteServiceMock },
        AnalyticsService,
        { provide: Session, useValue: sessionMock },
        {
          provide: ConfigsService,
          useValue: configService,
        },
      ],
    });

    TestBed.inject(POSTHOG_JS);
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

    expect(posthog.capture).toHaveBeenCalledWith('$pageview', {
      environment: null,
      $set: {
        environment: null,
        guid: '1000',
      },
    });
    expect(posthog.capture).toHaveBeenCalledTimes(1);
  }));

  it('should identify a user on session emission', fakeAsync(() => {
    spyOn(posthog, 'identify');

    sessionMock.loggedinEmitter.emit(true);
    tick();

    expect(posthog.identify).toHaveBeenCalledWith('1000');
  }));

  it('should reset identity on logout', fakeAsync(() => {
    sessionMock.loggedinEmitter.emit(true);
    tick();

    spyOn(posthog, 'reset').and.callThrough();

    sessionMock.loggedinEmitter.emit(false);
    tick();

    expect(posthog.reset).toHaveBeenCalled();
  }));

  // it('should send an event when a click happens', fakeAsync(() => {
  //   spyOn(posthog, 'capture');

  //   service.trackClick('spec-test');

  //   expect(posthog.capture).toHaveBeenCalledWith('dataref_click', {
  //     ref: 'spec-test',
  //     environment: null,
  //     $set: {
  //       environment: null,
  //       guid: '1000',
  //     },
  //   });
  // }));

  // it('should send an event when a click happens with entity context', fakeAsync(() => {
  //   spyOn(posthog, 'capture');

  //   service.trackClick('spec-test', [
  //     {
  //       schema: 'iglu:com.minds/entity_context/jsonschema/1-0-0',
  //       data: {
  //         entity_guid: '123',
  //         entity_type: 'activity',
  //         entity_owner_guid: '456',
  //       },
  //     },
  //   ]);

  //   expect(posthog.capture).toHaveBeenCalledWith('dataref_click', {
  //     ref: 'spec-test',
  //     entity_guid: '123',
  //     entity_type: 'activity',
  //     entity_subtype: undefined,
  //     entity_owner_guid: '456',
  //     environment: null,
  //     $set: {
  //       environment: null,
  //       guid: '1000',
  //     },
  //   });
  // }));

  it('should respect a users opt out status when logging in', fakeAsync(() => {
    spyOn(posthog, 'opt_out_capturing');

    spyOn(configService, 'get').and.returnValue({
      opt_out: true, // user is opted out of analytics
    });

    service.setUser(userMock);

    expect(posthog.opt_out_capturing).toHaveBeenCalled();
  }));

  it('should restart tracking if a user is not opted out, but a previous session was', fakeAsync(() => {
    spyOn(posthog, 'has_opted_out_capturing').and.returnValue(true);
    spyOn(posthog, 'clear_opt_in_out_capturing');

    spyOn(configService, 'get').and.returnValue({
      opt_out: false, // user is NOT opted out of analytics
    });

    service.setUser(userMock);

    expect(posthog.clear_opt_in_out_capturing).toHaveBeenCalled();
  }));

  it('should make sure a user, opted out, who logs out retains their opt out status', fakeAsync(() => {
    spyOn(posthog, 'reset').and.callThrough();
    spyOn(posthog, 'opt_out_capturing').and.callThrough();

    spyOn(configService, 'get').and.returnValue({
      opt_out: true, // user is opted out of analytics
    });

    sessionMock.loggedinEmitter.emit(true);
    tick(1000);

    sessionMock.loggedinEmitter.emit(false);
    tick(1000);

    expect(posthog.reset).toHaveBeenCalled();
    expect(posthog.opt_out_capturing).toHaveBeenCalled();
  }));

  describe('setGlobalProperty', () => {
    beforeEach(() => {
      service.globalProperties = {};
    });

    afterEach(() => {
      service.globalProperties = {};
    });

    it('should set a global property', () => {
      service.setGlobalProperty('test', 'value');
      expect(service.globalProperties).toEqual({ test: 'value' });
    });

    it('should delete a global property when undefined', () => {
      service.setGlobalProperty('test', undefined);
      expect(service.globalProperties).toEqual({});
    });
  });
});
