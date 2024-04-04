import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { NetworkAdminConsoleNavigationListComponent } from './list.component';
import { MultiTenantNavigationService } from './../../services/navigation.service';
import { Session } from '../../../../../../../services/session';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import {
  NavigationItem,
  NavigationItemTypeEnum,
} from '../../../../../../../../graphql/generated.engine';

const mockAllNavigationItems: NavigationItem[] = [
  {
    id: 'channel',
    name: 'Channel',
    path: '/channel',
    visible: true,
    iconId: '',
    type: NavigationItemTypeEnum.Core,
    order: 1,
  },
  {
    id: 'newsfeed',
    name: 'Newsfeed',
    path: '/',
    visible: true,
    iconId: 'home',
    type: NavigationItemTypeEnum.Core,
    order: 2,
  },
];

class MockMultiTenantNavigationService {
  allNavigationItems$ = of(mockAllNavigationItems);
  reorderNavigationItems = jasmine.createSpy('reorderNavigationItems');
  deleteCustomNavigationItem = jasmine.createSpy('deleteCustomNavigationItem');
  upsertNavigationItem = jasmine.createSpy().and.returnValue(of(true));
}

class MockSession {
  getLoggedInUser = jasmine.createSpy('getLoggedInUser').and.returnValue({
    username: 'testuser',
    guid: '12345',
    icontime: 'icontime',
  });
}

class MockConfigsService {
  get = jasmine.createSpy('get').and.returnValue('cdn_url');
}

describe('NetworkAdminConsoleNavigationListComponent', () => {
  let component: NetworkAdminConsoleNavigationListComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleNavigationListComponent>;
  let service: MultiTenantNavigationService;
  let session: Session;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NetworkAdminConsoleNavigationListComponent],
        imports: [ReactiveFormsModule],
        providers: [
          FormBuilder,
          {
            provide: MultiTenantNavigationService,
            useClass: MockMultiTenantNavigationService,
          },
          { provide: Session, useClass: MockSession },
          { provide: ConfigsService, useClass: MockConfigsService },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(
        NetworkAdminConsoleNavigationListComponent
      );
      component = fixture.componentInstance;
      service = TestBed.inject(MultiTenantNavigationService);
      session = TestBed.inject(Session);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on component init', () => {
    expect(component.form.contains('navigationItems')).toBeTrue();
  });

  it('should process and display fetched navigation items on init', () => {
    component.ngOnInit();
    fixture.detectChanges();

    // Check if navigationItems are processed correctly
    // by checking the channel item, which requires special handling
    expect(component.navigationItems[0].name).toContain('@testuser');
    expect(component.navigationItems[1].name).toContain('Newsfeed');
  });

  it('should toggle visibility of an item', () => {
    component.navigationItems = [
      {
        id: 'test',
        visible: true,
        name: 'Test',
        path: '/test',
        iconId: 'test',
        order: 1,
        type: NavigationItemTypeEnum.Core,
      },
    ];
    component.buildFormArray();
    fixture.detectChanges();

    expect(component.navigationItems[0].visible).toBeTrue();

    component.toggleVisibility(0);
    fixture.detectChanges();

    // Check if the visibility is toggled in the component state
    expect(component.navigationItemsFormArray.at(0).value.visible).toBeFalse();

    // Check if upsertNavigationItem is called with the updated item
    expect(service.upsertNavigationItem).toHaveBeenCalledWith(
      jasmine.objectContaining({ visible: false })
    );
  });

  it('should delete a custom navigation item', () => {
    const itemToDelete = {
      id: 'test',
      visible: true,
      name: 'Test Item',
      path: '/test',
      iconId: 'test',
      order: 1,
      type: NavigationItemTypeEnum.Core,
    };
    component.deleteCustomItem(itemToDelete);

    expect(service.deleteCustomNavigationItem).toHaveBeenCalledWith(
      itemToDelete
    );
  });

  it('should update navigation items and form array upon array change, and call service to reorder items', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.navigationItems[0].name).toContain('@testuser');
    expect(component.navigationItems[1].name).toContain('Newsfeed');

    // Simulate a drag-and-drop reorder by reversing the items
    const updatedItems = component.navigationItems.reverse();

    // Call arrayChanged with the updated items
    component.arrayChanged(updatedItems);
    fixture.detectChanges();

    // Check if navigationItems array is updated
    expect(component.navigationItems).toEqual(updatedItems);

    // Verify that the form array is cleared and rebuilt
    expect(component.navigationItemsFormArray.controls.length).toEqual(
      updatedItems.length
    );
    expect(component.navigationItemsFormArray.value[0].id).toEqual(
      updatedItems[0].id
    );
    expect(component.navigationItemsFormArray.value[1].id).toEqual(
      updatedItems[1].id
    );

    // Verify that the service method to reorder items is called with the updated items
    expect(service.reorderNavigationItems).toHaveBeenCalledWith(updatedItems);
  });
});
