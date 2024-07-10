import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivityRemindButtonComponent } from './remind-button.component';
import { ComposerService } from '../../../composer/services/composer.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ActivityService } from '../activity.service';
import { Injector } from '@angular/core';
import { ComposerAudienceSelectorService } from '../../../composer/services/audience.service';
import { ComposerModalService } from '../../../composer/components/modal/modal.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Session } from '../../../../services/session';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';
import { PermissionsService } from '../../../../common/services/permissions.service';
import { PermissionIntentsService } from '../../../../common/services/permission-intents.service';
import { BehaviorSubject } from 'rxjs';
import { PermissionsEnum } from '../../../../../graphql/generated.engine';

describe('ActivityRemindButtonComponent', () => {
  let comp: ActivityRemindButtonComponent;
  let fixture: ComponentFixture<ActivityRemindButtonComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        ActivityRemindButtonComponent,
        MockComponent({
          selector: 'm-dropdownMenu',
          inputs: ['disabled', 'menu'],
          outputs: ['click'],
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'm-dropdownMenu__item',
          inputs: ['icon', 'disabled'],
        }),
      ],
      providers: [
        {
          provide: ActivityService,
          useValue: MockService(ActivityService, {
            has: ['entity$', 'userHasReminded$', 'displayOptions'],
            props: {
              entity$: {
                get: () =>
                  new BehaviorSubject<any>({
                    reminds: 0,
                    quotes: 0,
                  }),
              },
              userHasReminded$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              displayOptions: {
                get: () => ({ showInteractions: true }),
              },
            },
          }),
        },
        { provide: Injector, useValue: Injector },
        {
          provide: ComposerAudienceSelectorService,
          useValue: MockService(ComposerAudienceSelectorService),
        },
        {
          provide: ComposerModalService,
          useValue: MockService(ComposerModalService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: Session, useValue: MockService(Session) },
        { provide: AuthModalService, useValue: MockService(AuthModalService) },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        {
          provide: PermissionIntentsService,
          useValue: MockService(PermissionIntentsService),
        },
      ],
    })
      .overrideProvider(ComposerService, {
        useValue: MockService(ComposerService, {
          has: ['remind$'],
          props: {
            remind$: {
              get: () => new BehaviorSubject<any>({}),
            },
          },
        }),
      })
      .compileComponents();

    fixture = TestBed.createComponent(ActivityRemindButtonComponent);
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

  it('should set whether post actions should be hidden on init', () => {
    (comp as any).shouldHidePostActions = false;

    (comp as any).permissionIntentsService.shouldHide
      .withArgs(PermissionsEnum.CanCreatePost)
      .and.returnValue(true);
    comp.ngOnInit();
    expect((comp as any).shouldHidePostActions).toBeTrue();

    (comp as any).permissionIntentsService.shouldHide
      .withArgs(PermissionsEnum.CanCreatePost)
      .and.returnValue(false);
    comp.ngOnInit();
    expect((comp as any).shouldHidePostActions).toBeFalse();
  });

  it('should set whether remind actions should be hidden on init', () => {
    (comp as any).shouldHideRemindActions = false;

    (comp as any).permissionIntentsService.shouldHide
      .withArgs(PermissionsEnum.CanInteract)
      .and.returnValue(true);
    comp.ngOnInit();
    expect((comp as any).shouldHideRemindActions).toBeTrue();

    (comp as any).permissionIntentsService.shouldHide
      .withArgs(PermissionsEnum.CanInteract)
      .and.returnValue(false);
    comp.ngOnInit();
    expect((comp as any).shouldHideRemindActions).toBeFalse();
  });

  describe('onUndoRemind', () => {
    it('should undo remind', fakeAsync(() => {
      (comp as any).remindOptionsEnabled = true;
      (comp as any).permissionIntentsService.checkAndHandleAction
        .withArgs(PermissionsEnum.CanInteract)
        .and.returnValue(true);

      comp.onUndoRemind(null);
      tick();

      expect((comp as any).service.undoRemind).toHaveBeenCalled();
    }));

    it('should not undo remind when the user has no permission', fakeAsync(() => {
      (comp as any).remindOptionsEnabled = true;
      (comp as any).permissionIntentsService.checkAndHandleAction
        .withArgs(PermissionsEnum.CanInteract)
        .and.returnValue(false);

      comp.onUndoRemind(null);
      tick();

      expect((comp as any).service.undoRemind).not.toHaveBeenCalled();
    }));
  });

  describe('onRemindClick', () => {
    it('should handle remind click', fakeAsync(() => {
      (comp as any).session.isLoggedIn.and.returnValue(true);
      (comp as any).remindOptionsEnabled = true;
      (comp as any).permissionIntentsService.checkAndHandleAction
        .withArgs(PermissionsEnum.CanInteract)
        .and.returnValue(true);
      (comp as any).clientMeta = {
        clientMetaData: {},
        build: jasmine.createSpy('build'),
      };
      (comp as any).composerService.post.and.returnValue(Promise.resolve(true));

      (comp as any).onRemindClick(null);
      tick();

      expect((comp as any).composerService.post).toHaveBeenCalled();
    }));

    it('should NOT handle remind click when user does not have permission', fakeAsync(() => {
      (comp as any).session.isLoggedIn.and.returnValue(true);
      (comp as any).remindOptionsEnabled = true;
      (comp as any).permissionIntentsService.checkAndHandleAction
        .withArgs(PermissionsEnum.CanInteract)
        .and.returnValue(false);

      (comp as any).onRemindClick(null);
      tick();

      expect((comp as any).composerService.post).not.toHaveBeenCalled();
    }));
  });
});
