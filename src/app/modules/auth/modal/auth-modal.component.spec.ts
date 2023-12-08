import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthModalComponent } from './auth-modal.component';
import { SiteService } from '../../../common/services/site.service';
import { MockComponent, MockService } from '../../../utils/mock';
import { CDN_ASSETS_URL } from '../../../common/injection-tokens/url-injection-tokens';
import { SITE_NAME } from '../../../common/injection-tokens/common-injection-tokens';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';

describe('AuthModalComponent', () => {
  let component: AuthModalComponent;
  let fixture: ComponentFixture<AuthModalComponent>;
  let cdnAssetsUrl: string = 'https://example.minds.com/';
  let siteName: string = 'Test site';
  let isTenantNetwork: boolean = false;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          AuthModalComponent,
          MockComponent({
            selector: 'm-loginForm',
            inputs: ['source'],
            outputs: ['done', 'doneRegistered', 'showRegisterForm'],
          }),
          MockComponent({
            selector: 'm-registerForm',
            inputs: ['source'],
            outputs: ['done', 'showLoginForm'],
          }),
          MockComponent({
            selector: 'm-modalCloseButton',
            inputs: ['color'],
          }),
        ],
        providers: [
          { provide: SiteService, useValue: MockService(SiteService) },
          { provide: CDN_ASSETS_URL, useValue: cdnAssetsUrl },
          { provide: SITE_NAME, useValue: siteName },
          { provide: IS_TENANT_NETWORK, useValue: isTenantNetwork },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('title', () => {
    it('should get title for register form on multi-tenant domain', () => {
      (component as any).formDisplay = 'register';
      (component as any).isTenantNetwork = true;
      expect(component.title).toBe('Join Test site');
    });

    it('should get title for register form on Minds', () => {
      (component as any).formDisplay = 'register';
      (component as any).isTenantNetwork = false;
      expect(component.title).toBe('Join Minds');
    });

    it('should get title for register form on Login', () => {
      (component as any).formDisplay = 'Login';
      expect(component.title).toBe('Login');
    });
  });

  describe('getLogoSrc', () => {
    it('should get logo src when NOT on multi-tenant network', () => {
      (component as any).isTenantNetwork = false;
      expect(component.getLogoSrc()).toBe(
        `${cdnAssetsUrl}assets/logos/bulb.svg`
      );
    });

    it('should get logo src when on multi-tenant network', () => {
      (component as any).isTenantNetwork = true;
      expect(component.getLogoSrc()).toBe(
        '/api/v3/multi-tenant/configs/image/square_logo'
      );
    });
  });
});
