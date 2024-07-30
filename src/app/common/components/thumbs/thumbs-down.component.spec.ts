import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ToasterService } from '../../services/toaster.service';
import { ThumbsDownButton } from './thumbs-down.component';
import { MockService } from '../../../utils/mock';
import { Session } from '../../../services/session';
import { Client } from '../../api/client.service';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import userMock from '../../../mocks/responses/user.mock';
import { PermissionsService } from '../../services/permissions.service';
import { permissionsServiceMock } from '../../../../tests/permissions-service-mock.spec';
import { PermissionIntentsService } from '../../services/permission-intents.service';

describe('ThumbsDownButton', () => {
  let comp: ThumbsDownButton;
  let fixture: ComponentFixture<ThumbsDownButton>;
  let mockLocalStorage = {};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ThumbsDownButton],
      providers: [
        { provide: Session, useValue: MockService(Session) },
        { provide: Client, useValue: MockService(Client) },
        {
          provide: AuthModalService,
          useValue: MockService(AuthModalService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: PermissionsService,
          useValue: permissionsServiceMock,
        },
        {
          provide: PermissionIntentsService,
          useValue: MockService(PermissionIntentsService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbsDownButton);
    comp = fixture.componentInstance;

    (comp.object as any) = {
      guid: '123',
      type: 'activity',
      'thumbs:down:user_guids': [],
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

  it('should apply a thumbs down', fakeAsync(() => {
    (comp.object as any) = {
      guid: '123',
      type: 'activity',
      'thumbs:down:user_guids': [],
    };
    (comp as any).session.getLoggedInUser.and.returnValue(userMock);
    (comp as any).session.isLoggedIn.and.returnValue(true);
    (comp as any).client.put.and.returnValue(
      Promise.resolve({
        status: 'success',
      })
    );
    (comp as any).permissionIntents.checkAndHandleAction.and.returnValue(true);

    comp.thumb();
    tick();

    expect(
      (comp as any).permissionIntents.checkAndHandleAction
    ).toHaveBeenCalled();
    expect((comp as any).session.getLoggedInUser).toHaveBeenCalled();
    expect((comp as any).session.isLoggedIn).toHaveBeenCalled();
    expect((comp as any).client.put).toHaveBeenCalled();
    expect((comp as any).object['thumbs:down:user_guids']).toEqual([
      userMock.guid,
    ]);
  }));

  it('should NOT apply a thumbs down when a user does not have permission', fakeAsync(() => {
    (comp.object as any) = {
      guid: '123',
      type: 'activity',
      'thumbs:down:user_guids': [],
    };
    (comp as any).session.getLoggedInUser.and.returnValue(userMock);
    (comp as any).session.isLoggedIn.and.returnValue(true);
    (comp as any).client.put.and.returnValue(
      Promise.resolve({
        status: 'success',
      })
    );
    (comp as any).permissionIntents.checkAndHandleAction.and.returnValue(false);

    comp.thumb();
    tick();

    expect(
      (comp as any).permissionIntents.checkAndHandleAction
    ).toHaveBeenCalled();
    expect((comp as any).session.getLoggedInUser).toHaveBeenCalled();
    expect((comp as any).session.isLoggedIn).toHaveBeenCalled();
    expect((comp as any).client.put).not.toHaveBeenCalled();
    expect((comp as any).object['thumbs:down:user_guids']).toEqual([]);
  }));

  it('should remove a thumbs down', fakeAsync(() => {
    (comp.object as any) = {
      guid: '123',
      type: 'activity',
      'thumbs:down:user_guids': [userMock.guid],
    };
    (comp as any).session.getLoggedInUser.and.returnValue(userMock);
    (comp as any).session.isLoggedIn.and.returnValue(true);
    (comp as any).client.put.and.returnValue(
      Promise.resolve({
        status: 'success',
      })
    );
    (comp as any).permissionIntents.checkAndHandleAction.and.returnValue(true);

    comp.thumb();
    tick();

    expect(
      (comp as any).permissionIntents.checkAndHandleAction
    ).toHaveBeenCalled();
    expect((comp as any).session.getLoggedInUser).toHaveBeenCalled();
    expect((comp as any).session.isLoggedIn).toHaveBeenCalled();
    expect((comp as any).client.put).toHaveBeenCalled();
    expect((comp as any).object['thumbs:down:user_guids']).toEqual([undefined]);
  }));

  it('should NOT remove a thumbs down when a user does not have permission', fakeAsync(() => {
    (comp.object as any) = {
      guid: '123',
      type: 'activity',
      'thumbs:down:user_guids': [userMock.guid],
    };
    (comp as any).session.getLoggedInUser.and.returnValue(userMock);
    (comp as any).session.isLoggedIn.and.returnValue(true);
    (comp as any).client.put.and.returnValue(
      Promise.resolve({
        status: 'success',
      })
    );
    (comp as any).permissionIntents.checkAndHandleAction.and.returnValue(false);

    comp.thumb();
    tick();

    expect(
      (comp as any).permissionIntents.checkAndHandleAction
    ).toHaveBeenCalled();
    expect((comp as any).session.getLoggedInUser).toHaveBeenCalled();
    expect((comp as any).session.isLoggedIn).toHaveBeenCalled();
    expect((comp as any).client.put).not.toHaveBeenCalled();
    expect((comp as any).object['thumbs:down:user_guids']).toEqual([
      userMock.guid,
    ]);
  }));
});
