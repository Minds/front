import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthRedirectService } from './auth-redirect.service';
import { MockService } from '../../utils/mock';

describe('AuthRedirectService', () => {
  let service: AuthRedirectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthRedirectService,
        { provide: Router, useValue: MockService(Router) },
      ],
    });
    service = TestBed.inject(AuthRedirectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to default redirect URL', async () => {
    await service.redirect();
    expect((service as any).router.navigate).toHaveBeenCalledWith([
      '/newsfeed/subscriptions/for-you',
    ]);
  });

  it('should return default redirect URL', () => {
    expect(service.getRedirectUrl()).toBe('/newsfeed/subscriptions/for-you');
  });
});
