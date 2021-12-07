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
import { siteServiceMock } from '../modules/notifications/notification.service.spec';

import { AnalyticsService } from './analytics';
import { Client } from './api';
import { Session } from './session';

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
});
