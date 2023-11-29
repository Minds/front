import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminConsoleRoleIconComponent } from './role-icon.component';
import { MultiTenantRolesService } from '../../../../services/roles.service';
import { MockService } from '../../../../../../utils/mock';

describe('NetworkAdminConsoleRoleIconComponent', () => {
  let component: NetworkAdminConsoleRoleIconComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleRoleIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkAdminConsoleRoleIconComponent],
      providers: [
        {
          provide: MultiTenantRolesService,
          useValue: MockService(MultiTenantRolesService),
        },
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleRoleIconComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default scale value of 1', () => {
    expect(component.scale).toBe(1);
  });

  it('should have RoleId enum available in the template', () => {
    expect(component.RoleId).toBeDefined();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
