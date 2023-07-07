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
      ],
    });

    service = TestBed.inject(PostMenuService);

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
});
