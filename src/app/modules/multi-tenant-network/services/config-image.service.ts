import { Injectable } from '@angular/core';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

export type ConfigImageType = 'square_logo' | 'horizontal_logo' | 'favicon';

/**
 * Service for uploading multi-tenant config images.
 */
@Injectable({ providedIn: 'root' })
export class MultiTenantConfigImageService {
  constructor(private api: ApiService) {}

  /**
   * Upload a file to the config image upload endpoint/
   * @param { File } file - file to upload.
   * @param { ConfigImageType } type - type of image to upload.
   * @returns { Observable<HttpEvent<ApiResponse>> } api request to subscribe to.
   */
  public upload(
    file: File,
    type: ConfigImageType
  ): Observable<HttpEvent<ApiResponse>> {
    return this.api.upload(
      'api/v3/multi-tenant/configs/image/upload',
      {
        file: file,
        type: type,
      },
      {
        upload: true,
      }
    );
  }

  /**
   * Validates the mime type of the file is that of an image.
   * @param { File } file - file to validate.
   * @returns { boolean } - true if file is an image.
   */
  public validateFileType(file: File): boolean {
    return file?.type?.startsWith('image/');
  }
}
