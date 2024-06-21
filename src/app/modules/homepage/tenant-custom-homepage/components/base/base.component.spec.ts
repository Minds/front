import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TenantCustomHomepageBaseComponent } from './base.component';
import { SidebarNavigationService } from '../../../../../common/layout/sidebar/navigation.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { PageLayoutService } from '../../../../../common/layout/page-layout.service';
import { TopbarService } from '../../../../../common/layout/topbar.service';
import { BehaviorSubject } from 'rxjs';
import { TenantCustomHomepageService } from '../../services/tenant-custom-homepage.service';
import { ActivatedRoute } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

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
          selector: 'm-customTenantHomepage__advertise',
        }),
        MockComponent({
          selector: 'm-marketing__footer',
          inputs: ['alignLegalSection'],
        }),
      ],
      providers: [
        {
          provide: TenantCustomHomepageService,
          useValue: MockService(TenantCustomHomepageService, {
            has: ['isLoaded$'],
            props: {
              isLoaded$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
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
            has: ['isMinimalMode$'],
            props: {
              isMinimalMode$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        {
          provide: ActivatedRoute,
          useValue: MockService(ActivatedRoute, {
            has: ['snapshot'],
            props: {
              snapshot: {
                get: () => ({
                  fragment: '',
                }),
              },
            },
          }),
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
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
    expect((comp as any).topbarService.isMinimalMode$.getValue()).toBe(true);
    expect((comp as any).topbarService.toggleSearchBar).toHaveBeenCalledWith(
      false
    );
  });

  it('should destroy', () => {
    comp.ngOnDestroy();
    expect((comp as any).topbarService.isMinimalMode$.getValue()).toBe(false);
    expect((comp as any).topbarService.toggleSearchBar).toHaveBeenCalledWith(
      true
    );
    expect((comp as any).navigationService.setVisible).toHaveBeenCalledWith(
      true
    );
    expect((comp as any).pageLayoutService.cancelFullWidth).toHaveBeenCalled();
  });

  it('should handle anchor tag scroll when loaded', fakeAsync(() => {
    const scrollIntoViewSpy = spyOn(
      (comp as any).advertiseSection.nativeElement,
      'scrollIntoView'
    );
    (comp as any).route.snapshot.fragment = 'boost';
    (comp as any).tenantCustomHomepageService.isLoaded$.next(true);
    tick();

    expect(scrollIntoViewSpy).toHaveBeenCalled();
  }));

  it('should NOT handle anchor tag scroll when loaded when no fragment is set', fakeAsync(() => {
    const scrollIntoViewSpy = spyOn(
      (comp as any).advertiseSection.nativeElement,
      'scrollIntoView'
    );
    (comp as any).route.snapshot.fragment = '';
    (comp as any).tenantCustomHomepageService.isLoaded$.next(true);
    tick();

    expect(scrollIntoViewSpy).not.toHaveBeenCalled();
  }));
});
