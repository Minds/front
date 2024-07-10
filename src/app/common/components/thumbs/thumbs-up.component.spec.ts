import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ToasterService } from '../../services/toaster.service';
import { ThumbsUpButton } from './thumbs-up.component';
import { MockService } from '../../../utils/mock';
import { Session } from '../../../services/session';
import { Client } from '../../api/client.service';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { ChangeDetectorRef } from '@angular/core';
import { ExperimentsService } from '../../../modules/experiments/experiments.service';
import { IsTenantService } from '../../services/is-tenant.service';
import { PermissionsService } from '../../services/permissions.service';
import { PermissionIntentsService } from '../../services/permission-intents.service';
import userMock from '../../../mocks/responses/user.mock';

describe('ThumbsUpButton', () => {
  let comp: ThumbsUpButton;
  let fixture: ComponentFixture<ThumbsUpButton>;
  let mockLocalStorage = {};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ThumbsUpButton],
      providers: [
        { provide: Session, useValue: MockService(Session) },
        { provide: Client, useValue: MockService(Client) },
        {
          provide: AuthModalService,
          useValue: MockService(AuthModalService),
        },
        {
          provide: ChangeDetectorRef,
          useValue: MockService(ChangeDetectorRef),
        },
        {
          provide: ExperimentsService,
          useValue: MockService(ExperimentsService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: IsTenantService,
          useValue: MockService(IsTenantService),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        {
          provide: PermissionIntentsService,
          useValue: MockService(PermissionIntentsService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbsUpButton);
    comp = fixture.componentInstance;
    (comp as any).canInteract = true;

    (comp.object as any) = {
      guid: '123',
      type: 'activity',
      'thumbs:up:user_guids': [],
    };

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return mockLocalStorage[key];
    });
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => {
        mockLocalStorage[key] = value;
      }
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should set canInteract on init', () => {
    (comp as any).canInteract = true;

    (comp as any).permissions.canInteract.and.returnValue(false);
    comp.ngOnInit();
    expect((comp as any).canInteract).toBeFalse();

    (comp as any).permissions.canInteract.and.returnValue(true);
    comp.ngOnInit();
    expect((comp as any).canInteract).toBeTrue();
  });

  describe('showImproveRecsToast', () => {
    it('should show improve recs toast', () => {
      (comp.object as any) = {
        type: 'activity',
      };
      mockLocalStorage['improve_recs_toast_shown'] = null;

      (comp as any).showImproveRecsToast();

      expect((comp as any).toast.success).toHaveBeenCalledWith(
        'Thank you! We use this to improve your recommendations.'
      );
      expect(localStorage.getItem).toHaveBeenCalledWith(
        'improve_recs_toast_shown'
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'improve_recs_toast_shown',
        '1'
      );
    });

    it('should NOT show improve recs toast because object is a comment', () => {
      (comp.object as any) = {
        type: 'comment',
      };
      mockLocalStorage['improve_recs_toast_shown'] = null;

      (comp as any).showImproveRecsToast();

      expect((comp as any).toast.success).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should NOT show improve recs toast because local storage item is set', () => {
      (comp.object as any) = {
        type: 'activity',
      };
      mockLocalStorage['improve_recs_toast_shown'] = '1';

      (comp as any).showImproveRecsToast();

      expect((comp as any).toast.success).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('submit', () => {
    it('should submit', async () => {
      (comp as any).session.isLoggedIn.and.returnValue(true);
      (comp as any).session.getLoggedInUser.and.returnValue(userMock);
      (comp as any).permissionIntents.checkAndHandleAction.and.returnValue(
        true
      );
      (comp as any).clientMeta = {
        build: jasmine.createSpy('build').and.returnValue(null),
      };
      (comp as any).experiments.hasVariation.and.returnValue(false);
      (comp as any).client.put.and.returnValue(Promise.resolve({}));

      await comp.submit();

      expect((comp as any).client.put).toHaveBeenCalled();
    });

    it('should not submit when user does not have permission', async () => {
      (comp as any).session.isLoggedIn.and.returnValue(true);
      (comp as any).session.getLoggedInUser.and.returnValue(userMock);
      (comp as any).permissionIntents.checkAndHandleAction.and.returnValue(
        false
      );
      (comp as any).clientMeta = {
        build: jasmine.createSpy('build').and.returnValue(null),
      };
      (comp as any).experiments.hasVariation.and.returnValue(false);
      (comp as any).client.put.and.returnValue(Promise.resolve({}));

      await comp.submit();

      expect((comp as any).client.put).not.toHaveBeenCalled();
    });
  });
});
