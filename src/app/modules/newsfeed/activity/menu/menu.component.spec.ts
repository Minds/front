import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivityMenuComponent } from './menu.component';
import { ActivityEntity, ActivityService } from '../activity.service';
import { Client } from '../../../../services/api';
import { ApiService } from '../../../../common/api/api.service';
import { Router } from '@angular/router';
import { ComposerService } from '../../../composer/services/composer.service';
import { ComposerModalService } from '../../../composer/components/modal/modal.service';
import { Injector } from '@angular/core';
import { TranslationService } from '../../../../services/translation';
import { ToasterService } from '../../../../common/services/toaster.service';
import { DownloadActivityMediaService } from '../../../../common/services/download-activity-media.service';
import { WireModalService } from '../../../wire/wire-modal.service';
import { Session } from '../../../../services/session';
import { ModerationActionGqlService } from '../../../admin/moderation/services/moderation-action-gql.service';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';
import { MockComponent, MockService } from '../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { BoostAdminActionsService } from '../../../boost/console-v2/services/admin-actions.service';

describe('ActivityMenuComponent', () => {
  let comp: ActivityMenuComponent;
  let fixture: ComponentFixture<ActivityMenuComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        ActivityMenuComponent,
        MockComponent({
          selector: 'm-postMenu--v2',
          inputs: [
            'entity',
            'canDelete',
            'isTranslatable',
            'canDownload',
            'mediaModal',
            'options',
          ],
        }),
      ],
      providers: [
        {
          provide: ActivityService,
          useValue: MockService(ActivityService, {
            has: [
              'entity$',
              'canDelete$',
              'isTranslatable$',
              'canDownload$',
              'canShow$',
            ],
            props: {
              entity$: {
                get: () =>
                  new BehaviorSubject<ActivityEntity>({
                    guid: '123',
                    url: 'http://example.minds.com',
                  } as ActivityEntity),
              },
              canDelete$: { get: () => new BehaviorSubject<boolean>(false) },
              isTranslatable$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              canDownload$: { get: () => new BehaviorSubject<boolean>(false) },
              canShow$: { get: () => new BehaviorSubject<boolean>(false) },
            },
          }),
        },
        { provide: Client, useValue: MockService(Client) },
        { provide: ApiService, useValue: MockService(ApiService) },
        { provide: Router, useValue: MockService(Router) },
        { provide: ComposerService, useValue: MockService(ComposerService) },
        {
          provide: ComposerModalService,
          useValue: MockService(ComposerModalService),
        },
        { provide: Injector, useValue: MockService(Injector) },
        {
          provide: TranslationService,
          useValue: MockService(TranslationService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: DownloadActivityMediaService,
          useValue: MockService(DownloadActivityMediaService),
        },
        { provide: WireModalService, useValue: MockService(WireModalService) },
        { provide: Session, useValue: MockService(Session) },
        {
          provide: ModerationActionGqlService,
          useValue: MockService(ModerationActionGqlService),
        },
        {
          provide: BoostAdminActionsService,
          useValue: MockService(BoostAdminActionsService),
        },
        { provide: IS_TENANT_NETWORK, useValue: IS_TENANT_NETWORK },
      ],
    });

    fixture = TestBed.createComponent(ActivityMenuComponent);
    comp = fixture.componentInstance;

    (comp as any).service.displayOptions = {};
    Object.defineProperty(comp, 'isTenantNetwork', { writable: true });

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

  describe('onOptionSelected - deleted', () => {
    it('should handle deleted option for tenant when not owner', fakeAsync(() => {
      (comp as any).isTenantNetwork = true;
      (comp as any).entity = {
        guid: '123',
        urn: 'urn:activity:123',
        ownerObj: { guid: '234' },
      } as any;
      (comp as any).session.getLoggedInUser.and.returnValue({ guid: '345' });
      (comp as any).moderationActionsGql.deleteEntity.and.returnValue(
        Promise.resolve(true)
      );

      comp.onOptionSelected('delete');
      tick();

      expect(
        (comp as any).moderationActionsGql.deleteEntity
      ).toHaveBeenCalledWith('urn:activity:123');
      expect((comp as any).service.onDelete).toHaveBeenCalled();
      expect((comp as any).client.delete).not.toHaveBeenCalled();
    }));

    it('should handle deleted option for tenant when owner', fakeAsync(() => {
      (comp as any).isTenantNetwork = true;
      (comp as any).entity = {
        guid: '123',
        urn: 'urn:activity:123',
        ownerObj: { guid: '234' },
      } as any;
      (comp as any).session.getLoggedInUser.and.returnValue({ guid: '234' });
      (comp as any).client.delete.and.returnValue(Promise.resolve(true));

      comp.onOptionSelected('delete');
      tick();

      expect(
        (comp as any).moderationActionsGql.deleteEntity
      ).not.toHaveBeenCalled();
      expect((comp as any).service.onDelete).toHaveBeenCalled();
      expect((comp as any).client.delete).toHaveBeenCalled();
    }));

    it('should handle deleted option for non-tenant', fakeAsync(() => {
      (comp as any).isTenantNetwork = false;
      (comp as any).entity = {
        guid: '123',
        urn: 'urn:activity:123',
        ownerObj: { guid: '234' },
      } as any;
      (comp as any).session.getLoggedInUser.and.returnValue({ guid: '345' });
      (comp as any).client.delete.and.returnValue(Promise.resolve(true));

      comp.onOptionSelected('delete');
      tick();

      expect(
        (comp as any).moderationActionsGql.deleteEntity
      ).not.toHaveBeenCalled();
      expect((comp as any).service.onDelete).toHaveBeenCalled();
      expect((comp as any).client.delete).toHaveBeenCalled();
    }));
  });

  describe('onOptionSelected - cancel-boost', () => {
    it('should handle cancel-boost option when successful', fakeAsync(() => {
      (comp as any).entity = { guid: '123' } as any;
      (
        comp as any
      ).boostAdminActionsService.cancelBoostsByEntityGuid.and.returnValue(
        Promise.resolve(true)
      );
      (comp as any).service.canShow$.next(true);

      comp.onOptionSelected('cancel-boost');
      tick();

      expect(
        (comp as any).boostAdminActionsService.cancelBoostsByEntityGuid
      ).toHaveBeenCalledWith('123');
      expect((comp as any).service.canShow$.getValue()).toBe(false);
      expect((comp as any).toasterService.success).toHaveBeenCalledOnceWith(
        'Boost successfully cancelled.'
      );
    }));

    it('should handle cancel-boost option when unsuccessful', fakeAsync(() => {
      (comp as any).entity = { guid: '123' } as any;
      (
        comp as any
      ).boostAdminActionsService.cancelBoostsByEntityGuid.and.returnValue(
        Promise.resolve(false)
      );
      (comp as any).service.canShow$.next(true);

      comp.onOptionSelected('cancel-boost');
      tick();

      expect(
        (comp as any).boostAdminActionsService.cancelBoostsByEntityGuid
      ).toHaveBeenCalledWith('123');
      expect((comp as any).service.canShow$.getValue()).toBe(true);
      expect((comp as any).toasterService.success).not.toHaveBeenCalled();
      expect((comp as any).toasterService.error).toHaveBeenCalledOnceWith(
        'An error occurred whilst trying to cancel this Boost.'
      );
    }));
  });
});
