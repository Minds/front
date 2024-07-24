import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NetworkAdminConsoleRolesUsersComponent } from './users.component';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { Session } from '../../../../../../../services/session';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import {
  GetUsersByRoleGQL,
  Role,
  UserRoleEdge,
} from '../../../../../../../../graphql/generated.engine';
import { AssignRolesModalService } from './assign-roles-modal/assign-roles-modal.service';
import { MultiTenantRolesService } from '../../../../../services/roles.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('NetworkAdminConsoleRolesUsersComponent', () => {
  let comp: NetworkAdminConsoleRolesUsersComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleRolesUsersComponent>;

  const rolesMock: Role[] = [
    { name: 'OWNER', id: 0, permissions: [] },
    { name: 'ADMIN', id: 1, permissions: [] },
    { name: 'MODERATOR', id: 2, permissions: [] },
    { name: 'VERIFIED', id: 3, permissions: [] },
    { name: 'DEFAULT', id: 4, permissions: [] },
  ];

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        NetworkAdminConsoleRolesUsersComponent,
        MockComponent({
          selector: 'm-dropdownSelector',
          inputs: ['filter', 'inlineLabel'],
          outputs: ['selectionMade'],
        }),
        MockComponent({
          selector: 'm-hovercard',
          inputs: ['publisher', 'offset'],
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['iconOnly', 'title'],
          outputs: ['onAction'],
        }),
        MockComponent({
          selector: 'infinite-scroll',
          inputs: ['moreData', 'inProgress', 'hideManual'],
          outputs: ['load'],
        }),
      ],
      providers: [
        {
          provide: MultiTenantRolesService,
          useValue: MockService(MultiTenantRolesService, {
            has: ['allRoles$'],
            props: {
              allRoles$: { get: () => new BehaviorSubject<Role[]>(rolesMock) },
            },
          }),
        },
        {
          provide: AssignRolesModalService,
          useValue: MockService(AssignRolesModalService, {
            has: ['updatedUserWithRoles$'],
            props: {
              updatedUserWithRoles$: {
                get: () => new BehaviorSubject<UserRoleEdge>(null),
              },
            },
          }),
        },
        {
          provide: GetUsersByRoleGQL,
          useValue: jasmine.createSpyObj<GetUsersByRoleGQL>(['watch']),
        },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: Session, useValue: MockService(Session) },
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleRolesUsersComponent);
    comp = fixture.componentInstance;

    (comp as any).getUsersByRoleGQL.watch.and.returnValue({
      valueChanges: new Subject<any[]>(),
      refetch: jasmine.createSpy('refetch'),
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

  it('should refect on search term change', fakeAsync(() => {
    const searchTerm: string = 'searchTerm';
    (comp as any).searchTerm$.next(searchTerm);
    tick(500);

    expect((comp as any).getUsersByRoleQuery.refetch).toHaveBeenCalledWith({
      username: searchTerm,
    });

    const searchTerm2: string = '';
    (comp as any).searchTerm$.next(searchTerm2);
    tick(500);

    expect((comp as any).getUsersByRoleQuery.refetch).toHaveBeenCalledWith({
      username: searchTerm2,
    });
  }));
});
