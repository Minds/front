import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthModalComponent } from './auth-modal.component';
import { SiteService } from '../../../common/services/site.service';
import { MockComponent, MockService } from '../../../utils/mock';
import { CDN_ASSETS_URL } from '../../../common/injection-tokens/url-injection-tokens';
import { SITE_NAME } from '../../../common/injection-tokens/common-injection-tokens';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import { AuthModalImageService } from './auth-modal-image.service';
import { MultiTenantConfigImageService } from '../../multi-tenant-network/services/config-image.service';

describe('AuthModalComponent', () => {
  let component: AuthModalComponent;
  let fixture: ComponentFixture<AuthModalComponent>;
  let cdnAssetsUrl: string = 'https://example.minds.com/';
  let siteName: string = 'Test site';
  let isTenantNetwork: boolean = false;

  beforeEach(waitForAsync(() => {
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
        {
          provide: AuthModalImageService,
          useValue: MockService(AuthModalImageService),
        },
        {
          provide: MultiTenantConfigImageService,
          useValue: MockService(MultiTenantConfigImageService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
