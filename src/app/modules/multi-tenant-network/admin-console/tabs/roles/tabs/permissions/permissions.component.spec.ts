import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { NetworkAdminConsoleRolesPermissionsComponent } from './permissions.component';
import { MultiTenantRolesService } from '../../../../../services/roles.service';
import { Role } from '../../../../../../../../graphql/generated.engine';
import { MockService } from '../../../../../../../utils/mock';

describe('NetworkAdminConsoleRolesPermissionsComponent', () => {
  let component: NetworkAdminConsoleRolesPermissionsComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleRolesPermissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkAdminConsoleRolesPermissionsComponent],
      providers: [
        {
          provide: MultiTenantRolesService,
          useValue: MockService(MultiTenantRolesService, {
            has: ['allRoles$'],
            props: {
              allRoles$: { get: () => new BehaviorSubject<Role[]>([]) },
            },
          }),
        },
      ],
    });

    fixture = TestBed.createComponent(
      NetworkAdminConsoleRolesPermissionsComponent
    );
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
