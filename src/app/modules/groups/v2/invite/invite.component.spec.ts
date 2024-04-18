import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GroupInviteComponent } from './invite.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { GroupInviteService } from './invite.service';
import { EntityResolverService } from '../../../../common/services/entity-resolver.service';
import { groupMock } from '../../../../mocks/responses/group.mock';

describe('GroupInviteComponent', () => {
  let component: GroupInviteComponent;
  let fixture: ComponentFixture<GroupInviteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        GroupInviteComponent,
        MockComponent({
          selector: 'm-formInput__autocompleteUserInput',
          inputs: ['id', 'formControlName', 'placeholder'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['type', 'color', 'disabled', 'saving'],
          outputs: ['onAction'],
        }),
        MockComponent({
          selector: 'm-modalCloseButton',
        }),
      ],
      providers: [
        {
          provide: EntityResolverService,
          useValue: MockService(EntityResolverService),
        },
      ],
    })
      .overrideProvider(GroupInviteService, {
        useValue: MockService(GroupInviteService),
      })
      .compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(GroupInviteComponent);
    component = fixture.componentInstance;

    component.setModalData({
      group: groupMock,
      onSave: () => void 0,
      onDismissIntent: () => void 0,
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isModerator', () => {
    it('should determine if the user is a moderator of the group', () => {
      expect(
        component.isModerator({
          ...groupMock,
          'is:owner': false,
          'is:moderator': true,
        })
      ).toBeTrue();
    });

    it('should determine if the user is the owner of the group', () => {
      expect(
        component.isModerator({
          ...groupMock,
          'is:owner': true,
          'is:moderator': false,
        })
      ).toBeTrue();
    });

    it('should determine if the user is NOT the owner or a moderator of the group', () => {
      expect(
        component.isModerator({
          ...groupMock,
          'is:owner': false,
          'is:moderator': false,
        })
      ).toBeFalse();
    });
  });
});
