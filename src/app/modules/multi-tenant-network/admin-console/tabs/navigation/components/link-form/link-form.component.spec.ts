import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MultiTenantNavigationService } from '../../services/navigation.service';
import { ModalService } from '../../../../../../../services/ux/modal.service';
import { DialogService } from '../../../../../../../common/services/confirm-leave-dialog.service';
import { BehaviorSubject, of } from 'rxjs';
import {
  NavigationLinkFormView,
  NetworkAdminConsoleNavigationLinkFormComponent,
} from './link-form.component';
import { By } from '@angular/platform-browser';
import { MockService } from '../../../../../../../utils/mock';
import { NavigationItemTypeEnum } from '../../../../../../../../graphql/generated.engine';
import { IconSelectorComponent } from '../../../../../../../common/standalone/icon-selector/icon-selector.component';

describe('NetworkAdminConsoleNavigationLinkFormComponent', () => {
  let component: NetworkAdminConsoleNavigationLinkFormComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleNavigationLinkFormComponent>;

  @Component({
    template: '',
  })
  class DummyListComponent {}

  const mockCoreNavigationItem = {
    iconId: 'home',
    id: 'home',
    name: 'Home',
    order: 0,
    path: '/newsfeed',
    type: NavigationItemTypeEnum.Core,
    visible: true,
    visibleMobile: true,
  };

  const mockCustomNavigationItem = {
    iconId: 'pets',
    id: 'mycustomlink1712268037372',
    name: 'My Custom Link',
    order: 1,
    url: 'https://www.pets.com',
    type: NavigationItemTypeEnum.CustomLink,
    visible: true,
  };

  class MockModalRef {
    result = Promise.resolve(true);
    dismiss = jasmine.createSpy('dismiss');
    close = jasmine.createSpy('close');
  }

  const mockModalService = {
    present: jasmine.createSpy('present').and.returnValue({
      dismiss: jasmine.createSpy('dismiss'),
      componentInstance: {
        onConfirm: jasmine.createSpy('onConfirm').and.callFake((iconId) => {
          component.linkForm.get('iconId').setValue(iconId);
        }),
      },
    }),
  };

  const mockDialogService = {
    confirm: jasmine.createSpy('confirm').and.returnValue(of(true)),
  };

  const mockNavigationService = {
    allNavigationItems$: of([mockCoreNavigationItem, mockCustomNavigationItem]),
    savingNavigationItem$: new BehaviorSubject<boolean>(false),
    upsertNavigationItem: jasmine
      .createSpy('upsertNavigationItem')
      .and.returnValue(of(true)),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleNavigationLinkFormComponent,
        DummyListComponent,
      ],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        FormBuilder,
        {
          provide: ModalService,
          useValue: mockModalService,
        },
        {
          provide: DialogService,
          useValue: mockDialogService,
        },
        {
          provide: MultiTenantNavigationService,
          useValue: mockNavigationService,
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
        {
          provide: ActivatedRoute,
          useValue: MockService(ActivatedRoute, {
            has: ['queryParams'],
            props: {
              queryParams: {
                get: () => new BehaviorSubject<Params>({}),
              },
            },
          }),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      NetworkAdminConsoleNavigationLinkFormComponent
    );
    component = fixture.componentInstance;
    component.linkForm.reset();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.linkForm.valid).toBeFalsy();
  });

  it('should have form error when no name input', () => {
    let name = component.linkForm.controls['name'];
    expect(name.valid).toBeFalsy();

    name.setValue('');
    expect(name.hasError('required')).toBeTruthy();
  });

  it('should have form error when no icon selected', () => {
    let iconId = component.linkForm.controls['iconId'];
    expect(iconId.valid).toBeFalsy();

    iconId.setValue('');
    expect(iconId.hasError('required')).toBeTruthy();
  });

  it('should navigate to list on successful submit', fakeAsync(() => {
    component.linkForm.controls['name'].setValue('Test Name');
    component.linkForm.controls['iconId'].setValue('test-icon');
    component.linkForm.controls['pathOrUrl'].setValue('http://test.com');
    component.onSubmit();
    tick();
    expect((component as any).router.navigate).toHaveBeenCalledWith([
      '/network/admin/navigation/menu/list',
    ]);
  }));

  it('should invoke confirmation dialog on unsaved changes before navigating away', fakeAsync(() => {
    component.linkForm.markAsDirty();
    component.canDeactivate();
    tick();
    expect(mockDialogService.confirm).toHaveBeenCalled();
    flush();
  }));

  it('should navigate back to the list view on back button click', () => {
    spyOn(component, 'navigateToListView').and.callThrough();
    fixture.debugElement
      .query(By.css(`[data-ref=m-networkAdminNavigationEditForm__headerIcon]`))
      .nativeElement.click();
    fixture.detectChanges();
    expect((component as any).navigateToListView).toHaveBeenCalled();
  });

  it('should set view for creating a new custom link if no ID is provided', () => {
    component.navigationItem = null;
    component.setFormView();
    fixture.detectChanges();
    expect(component.view).toEqual(NavigationLinkFormView.CreateCustomLink);
  });

  it('should set view for editing a core link when ID provided matches a core link', () => {
    component.navigationItem = mockCoreNavigationItem;
    component.itemType = NavigationItemTypeEnum.Core;

    component.setFormView();
    fixture.detectChanges();
    expect(component.view).toEqual(NavigationLinkFormView.EditCoreLink);
  });

  it('should set view for editing a custom link when ID provided matches a custom link', () => {
    component.navigationItem = mockCoreNavigationItem;
    component.itemType = NavigationItemTypeEnum.Core;

    component.setFormView();
    fixture.detectChanges();
    expect(component.view).toEqual(NavigationLinkFormView.EditCoreLink);
  });

  it('should open the icon selector modal and update form on icon selection', fakeAsync(() => {
    spyOn(component, 'openIconSelectorModal').and.callThrough();
    mockModalService.present.calls.reset();
    component.openIconSelectorModal();
    tick();
    expect(mockModalService.present).toHaveBeenCalledWith(
      IconSelectorComponent,
      jasmine.any(Object)
    );

    const testIconId = 'test-icon-id';
    mockModalService.present.calls
      .mostRecent()
      .args[1].data.onConfirm(testIconId);
    expect(component.linkForm.get('iconId').value).toEqual(testIconId);
  }));

  describe('Form display logic for link types', () => {
    it('should display correct header for creating a new CUSTOM link', () => {
      component.view = NavigationLinkFormView.CreateCustomLink;
      fixture.detectChanges();
      const headerTitle = fixture.debugElement.query(
        By.css(`[data-ref=m-networkAdminNavigationEditForm__headerTitle]`)
      ).nativeElement;
      expect(headerTitle.textContent).toContain('Create custom link');
    });

    it('should display correct header for editing a CUSTOM link', () => {
      component.view = NavigationLinkFormView.EditCustomLink;
      fixture.detectChanges();
      const headerTitle = fixture.debugElement.query(
        By.css(`[data-ref=m-networkAdminNavigationEditForm__headerTitle]`)
      ).nativeElement;
      expect(headerTitle.textContent).toContain('Edit custom link');
    });

    it('should display correct header for editing a CORE link', () => {
      component.view = NavigationLinkFormView.EditCoreLink;
      fixture.detectChanges();
      const headerTitle = fixture.debugElement.query(
        By.css(`[data-ref=m-networkAdminNavigationEditForm__headerTitle]`)
      ).nativeElement;
      expect(headerTitle.textContent).toContain('Edit core link');
    });
  });

  it('should disable save button when form is invalid', () => {
    component.linkForm.controls['name'].setValue('');
    fixture.detectChanges();
    const saveButton = fixture.debugElement.query(
      By.css(`[data-ref=m-networkAdminNavigationEditForm__saveButton]`)
    ).nativeElement;
    expect(saveButton.disabled).toBeTrue();
  });

  it('should enable save button when form is valid', () => {
    component.linkForm.controls['name'].setValue('Valid Name');
    component.linkForm.controls['iconId'].setValue('valid-icon');
    component.linkForm.controls['pathOrUrl'].setValue('https://valid.url');
    fixture.detectChanges();
    const saveButton = fixture.debugElement.query(
      By.css(`[data-ref=m-networkAdminNavigationEditForm__saveButton]`)
    ).nativeElement;
    expect(saveButton.disabled).toBeFalse();
  });
});
