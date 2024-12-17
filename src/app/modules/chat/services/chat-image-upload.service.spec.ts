import { TestBed } from '@angular/core/testing';
import { ChatImageUploadService } from './chat-image-upload.service';
import { MockService } from '../../../utils/mock';
import { ApiService } from '../../../common/api/api.service';
import { of } from 'rxjs';

describe('ChatImageUploadService', () => {
  let service: ChatImageUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChatImageUploadService,
        { provide: ApiService, useValue: MockService(ApiService) },
      ],
    });
    service = TestBed.inject(ChatImageUploadService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('upload', () => {
    it('should upload an image', (done: DoneFn) => {
      const file: File = new File([''], 'test.png', { type: 'image/png' });
      const roomGuid: string = '123';

      (service as any).api.upload.and.returnValue(of({}));

      service.upload(file, roomGuid).subscribe((result) => {
        expect((service as any).api.upload).toHaveBeenCalledWith(
          `api/v3/chat/image/upload/${roomGuid}`,
          { file },
          {
            upload: true,
          }
        );
        expect(result).toBeTruthy();
        done();
      });
    });
  });
});
