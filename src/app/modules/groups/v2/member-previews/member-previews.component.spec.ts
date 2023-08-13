import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMemberPreviewsComponent } from './member-previews.component';
import { GroupService } from '../group.service';
import { MockService } from '../../../../utils/mock';
import { ApiService } from '../../../../common/api/api.service';
import { Session } from '../../../../services/session';
import { ConfigsService } from '../../../../common/services/configs.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';

describe('GroupMemberPreviewsComponent', () => {
  let component: GroupMemberPreviewsComponent;
  let fixture: ComponentFixture<GroupMemberPreviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupMemberPreviewsComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: GroupService,
          useValue: MockService(GroupService, {
            has: ['group$', 'memberCount$'],
            props: {
              group$: {
                get: () => new BehaviorSubject<any>(null),
              },
              memberCount$: {
                get: () => new BehaviorSubject<number>(1),
              },
            },
          }),
        },
        { provide: ApiService, useValue: MockService(ApiService) },
        { provide: Session, useValue: MockService(Session) },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupMemberPreviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
