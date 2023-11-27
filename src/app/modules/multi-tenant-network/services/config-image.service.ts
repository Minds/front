import { Injectable } from '@angular/core';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { Observable, map, of } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MultiTenantConfigImageRefreshService } from './config-image-refresh.service';

export type ConfigImageType = 'square_logo' | 'horizontal_logo' | 'favicon';

const CONFIG_IMAGE_BASE_PATH = 'api/v3/multi-tenant/configs/image/';
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

  /**
   * Gets horizontal logo path, with cache-busting query parameter.
   * @returns { Observable<string> } - observable of logo path.
   */
  public get horizontalLogoPath$(): Observable<string> {
    if (
      !this.configImageRefreshService.horizontalLogoLastCacheTimestamp$.getValue()
    ) {
      return of(HORIZONTAL_LOGO_PATH);
    }
    return this.configImageRefreshService.horizontalLogoLastCacheTimestamp$.pipe(
      map((lastCacheTimestamp: number): string => {
        return `${HORIZONTAL_LOGO_PATH}?lastCache=${lastCacheTimestamp}`;
      })
    );
  }

  /**
   * Gets square logo path, with cache-busting query parameter.
   * @returns { Observable<string> } - observable of logo path.
   */
  public get squareLogoPath$(): Observable<string> {
    if (
      !this.configImageRefreshService.squareLogoLastCacheTimestamp$.getValue()
    ) {
      return of(SQUARE_LOGO_PATH);
    }
    return this.configImageRefreshService.squareLogoLastCacheTimestamp$.pipe(
      map((lastCacheTimestamp: number): string => {
        return `${SQUARE_LOGO_PATH}?lastCache=${lastCacheTimestamp}`;
      })
    );
  }

  /**
   * Gets favicon path, with cache-busting query parameter.
   * @returns { Observable<string> } - observable of logo path.
   */
  public get faviconPath$(): Observable<string> {
    if (!this.configImageRefreshService.faviconLastCacheTimestamp$.getValue()) {
      return of(FAVICON_PATH);
    }
    return this.configImageRefreshService.faviconLastCacheTimestamp$.pipe(
      map((lastCacheTimestamp: number): string => {
        return `${FAVICON_PATH}?lastCache=${lastCacheTimestamp}`;
      })
    );
  }

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
