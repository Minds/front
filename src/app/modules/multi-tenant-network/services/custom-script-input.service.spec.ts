import { TestBed } from '@angular/core/testing';
import { MultiTenantCustomScriptInputService } from './custom-script-input.service';
import { ApiService } from '../../../common/api/api.service';
import { MultiTenantNetworkConfigService } from './config.service';
import { MockService } from '../../../utils/mock';
import { of } from 'rxjs';
import * as _ from 'lodash';

describe('MultiTenantCustomScriptInputService', () => {
  let service: MultiTenantCustomScriptInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MultiTenantCustomScriptInputService,
        {
          provide: ApiService,
          useValue: MockService(ApiService),
        },
        {
          provide: MultiTenantNetworkConfigService,
          useValue: MockService(MultiTenantNetworkConfigService),
        },
      ],
    });

    service = TestBed.inject(MultiTenantCustomScriptInputService);
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  describe('updateCustomScript', () => {
    it('should update custom script successfully', async () => {
      const customScript = '<script></script>';
      (service as any).apiService.put
        .withArgs('api/v3/multi-tenant/configs/custom-script', {
          customScript: _.escape(customScript),
        })
        .and.returnValue(of({ status: 'success' }));

      const result = await service.updateCustomScript(customScript);

      expect(result).toBe(true);
      expect(
        (service as any).multiTenantNetworkConfigService.updateLocalState
      ).toHaveBeenCalledWith({
        customScript,
      });
    });

    it('should handle error response', async () => {
      const customScript = '<script></script>';
      (service as any).apiService.put
        .withArgs('api/v3/multi-tenant/configs/custom-script', {
          customScript: _.escape(customScript),
        })
        .and.returnValue(of({ status: 'error' }));

      const result = await service.updateCustomScript(customScript);

      expect(result).toBe(false);
      expect(
        (service as any).multiTenantNetworkConfigService.updateLocalState
      ).not.toHaveBeenCalled();
    });
  });
});
