// import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// import { NetworkAdminConsoleRolesPermissionsComponent } from './permissions.component';
// import { MultiTenantRolesService } from '../../../../../services/roles.service';
// import { BehaviorSubject, of } from 'rxjs';
// import {
//   PermissionsEnum,
//   Role,
// } from '../../../../../../../../graphql/generated.engine';

// fdescribe('NetworkAdminConsoleRolesPermissionsComponent', () => {
//   let component: NetworkAdminConsoleRolesPermissionsComponent;
//   let fixture: ComponentFixture<NetworkAdminConsoleRolesPermissionsComponent>;
//   let mockRolesService: jasmine.SpyObj<MultiTenantRolesService>;

//   beforeEach(() => {
//     const rolesServiceMock = {
//       allRoles$: new BehaviorSubject<Role[]>([]),
//       setRolePermission: jasmine.createSpy('setRolePermission'),
//     };

//     TestBed.configureTestingModule({
//       declarations: [NetworkAdminConsoleRolesPermissionsComponent],
//       providers: [
//         { provide: MultiTenantRolesService, useValue: rolesServiceMock },
//       ],
//     });

//     fixture = TestBed.createComponent(
//       NetworkAdminConsoleRolesPermissionsComponent
//     );
//     component = fixture.componentInstance;
//     mockRolesService = TestBed.inject(
//       MultiTenantRolesService
//     ) as jasmine.SpyObj<MultiTenantRolesService>;
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize roles on ngOnInit', () => {
//     const mockRoles: Role[] = [
//       { id: 1, name: 'Role 1', permissions: [PermissionsEnum.CanCreatePost] },
//     ];
//     spyOnProperty(mockRolesService, 'allRoles$', 'get').and.returnValue(
//       of(mockRoles)
//     );

//     component.ngOnInit();

//     expect(component.allRoles).toEqual(mockRoles);
//   });

//   it('should get permission toggle value correctly', () => {
//     const mockRoles: Role[] = [
//       { id: 1, name: 'Role 1', permissions: [PermissionsEnum.CanCreatePost] },
//     ];
//     spyOnProperty(mockRolesService, 'allRoles$', 'get').and.returnValue(
//       of(mockRoles)
//     );

//     const toggleValue = component.getPermission(
//       1,
//       PermissionsEnum.CanCreatePost
//     );

//     expect(toggleValue).toEqual('on');
//   });

//   it('should get permission toggle value as "off" when role or permission is not found', () => {
//     spyOnProperty(mockRolesService, 'allRoles$', 'get').and.returnValue(of([]));

//     const toggleValue = component.getPermission(2, PermissionsEnum.CanComment);

//     expect(toggleValue).toEqual('off');
//   });

//   it('should set permission correctly', async () => {
//     const mockRoles: Role[] = [
//       { id: 1, name: 'Role 1', permissions: [PermissionsEnum.CanCreatePost] },
//     ];
//     spyOnProperty(mockRolesService, 'allRoles$', 'get').and.returnValue(
//       of(mockRoles)
//     );

//     await component.setPermission(1, PermissionsEnum.CanCreatePost);

//     expect(mockRolesService.setRolePermission).toHaveBeenCalledWith({
//       permission: PermissionsEnum.CanCreatePost,
//       roleId: 1,
//       enabled: false,
//     });
//   });
// });
