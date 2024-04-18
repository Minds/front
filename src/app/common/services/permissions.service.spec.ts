import { TestBed } from '@angular/core/testing';
import { ExperimentsService } from '../../modules/experiments/experiments.service';
import { ConfigsService } from './configs.service';
import { PermissionsService } from './permissions.service';
import { PermissionsEnum } from '../../../graphql/generated.engine';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let experimentsServiceSpy: jasmine.SpyObj<ExperimentsService>;
  let configsServiceSpy: jasmine.SpyObj<ConfigsService>;

  beforeEach(() => {
    const experimentsSpy = jasmine.createSpyObj('ExperimentsService', [
      'hasVariation',
    ]);
    const configsSpy = jasmine.createSpyObj('ConfigsService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ExperimentsService, useValue: experimentsSpy },
        { provide: ConfigsService, useValue: configsSpy },
        PermissionsService,
      ],
    });

    service = TestBed.inject(PermissionsService);
    experimentsServiceSpy = TestBed.inject(
      ExperimentsService
    ) as jasmine.SpyObj<ExperimentsService>;
    configsServiceSpy = TestBed.inject(
      ConfigsService
    ) as jasmine.SpyObj<ConfigsService>;
  });

  it('should disallow posting if permission is not in whitelist and experiment is enabled', () => {
    configsServiceSpy.get.and.returnValue(['CAN_COMMENT']);
    experimentsServiceSpy.hasVariation.and.returnValue(true);
    expect(service.canCreatePost()).toBe(false);
  });

  it('should allow posting if experiment is not enabled regardless of whitelist', () => {
    configsServiceSpy.get.and.returnValue([]);
    experimentsServiceSpy.hasVariation.and.returnValue(false);
    expect(service.canCreatePost()).toBe(true);
  });

  it('should allow posting if permission is not in whitelist and experiment is not enabled', () => {
    configsServiceSpy.get.and.returnValue(['CAN_COMMENT']);
    experimentsServiceSpy.hasVariation.and.returnValue(false);
    expect(service.canCreatePost()).toBe(true);
  });

  it('should determine if the user can use RSS sync', () => {
    experimentsServiceSpy.hasVariation.and.returnValue(true);
    service.setWhitelist([PermissionsEnum.CanUseRssSync]);
    expect(service.canUseRssSync()).toBe(true);
  });

  it('should determine if the user can NOT use RSS sync', () => {
    experimentsServiceSpy.hasVariation.and.returnValue(true);
    service.setWhitelist([]);
    expect(service.canUseRssSync()).toBe(false);
  });

  it('should determine if the user can create paywalled membership posts', () => {
    experimentsServiceSpy.hasVariation.and.returnValue(true);
    service.setWhitelist([PermissionsEnum.CanCreatePaywall]);
    expect(service.canCreatePaywall()).toBe(true);
  });

  it('should determine if the user can NOT create paywalled membership posts', () => {
    experimentsServiceSpy.hasVariation.and.returnValue(true);
    service.setWhitelist([]);
    expect(service.canCreatePaywall()).toBe(false);
  });
});
