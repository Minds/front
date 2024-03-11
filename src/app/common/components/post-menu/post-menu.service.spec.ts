import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import { ModalService } from '../../../services/ux/modal.service';
import { BlockListService } from '../../../common/services/block-list.service';
import { DialogService } from '../../../common/services/confirm-leave-dialog.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { EmbedServiceV2 } from '../../../services/embedV2.service';
import { SubscriptionService } from '../../../common/services/subscription.service';
import { PostMenuService } from '../../../common/components/post-menu/post-menu.service';
import { MockService } from '../../../utils/mock';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { ActivityService } from '../../services/activity.service';
import { BoostModalV2LazyService } from '../../../modules/boost/modal-v2/boost-modal-v2-lazy.service';
import { ModerationActionGqlService } from '../../../modules/admin/moderation/services/moderation-action-gql.service';
import { IS_TENANT_NETWORK } from '../../injection-tokens/tenant-injection-tokens';

describe('PostMenuService', () => {
  let service: PostMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PostMenuService,
        { provide: Session, useValue: MockService(Session) },
        { provide: Client, useValue: MockService(Client) },
        { provide: ModalService, useValue: MockService(ModalService) },
        { provide: AuthModalService, useValue: MockService(AuthModalService) },
        { provide: BlockListService, useValue: MockService(BlockListService) },
        { provide: ActivityService, useValue: MockService(ActivityService) },
        { provide: DialogService, useValue: MockService(DialogService) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: EmbedServiceV2, useValue: MockService(EmbedServiceV2) },
        {
          provide: SubscriptionService,
          useValue: MockService(SubscriptionService),
        },
        {
          provide: BoostModalV2LazyService,
          useValue: MockService(BoostModalV2LazyService),
        },
        {
          provide: ModerationActionGqlService,
          useValue: MockService(ModerationActionGqlService),
        },
        {
          provide: IS_TENANT_NETWORK,
          useValue: true,
        },
      ],
    });

    service = TestBed.inject(PostMenuService);
    Object.defineProperty(service, 'isTenantNetwork', { writable: true });
    (service as any).isBanned$.next(false);

    spyOn(console, 'error'); // mute errors.

    service.entity = {
      guid: '123',
      allow_comments: false,
    };
    (service as any).activityService.toggleAllowComments.and.returnValue(
      Promise.resolve(true)
    );
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle to allow comments', fakeAsync(() => {
    (service as any).activityService.toggleAllowComments.and.returnValue(
      Promise.resolve(true)
    );
    service.entity = {
      guid: '123',
      allow_comments: false,
    };

    service.allowComments(true);
    tick();

    expect(service.entity.allow_comments).toBe(true);
    expect(
      (service as any).activityService.toggleAllowComments
    ).toHaveBeenCalledOnceWith({ guid: '123', allow_comments: true }, true);
  }));

  it('should toggle to disable comments', fakeAsync(() => {
    (service as any).activityService.toggleAllowComments.and.returnValue(
      Promise.resolve(false)
    );
    service.entity = {
      guid: '123',
      allow_comments: true,
    };

    service.allowComments(false);
    tick();

    expect(service.entity.allow_comments).toBe(false);
    expect(
      (service as any).activityService.toggleAllowComments
    ).toHaveBeenCalledOnceWith({ guid: '123', allow_comments: false }, false);
  }));

  describe('ban', () => {
    beforeEach(() => {
      (service as any).isBanned$.next(false);
    });

    it('should call to ban a user on a tenant network', fakeAsync(() => {
      const guid: string = '1234567890123456';
      (service as any).moderationActionGql.setUserBanState.and.returnValue(
        Promise.resolve(true)
      );
      (service as any).isTenantNetwork = true;
      (service as any).entity = {
        ownerObj: { guid: guid },
      };
      service.ban();
      tick();

      expect((service as any).isBanned$.getValue()).toBe(true);
      expect(
        (service as any).moderationActionGql.setUserBanState
      ).toHaveBeenCalledWith(guid, true);
    }));

    it('should call to ban a user on a tenant network and reset banned state when not a success', fakeAsync(() => {
      const guid: string = '1234567890123456';
      (service as any).moderationActionGql.setUserBanState.and.returnValue(
        Promise.resolve(false)
      );
      (service as any).isTenantNetwork = true;
      (service as any).entity = {
        ownerObj: { guid: guid },
      };
      service.ban();
      tick();

      expect((service as any).isBanned$.getValue()).toBe(false);
      expect(
        (service as any).moderationActionGql.setUserBanState
      ).toHaveBeenCalledWith(guid, true);
    }));

    it('should NOT call to ban a user when NOT on a tenant network', fakeAsync(() => {
      (service as any).isTenantNetwork = false;

      service.ban();
      tick();

      expect((service as any).isBanned$.getValue()).toBe(false);
      expect(
        (service as any).moderationActionGql.setUserBanState
      ).not.toHaveBeenCalled();
    }));
  });

  describe('unBan', () => {
    beforeEach(() => {
      (service as any).isBanned$.next(true);
    });

    it('should call to unban on tenant networks', fakeAsync(() => {
      const guid: string = '1234567890123456';
      (service as any).moderationActionGql.setUserBanState.and.returnValue(
        Promise.resolve(true)
      );
      (service as any).isTenantNetwork = true;
      (service as any).entity = {
        ownerObj: { guid: guid },
      };

      service.unBan();
      tick();

      expect((service as any).client.delete).not.toHaveBeenCalled();
      expect((service as any).isBanned$.getValue()).toBe(false);
      expect(
        (service as any).moderationActionGql.setUserBanState
      ).toHaveBeenCalledWith(guid, false);
    }));

    it('should call to unban on tenant networks and reset banned state on error', fakeAsync(() => {
      const guid: string = '1234567890123456';
      (service as any).moderationActionGql.setUserBanState.and.returnValue(
        Promise.resolve(false)
      );
      (service as any).isTenantNetwork = true;
      (service as any).entity = {
        ownerObj: { guid: guid },
      };

      service.unBan();
      tick();

      expect((service as any).client.delete).not.toHaveBeenCalled();
      expect((service as any).isBanned$.getValue()).toBe(true);
      expect(
        (service as any).moderationActionGql.setUserBanState
      ).toHaveBeenCalledWith(guid, false);
    }));

    it('should call to unban on non-tenant networks', fakeAsync(() => {
      const guid: string = '1234567890123456';
      (service as any).isTenantNetwork = false;
      (service as any).entity = {
        ownerObj: { guid: guid },
      };

      service.unBan();
      tick();

      expect((service as any).client.delete).toHaveBeenCalledWith(
        'api/v1/admin/ban/' + guid,
        {}
      );
      expect(
        (service as any).moderationActionGql.setUserBanState
      ).not.toHaveBeenCalled();
      expect((service as any).isBanned$.getValue()).toBe(false);
    }));

    it('should call to unban on non-tenant networks and reset banned state on error', fakeAsync(() => {
      const guid: string = '1234567890123456';
      (service as any).client.delete.and.throwError('error');
      (service as any).isTenantNetwork = false;
      (service as any).entity = {
        ownerObj: { guid: guid },
      };

      service.unBan();
      tick();

      expect((service as any).client.delete).toHaveBeenCalledWith(
        'api/v1/admin/ban/' + guid,
        {}
      );
      expect(
        (service as any).moderationActionGql.setUserBanState
      ).not.toHaveBeenCalled();
      expect((service as any).isBanned$.getValue()).toBe(true);
    }));
  });
});
