import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomNavigationItemsComponent } from './custom-navigation-items.component';
import { IS_TENANT_NETWORK } from '../../../injection-tokens/tenant-injection-tokens';
import { BehaviorSubject, of } from 'rxjs';
import { Session } from '../../../../services/session';
import { ConfigsService } from '../../../services/configs.service';
import { PermissionsService } from '../../../services/permissions.service';
import { SiteMembershipsCountService } from '../../../../modules/site-memberships/services/site-membership-count.service';
import { NavigationItemTypeEnum } from '../../../../../graphql/generated.engine';
import { ChatReceiptService } from '../../../../modules/chat/services/chat-receipt.service';
import { MockService } from '../../../../utils/mock';

describe('CustomNavigationItemsComponent', () => {
  let component: CustomNavigationItemsComponent;
  let fixture: ComponentFixture<CustomNavigationItemsComponent>;

  const mockNavigationService = jasmine.createSpyObj('NavigationService', ['']);
  const mockSession = jasmine.createSpyObj('Session', [
    'isLoggedIn',
    'isAdmin',
    'getLoggedInUser',
  ]);
  const mockConfigsService = jasmine.createSpyObj('ConfigsService', ['get']);

  const membershipsCount$ = new BehaviorSubject<number>(0); // Start with 0 memberships
  const mockSiteMembershipsCountService = {
    count$: membershipsCount$.asObservable(),
  };

  const mockPermissionsService = jasmine.createSpyObj('PermissionsService', [
    'canModerateContent',
    'canBoost',
  ]);

  const mockRawCustomNavItems = [
    {
      id: 'explore',
      name: 'Explore',
      type: NavigationItemTypeEnum.Core,
      visible: true,
      visibleMobile: true,
      iconId: 'tag',
      path: '/explore',
      url: null,
      action: null,
      order: 0,
    },
    {
      id: 'newsfeed',
      name: 'Newsfeed',
      type: NavigationItemTypeEnum.Core,
      visible: true,
      visibleMobile: true,
      iconId: 'bolt',
      path: '/newsfeed',
      url: null,
      action: null,
      order: 1,
    },
    {
      id: 'memberships',
      name: 'Memberships',
      type: NavigationItemTypeEnum.Core,
      visible: true,
      visibleMobile: true,
      iconId: 'verified',
      path: '/memberships',
      url: null,
      action: null,
      order: 2,
    },
    {
      id: 'channel',
      name: '@testUsername',
      type: NavigationItemTypeEnum.Core,
      visible: true,
      visibleMobile: true,
      iconId: '',
      path: '/testUsername',
      url: null,
      action: null,
      order: 3,
    },
    {
      id: 'admin',
      name: 'Admin',
      type: NavigationItemTypeEnum.Core,
      visible: true,
      visibleMobile: true,
      iconId: 'dashboard',
      path: '/admin',
      url: null,
      action: null,
      order: 4,
    },
    {
      id: 'groups',
      name: 'Groups1',
      type: NavigationItemTypeEnum.Core,
      visible: false,
      visibleMobile: true,
      iconId: 'group',
      path: '/groups',
      url: null,
      action: null,
      order: 5,
    },
    {
      id: 'mycustomlink1712268037372',
      name: 'My Custom Link',
      type: NavigationItemTypeEnum.CustomLink,
      visible: true,
      visibleMobile: true,
      iconId: 'waving_hand',
      path: null,
      url: 'https://www.puppies.com',
      action: null,
      order: 6,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomNavigationItemsComponent],
      providers: [
        { provide: Session, useValue: mockSession },
        { provide: ConfigsService, useValue: mockConfigsService },
        { provide: IS_TENANT_NETWORK, useValue: true },
        { provide: PermissionsService, useValue: mockPermissionsService },
        {
          provide: SiteMembershipsCountService,
          useValue: mockSiteMembershipsCountService,
        },
        {
          provide: ChatReceiptService,
          useValue: MockService(ChatReceiptService, {
            has: ['unreadCount$'],
            props: {
              unreadCount$: {
                get: () => new BehaviorSubject<number>(0),
              },
            },
          }),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomNavigationItemsComponent);
    component = fixture.componentInstance;
    component.rawCustomNavItems = mockRawCustomNavItems;
    component.hiddenCustomNavItemsIds.clear();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prepare custom navigation items for tenant networks', () => {
    expect(component.customNavItems).toBeDefined();
  });

  it('should hide memberships link when count is 0', () => {
    membershipsCount$.next(0);
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.hiddenCustomNavItemsIds.has('memberships')).toBeTrue();
  });

  it('should show memberships link when count is above zero', () => {
    membershipsCount$.next(5);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.hiddenCustomNavItemsIds.has('memberships')).toBeFalse();
  });

  describe('setHiddenCustomNavItems', () => {
    beforeEach(() => {
      component.hiddenCustomNavItemsIds.clear();
    });

    it('should add boost to hidden items when user is not logged in', () => {
      (component as any).session.isLoggedIn.and.returnValue(false);
      (component as any).permissions.canBoost.and.returnValue(true);

      component.setHiddenCustomNavItems();

      expect(component.hiddenCustomNavItemsIds.has('boost')).toBeTrue();
    });

    it('should add boost to hidden items when user cannot boost', () => {
      (component as any).session.isLoggedIn.and.returnValue(true);
      (component as any).permissions.canBoost.and.returnValue(false);

      component.setHiddenCustomNavItems();

      expect(component.hiddenCustomNavItemsIds.has('boost')).toBeTrue();
    });

    it('should NOT add boost to hidden items when user is logged in and has permission to boost', () => {
      (component as any).session.isLoggedIn.and.returnValue(true);
      (component as any).permissions.canBoost.and.returnValue(true);

      component.setHiddenCustomNavItems();

      expect(component.hiddenCustomNavItemsIds.has('boost')).toBeFalse();
    });

    it('should remove boost from hidden items when user cannot boost', () => {
      component.hiddenCustomNavItemsIds.add('boost');

      (component as any).session.isLoggedIn.and.returnValue(true);
      (component as any).permissions.canBoost.and.returnValue(true);

      component.setHiddenCustomNavItems();

      expect(component.hiddenCustomNavItemsIds.has('boost')).toBeFalse();
    });
  });
});
