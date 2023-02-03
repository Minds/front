import { ReferralUrlService } from './referral-url.service';

describe('ReferralUrlService', () => {
  let service: ReferralUrlService;

  const baseUrl: string = 'https://www.minds.com/';
  const mockUser: { username: string } = { username: 'mindsUser' };

  let sessionMock = new (function() {
    this.getLoggedInUser = jasmine
      .createSpy('getLoggedInUser')
      .and.returnValue(mockUser);
  })();

  let configMock = new (function() {
    this.get = jasmine.createSpy('get').and.returnValue(baseUrl);
  })();

  beforeEach(() => {
    service = new ReferralUrlService(sessionMock, configMock);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should get referral url', () => {
    expect(service.get()).toBe(
      'https://www.minds.com/register?referrer=mindsUser'
    );
  });
});
