import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkAdminConsoleInviteComponent } from './invite.component';
import { MultiTenantRolesService } from '../../../services/roles.service';
import { MockService } from '../../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('NetworkAdminConsoleInviteComponent', () => {
  let component: NetworkAdminConsoleInviteComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NetworkAdminConsoleInviteComponent],
      providers: [
        {
          provide: MultiTenantRolesService,
          useValue: MockService(MultiTenantRolesService),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkAdminConsoleInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
