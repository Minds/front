import { TestBed } from '@angular/core/testing';
import { ConfigsService } from './configs.service';
import { PermissionsService } from './permissions.service';
import { PermissionsEnum } from '../../../graphql/generated.engine';
import { IS_TENANT_NETWORK } from '../injection-tokens/tenant-injection-tokens';
import { MockService } from '../../utils/mock';

describe('PermissionsService', () => {
  let service: PermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: IS_TENANT_NETWORK, useValue: true },
        PermissionsService,
      ],
    });

    service = TestBed.inject(PermissionsService);
  });

  it('should disallow posting if permission is not in whitelist', () => {
    (service as any).configs.get.and.returnValue(['CAN_COMMENT']);
    expect(service.canCreatePost()).toBe(false);
  });

  it('should determine if the user can use RSS sync', () => {
    service.setWhitelist([PermissionsEnum.CanUseRssSync]);
    expect(service.canUseRssSync()).toBe(true);
  });

  it('should determine if the user can NOT use RSS sync', () => {
    service.setWhitelist([]);
    expect(service.canUseRssSync()).toBe(false);
  });

  it('should determine if the user can create paywalled membership posts', () => {
    service.setWhitelist([PermissionsEnum.CanCreatePaywall]);
    expect(service.canCreatePaywall()).toBe(true);
  });

  it('should determine if the user can NOT create paywalled membership posts', () => {
    service.setWhitelist([]);
    expect(service.canCreatePaywall()).toBe(false);
  });

  describe('createChatRoom', () => {
    it('should determine if the user can create a new chat room', () => {
      service.setWhitelist([PermissionsEnum.CanCreateChatRoom]);
      expect(service.canCreateChatRoom()).toBe(true);
    });

    it('should determine if the user can NOT create a new chat room', () => {
      service.setWhitelist([]);
      expect(service.canCreateChatRoom()).toBe(false);
    });
  });

  describe('canUploadChatMedia', () => {
    it('should determine if the user can upload chat media', () => {
      service.setWhitelist([PermissionsEnum.CanUploadChatMedia]);
      expect(service.canUploadChatMedia()).toBe(true);
    });

    it('should determine if the user can NOT upload chat media', () => {
      service.setWhitelist([]);
      expect(service.canUploadChatMedia()).toBe(false);
    });
  });

  describe('canUploadAudio', () => {
    it('should determine if the user can upload audio', () => {
      service.setWhitelist([PermissionsEnum.CanUploadAudio]);
      expect(service.canUploadAudio()).toBe(true);
    });

    it('should determine if the user can NOT upload audio', () => {
      service.setWhitelist([]);
      expect(service.canUploadAudio()).toBe(false);
    });
  });

  describe('canBoost', () => {
    it('should determine if the user can boost', () => {
      (service as any).configs.get.withArgs('tenant').and.returnValue({
        boost_enabled: true,
      });
      service.setWhitelist([PermissionsEnum.CanBoost]);
      expect(service.canBoost()).toBe(true);
    });

    it('should determine if the user can NOT boost because boost is not enabled', () => {
      (service as any).configs.get.withArgs('tenant').and.returnValue({
        boost_enabled: false,
      });
      service.setWhitelist([PermissionsEnum.CanBoost]);
      expect(service.canBoost()).toBe(false);
    });

    it('should determine if the user can NOT boost because boost is not in whitelist', () => {
      (service as any).configs.get.withArgs('tenant').and.returnValue({
        boost_enabled: true,
      });
      service.setWhitelist([]);
      expect(service.canBoost()).toBe(false);
    });
  });
});
