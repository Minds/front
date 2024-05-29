import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoostAds } from './ads';
import { MockService } from '../../utils/mock';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { BoostModalV2LazyService } from '../boost/modal-v2/boost-modal-v2-lazy.service';
import { ConfigsService } from '../../common/services/configs.service';
import { PLATFORM_ID } from '@angular/core';
import { ClientMetaDirective } from '../../common/directives/client-meta.directive';
import { IS_TENANT_NETWORK } from '../../common/injection-tokens/tenant-injection-tokens';
import userMock from '../../mocks/responses/user.mock';

describe('BoostAds', () => {
  let comp: BoostAds;
  let fixture: ComponentFixture<BoostAds>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [BoostAds],
      providers: [
        { provide: Client, useValue: MockService(Client) },
        { provide: Session, useValue: MockService(Session) },
        {
          provide: BoostModalV2LazyService,
          useValue: MockService(BoostModalV2LazyService),
        },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: ClientMetaDirective,
          useValue: MockService(ClientMetaDirective),
        },
        { provide: IS_TENANT_NETWORK, useValue: true },
      ],
    });

    fixture = TestBed.createComponent(BoostAds);
    comp = fixture.componentInstance;

    (comp as any).session.getLoggedInUser.and.returnValue(userMock);
    (comp as any).configs.get
      .withArgs('tenant')
      .and.returnValue({ boost_enabled: true });
    (comp as any).parentClientMeta.build.and.returnValue({
      served_by_guid: userMock.guid,
      source: 'newsfeed',
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

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('isBoostEnabled', () => {
    it('should set boost to enabled on non-tenants', () => {
      (comp as any).configs.get.calls.reset();
      Object.defineProperty(comp, 'isTenantNetwork', {
        writable: true,
        value: false,
      });

      comp.ngOnInit();

      expect((comp as any).configs.get).not.toHaveBeenCalled();
      expect((comp as any).isBoostEnabled).toBeTrue();
    });

    it('should set boost to enabled on tenants when boost_enabled is true', () => {
      (comp as any).configs.get.calls.reset();
      (comp as any).configs.get
        .withArgs('tenant')
        .and.returnValue({ boost_enabled: true });

      Object.defineProperty(comp, 'isTenantNetwork', {
        writable: true,
        value: true,
      });

      comp.ngOnInit();

      expect((comp as any).configs.get).toHaveBeenCalledOnceWith('tenant');
      expect((comp as any).isBoostEnabled).toBeTrue();
    });

    it('should set boost to NOT be enabled on tenants when boost_enabled is false', () => {
      (comp as any).configs.get.calls.reset();
      (comp as any).configs.get
        .withArgs('tenant')
        .and.returnValue({ boost_enabled: false });

      Object.defineProperty(comp, 'isTenantNetwork', {
        writable: true,
        value: true,
      });

      comp.ngOnInit();

      expect((comp as any).configs.get).toHaveBeenCalledOnceWith('tenant');
      expect((comp as any).isBoostEnabled).toBeFalse();
    });
  });
});
