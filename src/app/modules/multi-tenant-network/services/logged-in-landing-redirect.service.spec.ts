import { TestBed } from '@angular/core/testing';
import { TenantLoggedInLandingRedirectService } from './logged-in-landing-redirect.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { Router } from '@angular/router';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import { WINDOW } from '../../../common/injection-tokens/common-injection-tokens';
import { SITE_URL } from '../../../common/injection-tokens/url-injection-tokens';
import { mockNavigationItems } from '../admin-console/tabs/navigation/components/landing-page-section/landing-page-selector.component.spec';
import { MockService } from '../../../utils/mock';
import { NavigationItemTypeEnum } from '../../../../graphql/generated.engine';
import { Session } from '../../../services/session';
import userMock from '../../../mocks/responses/user.mock';

describe('TenantLoggedInLandingRedirectService', () => {
  let service: TenantLoggedInLandingRedirectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TenantLoggedInLandingRedirectService,
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: Router, useValue: MockService(Router) },
        { provide: Session, useValue: MockService(Session) },
        { provide: IS_TENANT_NETWORK, useValue: false },
        { provide: WINDOW, useValue: jasmine.createSpyObj('WINDOW', ['open']) },
        { provide: SITE_URL, useValue: 'https://example.minds.com/' },
      ],
    });

    service = TestBed.inject(TenantLoggedInLandingRedirectService);

    Object.defineProperty(service, 'isTenantNetwork', {
      writable: true,
      value: false,
    });
    (service as any).configs.get.withArgs('custom').and.returnValue({
      navigation: mockNavigationItems,
    });
    (service as any).configs.get.withArgs('tenant').and.returnValue({
      logged_in_landing_page_id_web: 'newsfeed',
    });
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('redirect', () => {
    it('should redirect to default landing for a non-tenant network', () => {
      (service as any).isTenantNetwork = false;

      service.redirect();

      expect((service as any).router.navigateByUrl).toHaveBeenCalledWith(
        '/newsfeed'
      );
    });

    it('should redirect to core page', () => {
      (service as any).isTenantNetwork = true;
      (service as any).configs.get.withArgs('custom').and.returnValue({
        navigation: mockNavigationItems,
      });
      (service as any).configs.get.withArgs('tenant').and.returnValue({
        logged_in_landing_page_id_web: mockNavigationItems[1].id,
      });

      service.redirect();

      expect((service as any).router.navigateByUrl).toHaveBeenCalledWith(
        mockNavigationItems[1].path
      );
    });

    it('should redirect to core channel page', () => {
      (service as any).isTenantNetwork = true;
      (service as any).session.getLoggedInUser.and.returnValue({
        ...userMock,
        username: 'test',
      });
      (service as any).configs.get.withArgs('custom').and.returnValue({
        navigation: [
          {
            id: 'channel',
            type: NavigationItemTypeEnum.Core,
          },
        ],
      });
      (service as any).configs.get.withArgs('tenant').and.returnValue({
        logged_in_landing_page_id_web: 'channel',
      });

      service.redirect();

      expect((service as any).router.navigateByUrl).toHaveBeenCalledWith(
        '/test'
      );
    });

    it('should redirect to custom link page for internal custom link with a full url', () => {
      (service as any).isTenantNetwork = true;
      (service as any).configs.get.withArgs('custom').and.returnValue({
        navigation: [
          {
            id: 'test',
            type: NavigationItemTypeEnum.CustomLink,
            url: 'https://example.minds.com/test',
          },
        ],
      });
      (service as any).configs.get.withArgs('tenant').and.returnValue({
        logged_in_landing_page_id_web: 'test',
      });

      service.redirect();

      expect((service as any).router.navigateByUrl).toHaveBeenCalledWith(
        '/test'
      );
    });

    it('should redirect to custom link page for internal custom link with a relative path', () => {
      (service as any).isTenantNetwork = true;
      (service as any).configs.get.withArgs('custom').and.returnValue({
        navigation: mockNavigationItems,
      });
      (service as any).configs.get.withArgs('tenant').and.returnValue({
        logged_in_landing_page_id_web: mockNavigationItems[2].id,
      });

      service.redirect();

      expect((service as any).router.navigateByUrl).toHaveBeenCalledWith(
        mockNavigationItems[2].url
      );
    });

    it('should redirect to fallback page when custom link is external', () => {
      (service as any).isTenantNetwork = true;
      let navItems = mockNavigationItems;
      navItems[0].url = 'https://external.minds.com/';
      navItems[0].type = NavigationItemTypeEnum.CustomLink;

      (service as any).configs.get.withArgs('custom').and.returnValue({
        navigation: navItems,
      });
      (service as any).configs.get.withArgs('tenant').and.returnValue({
        logged_in_landing_page_id_web: navItems[0].id,
      });

      service.redirect();

      expect((service as any).window.open).toHaveBeenCalledWith(
        navItems[0].url,
        '_self'
      );
    });
  });
});
