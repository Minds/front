import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantCustomHomepageBaseComponent } from './base.component';
import { SidebarNavigationService } from '../../../../../common/layout/sidebar/navigation.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { PageLayoutService } from '../../../../../common/layout/page-layout.service';
import { TopbarService } from '../../../../../common/layout/topbar.service';
import { BehaviorSubject } from 'rxjs';

describe('TenantCustomHomepageBaseComponent', () => {
  let comp: TenantCustomHomepageBaseComponent;
  let fixture: ComponentFixture<TenantCustomHomepageBaseComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        TenantCustomHomepageBaseComponent,
        MockComponent({
          selector: 'm-customTenantHomepage__hero',
        }),
        MockComponent({
          selector: 'm-tenant__featuredGroupCards',
        }),
        MockComponent({
          selector: 'm-customTenantHomepage__memberships',
        }),
        MockComponent({
          selector: 'm-marketing__footer',
          inputs: ['alignLegalSection'],
        }),
      ],
      providers: [
        {
          provide: SidebarNavigationService,
          useValue: MockService(SidebarNavigationService),
        },
        {
          provide: PageLayoutService,
          useValue: MockService(PageLayoutService),
        },
        {
          provide: TopbarService,
          useValue: MockService(TopbarService, {
            has: ['isMinimalLightMode$'],
            props: {
              isMinimalLightMode$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
      ],
    });

    fixture = TestBed.createComponent(TenantCustomHomepageBaseComponent);
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
    expect((comp as any).navigationService.setVisible).toHaveBeenCalledWith(
      false
    );
    expect((comp as any).pageLayoutService.useFullWidth).toHaveBeenCalled();
    expect((comp as any).topbarService.isMinimalLightMode$.getValue()).toBe(
      true
    );
    expect((comp as any).topbarService.toggleSearchBar).toHaveBeenCalledWith(
      false
    );
  });

  it('should destroy', () => {
    comp.ngOnDestroy();
    expect((comp as any).topbarService.isMinimalLightMode$.getValue()).toBe(
      false
    );
    expect((comp as any).topbarService.toggleSearchBar).toHaveBeenCalledWith(
      true
    );
    expect((comp as any).navigationService.setVisible).toHaveBeenCalledWith(
      true
    );
    expect((comp as any).pageLayoutService.cancelFullWidth).toHaveBeenCalled();
  });
});
