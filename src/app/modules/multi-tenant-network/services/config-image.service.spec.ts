import { TestBed } from '@angular/core/testing';
import {
  ConfigImageType,
  MultiTenantConfigImageService,
} from './config-image.service';
import { ApiService } from '../../../common/api/api.service';

describe('MultiTenantConfigImageService', () => {
  let service: MultiTenantConfigImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MultiTenantConfigImageService,
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj<ApiService>(['upload']),
        },
      ],
    });

    service = TestBed.inject(MultiTenantConfigImageService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('upload', () => {
    it('should upload', () => {
      const file: File = new File(['file'], 'file.png', {
        type: 'image/png',
      });
      const type: ConfigImageType = 'square_logo';

      service.upload(file, type);

      expect((service as any).api.upload).toHaveBeenCalledWith(
        'api/v3/multi-tenant/configs/image/upload',
        {
          file: file,
          type: type,
        },
        {
          upload: true,
        }
      );
    });
  });

  describe('validateFileType', () => {
    it('should validate file type is image', () => {
      expect(
        service.validateFileType(
          new File(['file'], 'file.png', {
            type: 'image/png',
          })
        )
      ).toBeTrue();
    });

    it('should validate file type is not text', () => {
      expect(
        service.validateFileType(
          new File(['file'], 'file.png', {
            type: 'text/plain',
          })
        )
      ).toBeFalse();
    });

    it('should validate file type is not a video', () => {
      expect(
        service.validateFileType(
          new File(['file'], 'file.png', {
            type: 'video/mp4',
          })
        )
      ).toBeFalse();
    });
  });
});
