import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { CreateApiKeyModalComponent } from './create-api-key-modal.component';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { PersonalApiKeysService } from '../service/api-keys.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ApiScopeEnum,
  PersonalApiKey,
} from '../../../../../../graphql/generated.engine';
import { Session } from '../../../../../services/session';
import { IS_TENANT_NETWORK } from '../../../../../common/injection-tokens/tenant-injection-tokens';

describe('CreateApiKeyModalComponent', () => {
  let comp: CreateApiKeyModalComponent;
  let fixture: ComponentFixture<CreateApiKeyModalComponent>;
  const personalApiKeyMock: PersonalApiKey = {
    __typename: 'PersonalApiKey',
    id: '2',
    name: 'Key 2',
    scopes: [ApiScopeEnum.SiteMembershipWrite],
    secret: 'REDACTED',
    timeCreated: Date.now(),
    timeExpires: Date.now(),
  };

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [CreateApiKeyModalComponent],
    }).overrideComponent(CreateApiKeyModalComponent, {
      set: {
        imports: [
          ReactiveFormsModule,
          NgCommonModule,
          MockComponent({
            selector: 'm-modalCloseButton',
            standalone: true,
          }),
          MockComponent({
            selector: 'm-formInput__checkbox',
            template: `<ng-content></ng-content>`,
            providers: [
              {
                provide: NG_VALUE_ACCESSOR,
                useValue: {
                  writeValue: () => {},
                  registerOnChange: () => {},
                  registerOnTouched: () => {},
                },
                multi: true,
              },
            ],
            standalone: true,
          }),
          MockComponent({
            selector: 'm-button',
            inputs: ['color', 'size', 'solid'],
            template: `<ng-content></ng-content>`,
            standalone: true,
          }),
          MockComponent({
            selector: 'm-dropdownMenu',
            inputs: ['menu'],
            template: `<ng-content></ng-content>`,
            standalone: true,
          }),
        ],
        providers: [
          {
            provide: PersonalApiKeysService,
            useValue: MockService(PersonalApiKeysService),
          },
          {
            provide: Session,
            useValue: {
              isAdmin: () => {
                return true;
              },
            },
          },
          { provide: ToasterService, useValue: MockService(ToasterService) },
          { provide: IS_TENANT_NETWORK, useValue: true },
        ],
      },
    });

    fixture = TestBed.createComponent(CreateApiKeyModalComponent);
    comp = fixture.componentInstance;

    spyOn(console, 'error'); // mute error logs.
    spyOn(console, 'warn'); // mute warning logs.

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
    expect((comp as any).formGroup).toBeTruthy();
  });

  it('should set modal data', () => {
    const onCompleted = () => {};
    comp.setModalData({ onCompleted });
    expect((comp as any).onCompleted).toBe(onCompleted);
  });

  describe('onConfirmClick', () => {
    it('should create personal api key', fakeAsync(() => {
      (comp as any).onCompleted = jasmine.createSpy('onCompleted');
      (comp as any).personalApiKeysService.create.and.returnValue(
        Promise.resolve(personalApiKeyMock)
      );
      (comp as any).formGroup.setValue({
        name: 'My Api Key',
        scopes: {
          ALL: true,
          SITE_MEMBERSHIP_WRITE: false,
          OIDC_MANAGE_USERS: false,
          AUDIT_READ: false,
        },
        expireInDays: 30,
      });

      (comp as any).onConfirmClick();
      tick();

      expect((comp as any).personalApiKeysService.create).toHaveBeenCalledWith({
        name: 'My Api Key',
        scopes: [ApiScopeEnum.All],
        expireInDays: 30,
      });
      expect((comp as any).onCompleted).toHaveBeenCalledWith(
        personalApiKeyMock
      );
    }));

    it('should handle error when creating when no name is set', fakeAsync(() => {
      (comp as any).onCompleted = jasmine.createSpy('onCompleted');
      (comp as any).personalApiKeysService.create.and.returnValue(
        Promise.resolve(personalApiKeyMock)
      );
      (comp as any).formGroup.setValue({
        name: null,
        scopes: {
          ALL: true,
          SITE_MEMBERSHIP_WRITE: false,
          OIDC_MANAGE_USERS: false,
          AUDIT_READ: false,
        },
        expireInDays: 30,
      });

      (comp as any).onConfirmClick();
      tick();

      expect(
        (comp as any).personalApiKeysService.create
      ).not.toHaveBeenCalled();
      expect((comp as any).onCompleted).not.toHaveBeenCalled();
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        new Error('Name is required')
      );
    }));

    it('should handle error when creating when less than 1 day expiration is set', fakeAsync(() => {
      (comp as any).onCompleted = jasmine.createSpy('onCompleted');
      (comp as any).personalApiKeysService.create.and.returnValue(
        Promise.resolve(personalApiKeyMock)
      );
      (comp as any).formGroup.setValue({
        name: 'name',
        scopes: {
          ALL: true,
          SITE_MEMBERSHIP_WRITE: false,
          OIDC_MANAGE_USERS: false,
          AUDIT_READ: false,
        },
        expireInDays: 0,
      });

      (comp as any).onConfirmClick();
      tick();

      expect(
        (comp as any).personalApiKeysService.create
      ).not.toHaveBeenCalled();
      expect((comp as any).onCompleted).not.toHaveBeenCalled();
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        new Error('Invalid days till expiration')
      );
    }));

    it('should allow null expire time when creating personal api key', fakeAsync(() => {
      (comp as any).onCompleted = jasmine.createSpy('onCompleted');
      (comp as any).personalApiKeysService.create.and.returnValue(
        Promise.resolve(personalApiKeyMock)
      );
      (comp as any).formGroup.setValue({
        name: 'My Api Key',
        scopes: {
          ALL: false,
          SITE_MEMBERSHIP_WRITE: true,
          OIDC_MANAGE_USERS: false,
          AUDIT_READ: false,
        },
        expireInDays: null,
      });

      (comp as any).onConfirmClick();
      tick();

      expect((comp as any).personalApiKeysService.create).toHaveBeenCalledWith({
        name: 'My Api Key',
        scopes: [ApiScopeEnum.SiteMembershipWrite],
        expireInDays: null,
      });
      expect((comp as any).onCompleted).toHaveBeenCalledWith(
        personalApiKeyMock
      );
    }));

    it('should handle error when creating when no scope is set', fakeAsync(() => {
      (comp as any).onCompleted = jasmine.createSpy('onCompleted');
      (comp as any).personalApiKeysService.create.and.returnValue(
        Promise.resolve(personalApiKeyMock)
      );
      (comp as any).formGroup.setValue({
        name: 'name',
        scopes: {
          ALL: false,
          SITE_MEMBERSHIP_WRITE: false,
          OIDC_MANAGE_USERS: false,
          AUDIT_READ: false,
        },
        expireInDays: 30,
      });

      (comp as any).onConfirmClick();
      tick();

      expect(
        (comp as any).personalApiKeysService.create
      ).not.toHaveBeenCalled();
      expect((comp as any).onCompleted).not.toHaveBeenCalled();
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        new Error('At least one scope is required')
      );
    }));

    it('should ignore other scopes when all is selected when creating personal api key', fakeAsync(() => {
      (comp as any).onCompleted = jasmine.createSpy('onCompleted');
      (comp as any).personalApiKeysService.create.and.returnValue(
        Promise.resolve(personalApiKeyMock)
      );
      (comp as any).formGroup.setValue({
        name: 'My Api Key',
        scopes: {
          ALL: true,
          SITE_MEMBERSHIP_WRITE: true,
          OIDC_MANAGE_USERS: false,
          AUDIT_READ: false,
        },
        expireInDays: 30,
      });

      (comp as any).onConfirmClick();
      tick();

      expect((comp as any).personalApiKeysService.create).toHaveBeenCalledWith({
        name: 'My Api Key',
        scopes: [ApiScopeEnum.All],
        expireInDays: 30,
      });
      expect((comp as any).onCompleted).toHaveBeenCalledWith(
        personalApiKeyMock
      );
    }));

    it('should allow scopes other than ALL when creating personal api key', fakeAsync(() => {
      (comp as any).onCompleted = jasmine.createSpy('onCompleted');
      (comp as any).personalApiKeysService.create.and.returnValue(
        Promise.resolve(personalApiKeyMock)
      );
      (comp as any).formGroup.setValue({
        name: 'My Api Key',
        scopes: {
          ALL: false,
          SITE_MEMBERSHIP_WRITE: true,
          OIDC_MANAGE_USERS: false,
          AUDIT_READ: false,
        },
        expireInDays: 30,
      });

      (comp as any).onConfirmClick();
      tick();

      expect((comp as any).personalApiKeysService.create).toHaveBeenCalledWith({
        name: 'My Api Key',
        scopes: [ApiScopeEnum.SiteMembershipWrite],
        expireInDays: 30,
      });
      expect((comp as any).onCompleted).toHaveBeenCalledWith(
        personalApiKeyMock
      );
    }));
  });

  it('should update form on expiration days change', () => {
    (comp as any).onExpireTimeSelect(30);
    expect((comp as any).formGroup.get('expireInDays').value).toBe(30);

    (comp as any).onExpireTimeSelect(null);
    expect((comp as any).formGroup.get('expireInDays').value).toBe(null);

    (comp as any).onExpireTimeSelect(365);
    expect((comp as any).formGroup.get('expireInDays').value).toBe(365);
  });
});
