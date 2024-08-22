import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantCustomHomepageAdvertiseComponent } from './advertise.component';
import { Router } from '@angular/router';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { AuthRedirectService } from '../../../../../common/services/auth-redirect.service';
import { SITE_NAME } from '../../../../../common/injection-tokens/common-injection-tokens';

describe('TenantCustomHomepageAdvertiseComponent', () => {
  let comp: TenantCustomHomepageAdvertiseComponent;
  let fixture: ComponentFixture<TenantCustomHomepageAdvertiseComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        TenantCustomHomepageAdvertiseComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'size', 'solid', 'softSquare'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        { provide: Router, useValue: MockService(Router) },
        {
          provide: AuthRedirectService,
          useValue: MockService(AuthRedirectService),
        },
        { provide: SITE_NAME, useValue: 'Tenant' },
      ],
    });

    fixture = TestBed.createComponent(TenantCustomHomepageAdvertiseComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should start boost creation flow', () => {
    const redirectUrl: string = '/newsfeed';
    (comp as any).authRedirectService.getDefaultRedirectUrl.and.returnValue(
      redirectUrl
    );

    comp.startBoostCreationFlow();
    expect((comp as any).router.navigate).toHaveBeenCalledOnceWith(
      ['/register'],
      {
        queryParams: {
          redirectUrl: encodeURI(redirectUrl + '?createBoost=1'),
        },
      }
    );
  });

  it('should get the title', () => {
    expect((comp as any).getTitle()).toBe('Advertise with Tenant');
  });

  it('should get the description when sitename ends in `s`', () => {
    (comp as any).siteName = 'Minds';
    expect((comp as any).getDescription()).toBe(
      "Reach a wider audience with Minds' social network and website. Increase your leads and visibility by serving ads seamlessly on our network."
    );
  });

  it('should get the description when sitename does not end in `s`', () => {
    (comp as any).siteName = 'Tenant';
    expect((comp as any).getDescription()).toBe(
      "Reach a wider audience with Tenant's social network and website. Increase your leads and visibility by serving ads seamlessly on our network."
    );
  });
});
