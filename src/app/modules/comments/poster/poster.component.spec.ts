import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { CommentPosterComponent } from './poster.component';
import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import { Router } from '@angular/router';
import { AttachmentService } from '../../../services/attachment';
import { SocketsService } from '../../../services/sockets';
import { AutocompleteSuggestionsService } from '../../suggestions/services/autocomplete-suggestions.service';
import { ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { UserAvatarService } from '../../../common/services/user-avatar.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { AuthModalService } from '../../auth/modal/auth-modal.service';
import { IsCommentingService } from './is-commenting.service';
import { PermissionsService } from '../../../common/services/permissions.service';
import { PermissionIntentsService } from '../../../common/services/permission-intents.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { NsfwEnabledService } from '../../multi-tenant-network/services/nsfw-enabled.service';
import { MockService } from '../../../utils/mock';
import { Subject } from 'rxjs';
import { PermissionsEnum } from '../../../../graphql/generated.engine';
import userMock from '../../../mocks/responses/user.mock';

describe('CommentPosterComponent', () => {
  let comp: CommentPosterComponent;
  let fixture: ComponentFixture<CommentPosterComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [CommentPosterComponent],
      providers: [
        {
          provide: Session,
          useValue: MockService(Session, {
            has: ['loggedinEmitter'],
            props: {
              loggedinEmitter: {
                get: () => new Subject<boolean>(),
              },
            },
          }),
        },
        { provide: Client, useValue: MockService(Client) },
        { provide: Router, useValue: MockService(Router) },
        { provide: SocketsService, useValue: MockService(SocketsService) },
        {
          provide: AutocompleteSuggestionsService,
          useValue: MockService(AutocompleteSuggestionsService),
        },
        { provide: Renderer2, useValue: Renderer2 },
        {
          provide: UserAvatarService,
          useValue: MockService(UserAvatarService),
        },
        { provide: ChangeDetectorRef, useValue: ChangeDetectorRef },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: AuthModalService, useValue: MockService(AuthModalService) },
        {
          provide: IsCommentingService,
          useValue: MockService(IsCommentingService),
        },
        { provide: ElementRef, useValue: MockService(ElementRef) },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        {
          provide: PermissionIntentsService,
          useValue: MockService(PermissionIntentsService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: NsfwEnabledService,
          useValue: MockService(NsfwEnabledService),
        },
      ],
    })
      .overrideProvider(AttachmentService, {
        useValue: MockService(AttachmentService),
      })
      .compileComponents();

    fixture = TestBed.createComponent(CommentPosterComponent);
    comp = fixture.componentInstance;

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

  describe('post', () => {
    it('should post a comment', fakeAsync(() => {
      (comp as any).permissionIntentsService.checkAndHandleAction
        .withArgs(PermissionsEnum.CanComment)
        .and.returnValue(true);
      (comp as any).content = 'Test comment';
      (comp as any).permissions.canComment.and.returnValue(true);
      (comp as any).attachment.exportMeta.and.returnValue({});
      (comp as any).parent = { child_path: null };
      (comp as any).clientMeta = { build: jasmine.createSpy('build') };
      (comp as any).entity = { urn: 'urn:comment:123', boosted: false };
      (comp as any).session.getLoggedInUser.and.returnValue(userMock);
      (comp as any).client.post.and.returnValue({
        comment: { guid: 123 },
      });
      (comp as any).guid = 234;

      comp.post({ preventDefault: () => {} });
      tick();

      expect((comp as any).client.post).toHaveBeenCalled();
    }));

    it('should NOT post a comment when a user does not have permission', fakeAsync(() => {
      (comp as any).permissionIntentsService.checkAndHandleAction
        .withArgs(PermissionsEnum.CanComment)
        .and.returnValue(false);
      (comp as any).content = 'Test comment';
      (comp as any).permissions.canComment.and.returnValue(true);
      (comp as any).attachment.exportMeta.and.returnValue({});
      (comp as any).parent = { child_path: null };
      (comp as any).clientMeta = { build: jasmine.createSpy('build') };
      (comp as any).entity = { urn: 'urn:comment:123', boosted: false };
      (comp as any).session.getLoggedInUser.and.returnValue(userMock);
      (comp as any).client.post.and.returnValue({
        comment: { guid: 123 },
      });
      (comp as any).guid = 234;

      comp.post({ preventDefault: () => {} });
      tick();

      expect((comp as any).client.post).not.toHaveBeenCalled();
    }));
  });

  describe('checkPermissions', () => {
    it('should check permissions and stop propagation if a user has no permission', () => {
      const event: any = {
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation'),
      };
      (comp as any).permissionIntentsService.checkAndHandleAction
        .withArgs(PermissionsEnum.CanComment)
        .and.returnValue(false);

      (comp as any).checkPermissions(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should check permissions and NOT stop propagation if a user HAS permission', () => {
      const event: any = {
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation'),
      };
      (comp as any).permissionIntentsService.checkAndHandleAction
        .withArgs(PermissionsEnum.CanComment)
        .and.returnValue(true);

      (comp as any).checkPermissions(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
    });
  });
});
