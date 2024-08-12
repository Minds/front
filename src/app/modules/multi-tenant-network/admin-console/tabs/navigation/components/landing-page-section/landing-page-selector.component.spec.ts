import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NetworkAdminConsoleLandingPageSelectorComponent } from './landing-page-selector.component';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import { MultiTenantNetworkConfigService } from '../../../../../services/config.service';
import { MultiTenantNavigationService } from '../../services/navigation.service';
import { SITE_URL } from '../../../../../../../common/injection-tokens/url-injection-tokens';
import { BehaviorSubject, of, take } from 'rxjs';
import {
  NavigationItem,
  NavigationItemTypeEnum,
} from '../../../../../../../../graphql/generated.engine';

export const mockNavigationItems: NavigationItem[] = [
  {
    iconId: 'home',
    id: 'newsfeed',
    name: 'Home',
    order: 0,
    path: '/newsfeed',
    type: NavigationItemTypeEnum.Core,
    visible: true,
    visibleMobile: true,
  },
  {
    iconId: 'explore',
    id: 'explore',
    name: 'Explore',
    order: 1,
    path: '/discovery',
    type: NavigationItemTypeEnum.Core,
    visible: true,
    visibleMobile: true,
  },
  {
    iconId: 'custom',
    id: 'customlink',
    name: 'Custom',
    order: 2,
    url: '/discovery',
    type: NavigationItemTypeEnum.CustomLink,
    visible: true,
    visibleMobile: true,
  },
  {
    iconId: 'custom',
    id: 'customlinkexternal',
    name: 'Custom External',
    order: 3,
    url: 'https://external.minds.com/discovery',
    type: NavigationItemTypeEnum.CustomLink,
    visible: true,
    visibleMobile: true,
  },
];

describe('NetworkAdminConsoleLandingPageSelectorComponent', () => {
  let comp: NetworkAdminConsoleLandingPageSelectorComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleLandingPageSelectorComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleLandingPageSelectorComponent,
        MockComponent({
          selector: 'm-dropdownMenu',
          inputs: ['menu'],
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'm-dropdownMenu__item',
          inputs: ['selectable', 'selected'],
          outputs: ['click'],
          template: `<ng-content></ng-content>`,
        }),
      ],
      providers: [
        {
          provide: MultiTenantNavigationService,
          useValue: MockService(MultiTenantNavigationService, {
            has: ['allNavigationItems$'],
            props: {
              allNavigationItems$: {
                get: () =>
                  new BehaviorSubject<NavigationItem[]>(mockNavigationItems),
              },
            },
          }),
        },
        {
          provide: MultiTenantNetworkConfigService,
          useValue: MockService(MultiTenantNetworkConfigService),
        },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: SITE_URL, useValue: 'https://example.minds.com/' },
      ],
    });

    fixture = TestBed.createComponent(
      NetworkAdminConsoleLandingPageSelectorComponent
    );
    comp = fixture.componentInstance;

    (comp as any).configs.get.withArgs('tenant').and.returnValue({
      logged_in_landing_page_id_web: 'newsfeed',
      logged_in_landing_page_id_mobile: 'explore',
    });

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

  it('should get web landing page items', (done: DoneFn) => {
    (comp as any).webLandingPageItems$
      .pipe(take(1))
      .subscribe((items: NavigationItem[]) => {
        expect(items).toEqual([
          mockNavigationItems[0],
          mockNavigationItems[1],
          mockNavigationItems[2],
        ]);
        done();
      });
  });

  it('should get mobile landing page items', (done: DoneFn) => {
    (comp as any).webLandingPageItems$
      .pipe(take(1))
      .subscribe((items: NavigationItem[]) => {
        expect(items).toEqual([
          mockNavigationItems[0],
          mockNavigationItems[1],
          mockNavigationItems[2],
        ]);
        done();
      });
  });

  describe('ngOnInit', () => {
    it('should set landing pages on init', fakeAsync(() => {
      (comp as any).configs.get.withArgs('tenant').and.returnValue({
        logged_in_landing_page_id_web: mockNavigationItems[1].id,
        logged_in_landing_page_id_mobile: mockNavigationItems[0].id,
      });

      comp.ngOnInit();
      tick();

      expect((comp as any).currentWebLandingPageItem$.getValue()).toEqual(
        mockNavigationItems[1]
      );
      expect((comp as any).currentMobileLandingPageItem$.getValue()).toEqual(
        mockNavigationItems[0]
      );
    }));

    it('should set landing pages on init when not configured', fakeAsync(() => {
      (comp as any).configs.get.withArgs('tenant').and.returnValue({});

      comp.ngOnInit();
      tick();

      expect((comp as any).currentWebLandingPageItem$.getValue()).toEqual(
        mockNavigationItems[0]
      );
      expect((comp as any).currentMobileLandingPageItem$.getValue()).toEqual(
        mockNavigationItems[0]
      );
    }));
  });

  describe('onWebLandingPageChange', () => {
    it('should handle web landing page change', fakeAsync(() => {
      const tenantConfigValues = {
        logged_in_landing_page_id_web: mockNavigationItems[0].id,
        logged_in_landing_page_id_mobile: mockNavigationItems[0].id,
      };
      (comp as any).configs.get
        .withArgs('tenant')
        .and.returnValue(tenantConfigValues);

      (comp as any).currentWebLandingPageItem$.next(mockNavigationItems[0]);
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      (comp as any).onWebLandingPageChange(mockNavigationItems[1]);
      tick();

      expect(
        (comp as any).multiTenantConfigService.updateConfig
      ).toHaveBeenCalledOnceWith({
        loggedInLandingPageIdWeb: mockNavigationItems[1].id,
      });
      expect((comp as any).configs.set).toHaveBeenCalledWith('tenant', {
        ...tenantConfigValues,
        logged_in_landing_page_id_web: mockNavigationItems[1].id,
      });
      expect((comp as any).toaster.success).toHaveBeenCalledOnceWith(
        'Successfully updated landing page'
      );
    }));

    it('should handle failed updating of web landing page', fakeAsync(() => {
      const tenantConfigValues = {
        logged_in_landing_page_id_web: mockNavigationItems[0].id,
        logged_in_landing_page_id_mobile: mockNavigationItems[0].id,
      };
      (comp as any).configs.get
        .withArgs('tenant')
        .and.returnValue(tenantConfigValues);

      (comp as any).currentWebLandingPageItem$.next(mockNavigationItems[0]);
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(false)
      );

      (comp as any).onWebLandingPageChange(mockNavigationItems[1]);
      tick();

      expect(
        (comp as any).multiTenantConfigService.updateConfig
      ).toHaveBeenCalledOnceWith({
        loggedInLandingPageIdWeb: mockNavigationItems[1].id,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledOnceWith(
        'Failed to update landing page'
      );
      expect((comp as any).currentWebLandingPageItem$.getValue()).toEqual(
        mockNavigationItems[0]
      );
      expect((comp as any).configs.set).not.toHaveBeenCalledWith('tenant', {
        ...tenantConfigValues,
        logged_in_landing_page_id_web: mockNavigationItems[1].id,
      });
      expect((comp as any).toaster.success).not.toHaveBeenCalledWith(
        'Successfully updated landing page'
      );
    }));
  });

  describe('onMobileLandingPageChange', () => {
    it('should handle mobile landing page change', fakeAsync(() => {
      const tenantConfigValues = {
        logged_in_landing_page_id_web: mockNavigationItems[0].id,
        logged_in_landing_page_id_mobile: mockNavigationItems[0].id,
      };
      (comp as any).configs.get
        .withArgs('tenant')
        .and.returnValue(tenantConfigValues);

      (comp as any).currentMobileLandingPageItem$.next(mockNavigationItems[0]);
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      (comp as any).onMobileLandingPageChange(mockNavigationItems[1]);
      tick();

      expect(
        (comp as any).multiTenantConfigService.updateConfig
      ).toHaveBeenCalledOnceWith({
        loggedInLandingPageIdMobile: mockNavigationItems[1].id,
      });
      expect((comp as any).configs.set).toHaveBeenCalledWith('tenant', {
        ...tenantConfigValues,
        logged_in_landing_page_id_mobile: mockNavigationItems[1].id,
      });
      expect((comp as any).toaster.success).toHaveBeenCalledOnceWith(
        'Successfully updated landing page'
      );
    }));

    it('should handle failed updating of mobile landing page', fakeAsync(() => {
      const tenantConfigValues = {
        logged_in_landing_page_id_web: mockNavigationItems[0].id,
        logged_in_landing_page_id_mobile: mockNavigationItems[0].id,
      };
      (comp as any).configs.get
        .withArgs('tenant')
        .and.returnValue(tenantConfigValues);

      (comp as any).currentMobileLandingPageItem$.next(mockNavigationItems[0]);
      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(false)
      );

      (comp as any).onMobileLandingPageChange(mockNavigationItems[1]);
      tick();

      expect(
        (comp as any).multiTenantConfigService.updateConfig
      ).toHaveBeenCalledOnceWith({
        loggedInLandingPageIdMobile: mockNavigationItems[1].id,
      });
      expect((comp as any).toaster.error).toHaveBeenCalledOnceWith(
        'Failed to update landing page'
      );
      expect((comp as any).currentMobileLandingPageItem$.getValue()).toEqual(
        mockNavigationItems[0]
      );
      expect((comp as any).configs.set).not.toHaveBeenCalledWith('tenant', {
        ...tenantConfigValues,
        logged_in_landing_page_id_mobile: mockNavigationItems[1].id,
      });
      expect((comp as any).toaster.success).not.toHaveBeenCalledWith(
        'Successfully updated landing page'
      );
    }));
  });

  describe('isInternalCustomNavigationItem', () => {
    it('should return true for internal custom navigation item with full internal url', () => {
      expect(
        (comp as any).isInternalCustomNavigationItem({
          type: NavigationItemTypeEnum.CustomLink,
          url: 'https://example.minds.com/discovery',
        })
      ).toBe(true);
    });

    it('should return true for internal custom navigation item with path', () => {
      expect(
        (comp as any).isInternalCustomNavigationItem({
          type: NavigationItemTypeEnum.CustomLink,
          url: '/discovery',
        })
      ).toBe(true);
    });

    it('should return false for an external url', () => {
      expect(
        (comp as any).isInternalCustomNavigationItem({
          type: NavigationItemTypeEnum.CustomLink,
          url: 'https://external.minds.com/discovery',
        })
      ).toBe(false);
    });

    it('should return false for a Core navigation item', () => {
      expect(
        (comp as any).isInternalCustomNavigationItem({
          type: NavigationItemTypeEnum.Core,
          url: '/discovery',
        })
      ).toBe(false);
    });
  });
});
