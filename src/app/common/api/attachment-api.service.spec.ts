import { TestBed } from '@angular/core/testing';
import { AttachmentApiService } from './attachment-api.service';
import { ApiService } from './api.service';
import { ToasterService } from '../services/toaster.service';
import { PlusUpgradeModalService } from '../../modules/wire/v2/plus-upgrade-modal.service';
import { of } from 'rxjs';
import { MockService } from '../../utils/mock';
import { HttpClient } from '@angular/common/http';
import { PermissionsService } from '../services/permissions.service';
import { PermissionIntentsService } from '../services/permission-intents.service';
import { IS_TENANT_NETWORK } from '../injection-tokens/tenant-injection-tokens';

describe('AttachmentApiService', () => {
  let service: AttachmentApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AttachmentApiService,
        { provide: ApiService, useValue: MockService(ApiService) },
        { provide: HttpClient, useValue: MockService(HttpClient) },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        {
          provide: PermissionIntentsService,
          useValue: MockService(PermissionIntentsService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: PlusUpgradeModalService,
          useValue: MockService(PlusUpgradeModalService),
        },
        { provide: IS_TENANT_NETWORK, useValue: false },
      ],
    });

    service = TestBed.inject(AttachmentApiService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('upload', () => {
    it('should call to upload', () => {
      const file = new File(['test'], 'test.txt');
      const metadata = { test: 'test' };
      (service as any).api.upload.and.returnValue(of({}));

      (service as any).uploadToApi(file, metadata);

      expect((service as any).api.upload).toHaveBeenCalledWith(
        'api/v1/media',
        { file, ...metadata },
        { upload: true }
      );
    });
  });

  describe('remove', () => {
    it('should call to remove', () => {
      const guid: string = '123';
      (service as any).api.delete.and.returnValue(of(true));

      service.remove(guid);

      expect((service as any).api.delete).toHaveBeenCalledWith(
        `api/v1/media/${guid}`
      );
    });
  });

  describe('handleNoAudioPermissions', () => {
    it('should show warning and open plus modal for non-tenants', (done: DoneFn) => {
      (service as any).isTenantNetwork = false;
      (service as any).plusUpgradeModalService.open.and.returnValue(
        Promise.resolve()
      );

      (service as any).handleNoAudioPermissions().subscribe({
        error: (error) => {
          expect(error.message).toBe(
            'Your user role does not allow uploading audio.'
          );
          expect((service as any).toasterService.warn).toHaveBeenCalledWith(
            'Only Plus members can upload audio.'
          );
          expect(
            (service as any).plusUpgradeModalService.open
          ).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should only show warning for tenants', (done: DoneFn) => {
      (service as any).isTenantNetwork = true;

      (service as any).handleNoAudioPermissions().subscribe({
        error: (error) => {
          expect(error.message).toBe(
            'Your user role does not allow uploading audio.'
          );
          expect((service as any).toasterService.warn).toHaveBeenCalledWith(
            'Your user role does not allow uploading audio.'
          );
          expect(
            (service as any).plusUpgradeModalService.open
          ).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
