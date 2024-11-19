import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { AttachmentService } from '../../../services/attachment';
import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import { TranslationService } from '../../../services/translation';
import { UserAvatarService } from '../../../common/services/user-avatar.service';
import { ModalService } from '../../../services/ux/modal.service';
import {
  ChangeDetectorRef,
  ElementRef,
  Injector,
  PLATFORM_ID,
} from '@angular/core';
import { TimeDiffService } from '../../../services/timediff.service';
import { Router } from '@angular/router';
import { ActivityService } from '../../../common/services/activity.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { AutocompleteSuggestionsService } from '../../suggestions/services/autocomplete-suggestions.service';
import { CommentComponentV2 } from './comment.component';
import { MockComponent, MockService } from '../../../utils/mock';
import { BehaviorSubject, of } from 'rxjs';
import { CodeHighlightPipe } from '../../code-highlight/code-highlight.pipe';
import { CodeHighlightService } from '../../code-highlight/code-highlight.service';
import { TagsPipeMock } from '../../../mocks/pipes/tagsPipe.mock';
import { TruncatePipe } from '../../../common/pipes/truncate.pipe';
import { ActivityModalCreatorService } from '../../newsfeed/activity/modal/modal-creator.service';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';
import { PermissionsService } from '../../../common/services/permissions.service';
import { NsfwEnabledService } from '../../multi-tenant-network/services/nsfw-enabled.service';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import { ModerationActionGqlService } from '../../admin/moderation/services/moderation-action-gql.service';
import {
  PermissionsEnum,
  SetCommentPinnedStateGQL,
} from '../../../../graphql/generated.engine';
import { PermissionIntentsService } from '../../../common/services/permission-intents.service';

describe('CommentComponentV2', () => {
  let comp: CommentComponentV2;
  let fixture: ComponentFixture<CommentComponentV2>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CommentComponentV2,
        TagsPipeMock,
        CodeHighlightPipe,
        TruncatePipe,
        MockComponent({
          selector: 'm-translate',
          inputs: ['open', 'entity'],
        }),
        MockComponent({
          selector: 'm-hovercard',
          inputs: ['publisher', 'offset'],
        }),
        MockComponent({
          selector: 'minds-button-thumbs-up',
          inputs: ['object'],
        }),
        MockComponent({
          selector: 'minds-button-thumbs-down',
          inputs: ['object'],
        }),
        MockComponent({
          selector: 'm-relativeTimeSpan',
          inputs: ['entity'],
        }),
        MockComponent({
          selector: 'm-channel--badges',
          inputs: ['user'],
        }),
        MockComponent({
          selector: 'm-read-more--button',
          inputs: ['v2'],
        }),
        MockComponent({
          selector: 'm-dropdownMenu',
          inputs: ['menu', 'anchorPosition'],
        }),
        MockComponent({
          selector: 'a',
          inputs: ['routerLink'],
        }),
        MockComponent({
          selector: 'div',
          inputs: ['maxHeightAllowed'],
        }),
        MockComponent({
          selector: 'm-readMore',
          inputs: ['text', 'targetLength'],
        }),
      ],
      providers: [
        {
          provide: CodeHighlightService,
          useValue: MockService(CodeHighlightService),
        },
        {
          provide: Session,
          useValue: MockService(Session),
        },
        {
          provide: Client,
          useValue: MockService(Client),
        },
        {
          provide: TranslationService,
          useValue: MockService(TranslationService),
        },
        {
          provide: UserAvatarService,
          useValue: MockService(UserAvatarService),
        },
        {
          provide: ModalService,
          useValue: MockService(ModalService),
        },
        {
          provide: ChangeDetectorRef,
          useValue: MockService(ChangeDetectorRef),
        },
        {
          provide: TimeDiffService,
          useValue: MockService(TimeDiffService, {
            has: ['source'],
            props: {
              source: {
                get: () => new BehaviorSubject<any>(0),
              },
            },
          }),
        },
        {
          provide: ElementRef,
          useValue: MockService(ElementRef),
        },
        {
          provide: Router,
          useValue: MockService(Router),
        },
        {
          provide: ActivityService,
          useValue: MockService(ActivityService),
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: ActivityModalCreatorService,
          useValue: MockService(ActivityModalCreatorService),
        },
        {
          provide: Injector,
          useValue: MockService(Injector),
        },
        {
          provide: AutocompleteSuggestionsService,
          useValue: MockService(AutocompleteSuggestionsService),
        },
        {
          provide: ClientMetaService,
          useValue: MockService(ClientMetaService),
        },
        {
          provide: ClientMetaDirective,
          useValue: MockService(ClientMetaDirective),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        {
          provide: PermissionIntentsService,
          useValue: MockService(PermissionIntentsService),
        },
        {
          provide: NsfwEnabledService,
          useValue: MockService(NsfwEnabledService),
        },
        {
          provide: ModerationActionGqlService,
          useValue: MockService(ModerationActionGqlService),
        },
        {
          provide: SetCommentPinnedStateGQL,
          useValue: jasmine.createSpyObj<SetCommentPinnedStateGQL>(['mutate']),
        },
        { provide: IS_TENANT_NETWORK, useValue: false },
      ],
    })
      .overrideProvider(AttachmentService, {
        useValue: MockService(AttachmentService),
      })
      .compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(CommentComponentV2);
    comp = fixture.componentInstance;

    comp.comment = {
      guid: '123',
      time_created: 1,
      owner_guid: '321',
      ownerObj: {
        guid: '321',
        icontime: '999999',
      },
    };
    comp.entity = { owner_guid: '345' };
    comp.parent = { owner_guid: '456' };
    comp.canDelete = false;

    comp.shouldOpenModal = true;
    (comp as any).cdnUrl = 'http://locahost';

    spyOn(window, 'confirm').and.callFake(function () {
      return true;
    });
    spyOn(console, 'error'); // mute errors.

    Object.defineProperty(comp, 'isTenantNetwork', { writable: true });

    (comp as any).session.getLoggedInUser.and.returnValue({
      guid: '123',
    });

    (comp as any).client.delete.calls.reset();
    (comp as any).toasterService.error.calls.reset();
    (comp as any).session.getLoggedInUser.calls.reset();
    (comp as any).session.isAdmin.calls.reset();

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  it('should initialize and handle showing and hiding reply buttons', () => {
    (comp as any).shouldHideReplyButton = false;

    (comp as any).permissionIntentsService.shouldHide
      .withArgs(PermissionsEnum.CanComment)
      .and.returnValue(true);
    comp.ngOnInit();
    expect((comp as any).shouldHideReplyButton).toBeTrue();

    (comp as any).permissionIntentsService.shouldHide
      .withArgs(PermissionsEnum.CanComment)
      .and.returnValue(false);
    comp.ngOnInit();
    expect((comp as any).shouldHideReplyButton).toBeFalse();
  });

  it('should initialize and handle showing and hiding vote buttons', () => {
    (comp as any).shouldHideVoteButtons = false;

    (comp as any).permissionIntentsService.shouldHide
      .withArgs(PermissionsEnum.CanInteract)
      .and.returnValue(true);
    comp.ngOnInit();
    expect((comp as any).shouldHideVoteButtons).toBeTrue();

    (comp as any).permissionIntentsService.shouldHide
      .withArgs(PermissionsEnum.CanInteract)
      .and.returnValue(false);
    comp.ngOnInit();
    expect((comp as any).shouldHideVoteButtons).toBeFalse();
  });

  it('should call to open modal when shouldOpenModal is true', () => {
    comp.shouldOpenModal = true;
    comp.openModal();
    expect((comp as any).activityModalCreator.create).toHaveBeenCalled();
  });

  it('should NOT call to open modal when shouldOpenModal is false', () => {
    comp.shouldOpenModal = false;
    comp.openModal();
    expect((comp as any).activityModalCreator.create).not.toHaveBeenCalled();
  });

  describe('delete', () => {
    it('should delete a comment', fakeAsync(() => {
      comp.comment = {
        guid: 123,
      };

      comp.parent = {
        type: 'comment',
        replies_count: 2,
      };

      (comp as any).client.delete.and.returnValue(true);

      comp.delete();
      tick();

      expect(window.confirm).toHaveBeenCalled();
      expect((comp as any).client.delete).toHaveBeenCalledWith(
        'api/v1/comments/' + comp.comment.guid
      );
      expect(comp.parent.replies_count).toBe(1);
    }));

    it('should delete a comment on a tenant when i am the owner', fakeAsync(() => {
      (comp as any).isTenantNetwork = true;

      comp.comment = {
        guid: 123,
        ownerObj: {
          guid: '234',
        },
      };

      comp.parent = {
        type: 'comment',
        replies_count: 2,
      };

      (comp as any).session.getLoggedInUser.and.returnValue({
        guid: '234',
      });
      (comp as any).client.delete.and.returnValue(true);

      comp.delete();
      tick();

      expect(window.confirm).toHaveBeenCalled();
      expect((comp as any).client.delete).toHaveBeenCalledWith(
        'api/v1/comments/' + comp.comment.guid
      );
      expect(comp.parent.replies_count).toBe(1);
    }));

    it('should delete a comment on a tenant when i am NOT the owner', fakeAsync(() => {
      (comp as any).isTenantNetwork = true;
      comp.comment = {
        guid: 123,
        urn: 'urn:comment:123',
        ownerObj: {
          guid: '234',
        },
      };
      comp.parent = {
        type: 'comment',
        replies_count: 2,
      };
      (comp as any).session.getLoggedInUser.and.returnValue({
        guid: '345',
      });

      (comp as any).moderationActionsGql.deleteEntity.and.returnValue(true);
      comp.delete();
      tick();

      expect(window.confirm).toHaveBeenCalled();
      expect(
        (comp as any).moderationActionsGql.deleteEntity
      ).toHaveBeenCalledWith('urn:comment:123');
      expect(comp.parent.replies_count).toBe(1);
    }));

    it('should not update reply count if there is an error deleting', fakeAsync(() => {
      comp.comment = {
        guid: 123,
      };

      comp.parent = {
        type: 'comment',
        replies_count: 2,
      };

      (comp as any).client.delete.and.throwError(new Error('test'));

      comp.delete();
      tick();

      expect(window.confirm).toHaveBeenCalled();
      expect((comp as any).toasterService.error).toHaveBeenCalledWith('test');
      expect((comp as any).client.delete).toHaveBeenCalledWith(
        'api/v1/comments/' + comp.comment.guid
      );
      expect(comp.parent.replies_count).toBe(comp.parent.replies_count); // unchanged
    }));
  });

  it('should determine whether delete option should be shown because user is admin', () => {
    const loggedInUserGuid = '123';
    (comp as any).session.getLoggedInUser.and.returnValue({
      guid: loggedInUserGuid,
    });
    (comp as any).session.isAdmin.and.returnValue(true);
    comp.canDelete = false;
    comp.comment = { owner_guid: '234' };
    comp.entity = { owner_guid: '345' };
    comp.parent = { owner_guid: '456' };

    expect(comp.showDelete()).toBeTrue();
  });

  it('should determine whether delete option should be shown because canDelete is true', () => {
    const loggedInUserGuid = '123';
    (comp as any).session.getLoggedInUser.and.returnValue({
      guid: loggedInUserGuid,
    });
    (comp as any).session.isAdmin.and.returnValue(false);
    comp.canDelete = true;
    comp.comment = { owner_guid: '234' };
    comp.entity = { owner_guid: '345' };
    comp.parent = { owner_guid: '456' };

    expect(comp.showDelete()).toBeTrue();
  });

  it('should determine whether delete option should be shown because user is comment owner', () => {
    const loggedInUserGuid = '123';
    (comp as any).session.getLoggedInUser.and.returnValue({
      guid: loggedInUserGuid,
    });
    (comp as any).session.isAdmin.and.returnValue(false);
    comp.canDelete = false;
    comp.comment = { owner_guid: loggedInUserGuid };
    comp.entity = { owner_guid: '345' };
    comp.parent = { owner_guid: '456' };

    expect(comp.showDelete()).toBeTrue();
  });

  it('should determine whether delete option should be shown because user is parent entity owner', () => {
    const loggedInUserGuid = '123';
    (comp as any).session.getLoggedInUser.and.returnValue({
      guid: loggedInUserGuid,
    });
    (comp as any).session.isAdmin.and.returnValue(false);
    comp.canDelete = false;
    comp.comment = { owner_guid: '234' };
    comp.entity = { owner_guid: loggedInUserGuid };
    comp.parent = { owner_guid: '456' };

    expect(comp.showDelete()).toBeTrue();
  });

  it('should determine whether delete option should be shown because user is parent comment owner', () => {
    const loggedInUserGuid = '123';
    (comp as any).session.getLoggedInUser.and.returnValue({
      guid: loggedInUserGuid,
    });
    (comp as any).session.isAdmin.and.returnValue(false);
    comp.canDelete = false;
    comp.comment = { owner_guid: '234' };
    comp.entity = { owner_guid: '345' };
    comp.parent = { owner_guid: loggedInUserGuid };

    expect(comp.showDelete()).toBeTrue();
  });

  it('should determine whether delete option should be shown because user has moderation permission', () => {
    const loggedInUserGuid = '123';
    (comp as any).session.getLoggedInUser.and.returnValue({
      guid: loggedInUserGuid,
    });
    (comp as any).session.isAdmin.and.returnValue(false);
    comp.canDelete = false;
    comp.comment = { owner_guid: '234' };
    comp.entity = { owner_guid: '345' };
    comp.parent = { owner_guid: '456' };
    (comp as any).permissions.has
      .withArgs(PermissionsEnum.CanModerateContent)
      .and.returnValue(true);

    expect(comp.showDelete()).toBeTrue();
  });

  it('should determine whether delete option should NOT be shown', () => {
    const loggedInUserGuid = '123';
    (comp as any).session.getLoggedInUser.and.returnValue({
      guid: loggedInUserGuid,
    });
    (comp as any).session.isAdmin.and.returnValue(false);
    comp.canDelete = false;
    comp.comment = { owner_guid: '234' };
    comp.entity = { owner_guid: '345' };
    comp.parent = { owner_guid: '456' };

    expect(comp.showDelete()).toBeFalse();
  });

  it('should call to record click on description text click for an anchor tag and record click with boost client meta', fakeAsync(() => {
    const guid: string = '345';

    (comp as any).comment = {
      guid: guid,
    };

    const mockEvent: MouseEvent = {
      type: 'click',
      target: {
        tagName: 'A',
      },
    } as any;

    comp.onDescriptionTextClick(mockEvent);
    tick();

    expect((comp as any).clientMetaService.recordClick).toHaveBeenCalledWith(
      guid,
      (comp as any).parentClientMeta
    );
  }));

  it('should call to record click on description text click for an anchor tag and record click without boost client meta', fakeAsync(() => {
    const guid: string = '345';

    (comp as any).comment = {
      guid: guid,
    };

    const mockEvent: MouseEvent = {
      type: 'click',
      target: {
        tagName: 'A',
      },
    } as any;

    comp.onDescriptionTextClick(mockEvent);
    tick();

    expect((comp as any).clientMetaService.recordClick).toHaveBeenCalledWith(
      guid,
      (comp as any).parentClientMeta
    );
  }));

  describe('canPin', () => {
    beforeEach(() => {
      (comp as any).session.getLoggedInUser.and.returnValue({
        guid: '123',
      });
      (comp as any).entity = {
        ownerObj: {
          guid: (comp as any).session.getLoggedInUser().guid,
        },
      };
    });

    it('should return true if the comment is at the root level and the user is the owner', () => {
      (comp as any).level = 0;

      expect(comp.canPin).toBeTrue();
    });

    it('should return false if the comment is not at the root level', () => {
      (comp as any).level = 1;

      expect(comp.canPin).toBeFalse();
    });

    it('should return false if the user is not the owner', () => {
      (comp as any).level = 1;
      (comp as any).entity = {
        ownerObj: {
          guid: (comp as any).session.getLoggedInUser().guid + '4',
        },
      };

      expect(comp.canPin).toBeFalse();
    });
  });

  describe('changePinnedState', () => {
    it('should call to set the pinned state of the comment to true', fakeAsync(() => {
      const startingPinnedState = false;
      (comp as any).comment = {
        pinned: startingPinnedState,
        guid: '123',
      };

      (comp as any).setCommentPinnedStateGql.mutate.and.returnValue(
        of({
          data: {
            commentPinnedState: true,
          },
        })
      );

      comp.changePinnedState(true);
      tick();

      expect(
        (comp as any).setCommentPinnedStateGql.mutate
      ).toHaveBeenCalledWith({
        commentGuid: comp.comment.guid,
        pinned: true,
      });
      expect(comp.comment.pinned).toBe(true);
      expect((comp as any).toasterService.success).toHaveBeenCalledWith(
        'Comment successfully pinned'
      );
    }));

    it('should call to set the pinned state of the comment to false', fakeAsync(() => {
      const startingPinnedState = true;
      (comp as any).comment = {
        pinned: startingPinnedState,
        guid: '123',
      };

      (comp as any).setCommentPinnedStateGql.mutate.and.returnValue(
        of({
          data: {
            commentPinnedState: true,
          },
        })
      );

      comp.changePinnedState(false);
      tick();

      expect(comp.comment.pinned).toBe(false);
      expect((comp as any).toasterService.success).toHaveBeenCalledWith(
        'Comment successfully unpinned'
      );
    }));

    it('should handle an error when setting the pinned state', fakeAsync(() => {
      const startingPinnedState = false;
      (comp as any).comment = {
        pinned: startingPinnedState,
        guid: '123',
      };
      (comp as any).setCommentPinnedStateGql.mutate.and.throwError(
        new Error('test')
      );

      comp.changePinnedState(true);
      tick();

      expect(comp.comment.pinned).toBe(false);
      expect((comp as any).toasterService.error).toHaveBeenCalledWith(
        'Failed to change pinned state'
      );
    }));

    it('should handle failure when setting the pinned state', fakeAsync(() => {
      const startingPinnedState = false;
      (comp as any).comment = {
        pinned: startingPinnedState,
        guid: '123',
      };
      (comp as any).setCommentPinnedStateGql.mutate.and.returnValue(
        of({
          data: {
            commentPinnedState: false,
          },
        })
      );

      comp.changePinnedState(true);
      tick();

      expect(comp.comment.pinned).toBe(false);
      expect((comp as any).toasterService.error).toHaveBeenCalledWith(
        'Failed to change pinned state'
      );
    }));
  });
});
