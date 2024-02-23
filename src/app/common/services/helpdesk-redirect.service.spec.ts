import { TestBed } from '@angular/core/testing';
import { HelpdeskRedirectService } from './helpdesk-redirect.service';

describe('HelpdeskRedirectService', () => {
  let service: HelpdeskRedirectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HelpdeskRedirectService],
    });

    service = TestBed.inject(HelpdeskRedirectService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should get helpdesk url', () => {
    expect(service.getUrl()).toBe('https://support.minds.com/');
  });
});
