import { TestBed } from "@angular/core/testing";
import { EmailAddressService } from "./email-address.service";
import { ApiService } from "../api/api.service";
import { MockService } from "../../utils/mock";
import { Session } from "../../services/session";
import { of } from "rxjs";

describe('EmailAddressService', () => {
  let service: EmailAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmailAddressService,
        { provide: ApiService, useValue: MockService(ApiService) },
        { provide: Session, useValue: MockService(Session) },
      ],
    });
    service = TestBed.inject(EmailAddressService);
    spyOn(console, 'error'); // mute errors.
    spyOn(console, 'warn'); // mute errors.
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('getEmailAddress', () => {
    it('should fetch email address', (done: DoneFn) => {
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).api.get.withArgs('/api/v3/email/address').and.returnValue(of({
        status: 'success', email: 'noreply@minds.com'
      }));

      expectAsync(service.getEmailAddress()).toBeResolvedTo('noreply@minds.com');
      done();
    });

    it('should not fetch email address when not logged in', (done: DoneFn) => {
      (service as any).session.isLoggedIn.and.returnValue(false);

      expectAsync(service.getEmailAddress()).toBeResolvedTo(null);
      done();
    });

    it('should handle no success state when fetching email address', (done: DoneFn) => {
      (service as any).session.isLoggedIn.and.returnValue(true);
      (service as any).api.get.withArgs('/api/v3/email/address').and.returnValue(of({
        status: 'error'
      }));

      expectAsync(service.getEmailAddress()).toBeResolvedTo(null);
      done();
    });
  });
});