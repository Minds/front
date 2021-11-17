import { TestBed } from '@angular/core/testing';
import {
  CookieModule,
  CookieOptionsProvider,
  CookieService,
  COOKIE_OPTIONS,
} from '@gorniv/ngx-universal';
import { sessionMock } from '../../../tests/session-mock.spec';
import { compassServiceMock } from '../../mocks/modules/compass/compass.service.mock';
import { CompassService } from '../../modules/compass/compass.service';
import { Session } from '../../services/session';

import { CompassHookService } from './compass-hook.service';

describe('CompassHookService', () => {
  let service: CompassHookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CookieModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        CookieService,
        {
          provide: COOKIE_OPTIONS,
          useValue: CookieOptionsProvider,
        },
        { provide: CompassService, useValue: compassServiceMock },
      ],
    });
    service = TestBed.inject(CompassHookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
