import { TestBed } from '@angular/core/testing';
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

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CookieModule],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: SiteService, useValue: siteServiceMock },
        CookieService,
        {
          provide: COOKIE_OPTIONS,
          useValue: CookieOptionsProvider,
        },
        AnalyticsService,
        { provide: Session, useValue: sessionMock },
      ],
    });
    service = TestBed.inject(AnalyticsService);
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
});
