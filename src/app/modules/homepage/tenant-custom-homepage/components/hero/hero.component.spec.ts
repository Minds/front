import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantCustomHomepageHeroComponent } from './hero.component';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { MultiTenantConfigImageService } from '../../../../multi-tenant-network/services/config-image.service';
import { TopbarAlertService } from '../../../../../common/components/topbar-alert/topbar-alert.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { BehaviorSubject } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('TenantCustomHomepageHeroComponent', () => {
  let comp: TenantCustomHomepageHeroComponent;
  let fixture: ComponentFixture<TenantCustomHomepageHeroComponent>;

  const squareLogoPath: string = 'img/square-logo.png';
  const siteName: string = 'siteName';
  const customHomepageDescription: string = 'customHomepageDescription';

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        TenantCustomHomepageHeroComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'size', 'solid', 'softSquare'],
          template: `<ng-content></ng-content>`,
        }),
      ],
      providers: [
        {
          provide: MultiTenantConfigImageService,
          useValue: MockService(MultiTenantConfigImageService, {
            has: ['squareLogoPath$'],
            props: {
              squareLogoPath$: {
                get: () => new BehaviorSubject<string>(squareLogoPath),
              },
            },
          }),
        },
        {
          provide: TopbarAlertService,
          useValue: MockService(TopbarAlertService, {
            has: ['shouldShow$'],
            props: {
              shouldShow$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        {
          provide: ConfigsService,
          useValue: {
            get: jasmine
              .createSpy('get')
              .withArgs('site_name')
              .and.returnValue(siteName)
              .withArgs('tenant')
              .and.returnValue({
                custom_home_page_description: customHomepageDescription,
              }),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(TenantCustomHomepageHeroComponent);
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

  it('should get correct attributes for logo', () => {
    const mainLogo: DebugElement = fixture.debugElement.query(
      By.css('.m-tenantCustomHomepage__mainLogo')
    );
    expect(mainLogo.nativeElement.src).toContain(squareLogoPath);
    expect(mainLogo.nativeElement.alt).toBe(siteName + ' main logo');
  });

  it('should render the site name', () => {
    expect(
      fixture.debugElement.query(By.css('.m-tenantCustomHomepage__title'))
        .nativeElement.textContent
    ).toBe(siteName);
  });

  it('should render the site description', () => {
    expect(
      fixture.debugElement.query(By.css('.m-tenantCustomHomepage__description'))
        .nativeElement.textContent
    ).toContain(customHomepageDescription);
  });

  it('should have button text', () => {
    expect(
      fixture.debugElement.query(By.css('m-button')).nativeElement.textContent
    ).toBe('Join the network');
  });
});
