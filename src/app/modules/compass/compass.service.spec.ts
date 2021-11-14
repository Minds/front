import { TestBed } from '@angular/core/testing';

import { CompassService } from './compass.service';
import { MockComponent, MockService } from '../../utils/mock';
import { FormToastService } from '../../common/services/form-toast.service';
import { Session } from '../../services/session';
import { sessionMock } from '../../../tests/session-mock.spec';
import { CookieService } from '../../common/services/cookie.service';
import {
  CookieOptionsProvider,
  COOKIE_OPTIONS,
  CookieModule,
} from '@gorniv/ngx-universal';
import { clientMock } from '../../../tests/client-mock.spec';
import { Client } from '../../services/api';

describe('CompassService', () => {
  let service: CompassService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CookieModule],
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
          provide: FormToastService,
          useValue: MockService(FormToastService),
        },
        {
          provide: Session,
          useValue: sessionMock,
        },
        CookieService,
        {
          provide: COOKIE_OPTIONS,
          useValue: CookieOptionsProvider,
        },
      ],
    });
    service = TestBed.inject(CompassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
