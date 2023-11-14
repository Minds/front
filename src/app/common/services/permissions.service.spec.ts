import { TestBed } from '@angular/core/testing';
import { ExperimentsService } from '../../modules/experiments/experiments.service';
import { ConfigsService } from './configs.service';
import { PermissionsService, Permission } from './permissions.service';

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
    configsServiceSpy = TestBed.inject(ConfigsService) as jasmine.SpyObj<
      ConfigsService
    >;
  });

  it('should disallow posting if permission is not in whitelist and experiment is enabled', () => {
    configsServiceSpy.get.and.returnValue(['CAN_COMMENT']);
    experimentsServiceSpy.hasVariation.and.returnValue(true);
    expect(service.canPost()).toBe(false);
  });

  it('should allow posting if experiment is not enabled regardless of whitelist', () => {
    configsServiceSpy.get.and.returnValue([]);
    experimentsServiceSpy.hasVariation.and.returnValue(false);
    expect(service.canPost()).toBe(true);
  });

  it('should allow posting if permission is not in whitelist and experiment is not enabled', () => {
    configsServiceSpy.get.and.returnValue(['CAN_COMMENT']);
    experimentsServiceSpy.hasVariation.and.returnValue(false);
    expect(service.canPost()).toBe(true);
  });
});
