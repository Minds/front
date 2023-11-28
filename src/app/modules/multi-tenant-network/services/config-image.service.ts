import { Injectable } from '@angular/core';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { Observable, map, of } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MultiTenantConfigImageRefreshService } from './config-image-refresh.service';

export type ConfigImageType = 'square_logo' | 'horizontal_logo' | 'favicon';

const CONFIG_IMAGE_BASE_PATH: string = '/api/v3/multi-tenant/configs/image/';
export const HORIZONTAL_LOGO_PATH: string = `${CONFIG_IMAGE_BASE_PATH}horizontal_logo`;
export const SQUARE_LOGO_PATH: string = `${CONFIG_IMAGE_BASE_PATH}square_logo`;
export const FAVICON_PATH: string = `${CONFIG_IMAGE_BASE_PATH}favicon`;

/**
 * Service for uploading multi-tenant config images.
 */
@Injectable({ providedIn: 'root' })
export class MultiTenantConfigImageService {
  constructor(
    private api: ApiService,
    private configImageRefreshService: MultiTenantConfigImageRefreshService
  ) {}

  /** Horizontal logo path, with cache-busting query parameter. */
  public readonly horizontalLogoPath$: Observable<
    string
  > = this.configImageRefreshService.horizontalLogoLastCacheTimestamp$.pipe(
    map((lastCacheTimestamp: number): string => {
      return Boolean(lastCacheTimestamp)
        ? `${HORIZONTAL_LOGO_PATH}?lastCache=${lastCacheTimestamp}`
        : HORIZONTAL_LOGO_PATH;
    })
  );

  /** Square logo path, with cache-busting query parameter. */
  public readonly squareLogoPath$: Observable<
    string
  > = this.configImageRefreshService.squareLogoLastCacheTimestamp$.pipe(
    map((lastCacheTimestamp: number): string => {
      return Boolean(lastCacheTimestamp)
        ? `${SQUARE_LOGO_PATH}?lastCache=${lastCacheTimestamp}`
        : SQUARE_LOGO_PATH;
    })
  );

  /** Favicon path, with cache-busting query parameter. */
  public readonly faviconPath$: Observable<
    string
  > = this.configImageRefreshService.faviconLastCacheTimestamp$.pipe(
    map((lastCacheTimestamp: number): string => {
      return Boolean(lastCacheTimestamp)
        ? `${FAVICON_PATH}?lastCache=${lastCacheTimestamp}`
        : FAVICON_PATH;
    })
  );

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
