import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';
import { GroupsMembershipsListComponent } from './list.component';
import { GroupsMembershipsListService } from './list.service';
import { MockService } from '../../../../utils/mock';
import { Session } from '../../../../services/session';

describe('GroupsMembershipsListComponent', () => {
  let component: GroupsMembershipsListComponent;
  let fixture: ComponentFixture<GroupsMembershipsListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GroupsMembershipsListComponent],
        providers: [
          {
            provide: Session,
            useValue: MockService(Session),
          },
        ],
      })
        .overrideProvider(GroupsMembershipsListService, {
          useValue: MockService(GroupsMembershipsListService, {
            has: ['groupMembershipLevel$', 'membershipLevelGte$'],
            props: {
              groupMembershipLevel$: {
                get: () => new BehaviorSubject<any>(''),
              },
              membershipLevelGte$: { get: () => new BehaviorSubject<any>('') },
            },
          }),
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(GroupsMembershipsListComponent);
    component = fixture.componentInstance;

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
