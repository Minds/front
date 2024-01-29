import { TestBed } from '@angular/core/testing';
import {
  IMAGE_URL_BASE_PATH,
  MobileAppBuildImageService,
  MobileConfigImageTypeEnum,
} from './mobile-app-build-image.service';
import { MockService } from '../../../../../../utils/mock';
import {
  ApiResponse,
  ApiService,
} from '../../../../../../common/api/api.service';
import { of, take } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

describe('MobileAppBuildImageService', () => {
  let service: MobileAppBuildImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MobileAppBuildImageService,
        { provide: ApiService, useValue: MockService(ApiService) },
      ],
    });

    service = TestBed.inject(MobileAppBuildImageService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should call to upload', (done: DoneFn) => {
    const file: File = new File([''], 'test');
    const type: MobileConfigImageTypeEnum =
      MobileConfigImageTypeEnum.HorizontalLogo;
    const response: HttpEvent<ApiResponse> = {
      type: 4,
    } as HttpEvent<ApiResponse>;

    (service as any).api.upload.and.returnValue(of(response));

    service
      .upload(file, type)
      .pipe(take(1))
      .subscribe((_response: any): void => {
        expect((service as any).api.upload).toHaveBeenCalledWith(
          `${IMAGE_URL_BASE_PATH}upload`,
          {
            file: file,
            type: type,
          },
          {
            upload: true,
          }
        );
        expect(response).toEqual(_response);
        done();
      });
  });
});
