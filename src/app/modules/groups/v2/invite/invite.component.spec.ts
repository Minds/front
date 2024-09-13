import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { GroupInviteComponent } from './invite.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { GroupInviteService } from './invite.service';
import { EntityResolverService } from '../../../../common/services/entity-resolver.service';
import { groupMock } from '../../../../mocks/responses/group.mock';
import { ToasterService } from '../../../../common/services/toaster.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';

describe('GroupInviteComponent', () => {
  let component: GroupInviteComponent;
  let fixture: ComponentFixture<GroupInviteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        GroupInviteComponent,
        MockComponent({
          selector: 'm-formInput__autocompleteEntityInput',
          inputs: [
            'id',
            'name',
            'formControlName',
            'placeholder',
            'limit',
            'entityType',
            'allowEmpty',
          ],
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
        FormBuilder,
        {
          provide: EntityResolverService,
          useValue: MockService(EntityResolverService),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
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

  describe('ngOnInit', () => {
    it('should initialize the form group', () => {
      component.ngOnInit();
      expect(component.formGroup).toBeDefined();
      expect(component.formGroup.get('user')).toBeDefined();
    });

    it('should handle string input and resolve user', fakeAsync(() => {
      const mockUser = { username: 'testuser', subscriber: true } as MindsUser;
      (component as any).entityResolverService.get$.and.returnValue(
        of(mockUser)
      );

      component.ngOnInit();
      component.formGroup.get('user').setValue('testuser');
      tick(200); // Account for debounceTime

      expect((component as any).entityResolverService.get$).toHaveBeenCalled();
      expect(component.invitee).toEqual(mockUser);
    }));

    it('should handle MindsUser input directly', fakeAsync(() => {
      const mockUser: MindsUser = {
        username: 'testuser',
        subscriber: true,
      } as MindsUser;

      component.ngOnInit();
      component.formGroup.get('user').setValue(mockUser);
      tick(200); // Account for debounceTime

      expect(
        (component as any).entityResolverService.get$
      ).not.toHaveBeenCalled();
      expect(component.invitee).toEqual(mockUser);
    }));

    it('should set invitee to null if user is falsy', fakeAsync(() => {
      component.ngOnInit();
      component.formGroup.get('user').setValue(null);
      tick(200); // Account for debounceTime

      expect(component.invitee).toBeNull();
    }));

    it('should set inProgress to false after processing', fakeAsync(() => {
      const mockUser: MindsUser = {
        username: 'testuser',
        subscriber: true,
      } as MindsUser;

      component.ngOnInit();
      component.inProgress = true;
      component.formGroup.get('user').setValue(mockUser);
      tick(200); // Account for debounceTime

      expect(component.inProgress).toBeFalse();
    }));
  });

  describe('onSubmit', () => {
    it('should not proceed if no invitee is selected', fakeAsync(() => {
      spyOn(console, 'error');
      component.invitee = null;

      component.onSubmit();
      tick();

      expect(console.error).toHaveBeenCalledWith('No invitee selected');
      expect((component as any).service.invite).not.toHaveBeenCalled();
    }));

    it('should show an error if the invitee is not a subscriber', fakeAsync(() => {
      component.invitee = {
        username: 'testuser',
        subscriber: false,
      } as MindsUser;

      component.onSubmit();
      tick();

      expect((component as any).toasterService.error).toHaveBeenCalledWith(
        'You can only invite users who are subscribed to you'
      );
      expect((component as any).service.invite).not.toHaveBeenCalled();
    }));

    it('should invite the user if they are a subscriber', fakeAsync(() => {
      const mockInvitee = {
        username: 'testuser',
        subscriber: true,
      } as MindsUser;
      component.invitee = mockInvitee;
      component.invitee = mockInvitee;
      spyOn(component.formGroup, 'reset');
      spyOn(component.formGroup.get('user'), 'setErrors');
      spyOn(component.formGroup, 'markAsPristine');
      spyOn(component['changeDetector'], 'detectChanges');

      component.onSubmit();
      tick();

      expect((component as any).service.invite).toHaveBeenCalledWith(
        mockInvitee
      );
      expect(component.invitee).toBeNull();
      expect(component.formGroup.reset).toHaveBeenCalledWith(
        { user: null },
        { emitEvent: false }
      );
      expect(component.formGroup.get('user').setErrors).toHaveBeenCalledWith(
        null
      );
      expect(component.formGroup.markAsPristine).toHaveBeenCalled();
      expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
    }));
  });
});
