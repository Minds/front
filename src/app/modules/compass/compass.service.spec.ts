import { TestBed } from '@angular/core/testing';

import { CompassService } from './compass.service';
import { MockService } from '../../utils/mock';
import { ToasterService } from '../../common/services/toaster.service';
import { Session } from '../../services/session';
import { sessionMock } from '../../../tests/session-mock.spec';
import { CookieService } from '../../common/services/cookie.service';
import { clientMock } from '../../../tests/client-mock.spec';
import { Client } from '../../services/api';

describe('CompassService', () => {
  let service: CompassService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CompassService,
          useValue: MockService(CompassService),
        },
        {
          provide: Client,
          useValue: clientMock,
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: Session,
          useValue: sessionMock,
        },
        CookieService,
      ],
    });
    service = TestBed.inject(CompassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
