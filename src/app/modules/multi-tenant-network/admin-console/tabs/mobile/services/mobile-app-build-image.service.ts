import { Injectable } from '@angular/core';
import {
  ApiResponse,
  ApiService,
} from '../../../../../../common/api/api.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

/** Enum of mobile app build image types. */
export enum MobileConfigImageTypeEnum {
  Icon = 'icon',
  Splash = 'splash',
  SquareLogo = 'square_logo',
  HorizontalLogo = 'horizontal_logo',
}

/** Base path for mobile app config image urls. */
export const IMAGE_URL_BASE_PATH: string =
  '/api/v3/multi-tenant/mobile-configs/image/';

/** Default path for mobile app build icon image. */
export const ICON_PATH: string = `${IMAGE_URL_BASE_PATH}icon`;

/** Default path for mobile app build splash image. */
export const SPLASH_PATH: string = `${IMAGE_URL_BASE_PATH}splash`;

/** Default path for mobile app build square logo image. */
export const SQUARE_LOGO_PATH: string = `${IMAGE_URL_BASE_PATH}square_logo`;

/** Default path for mobile app build horizontal logo image. */
export const HORIZONTAL_LOGO_PATH: string = `${IMAGE_URL_BASE_PATH}horizontal_logo`;

/**
 * Service for the management of images used in mobile app build configuration.
 */
@Injectable({ providedIn: 'root' })
export class MobileAppBuildImageService {
  constructor(private api: ApiService) {}

  /** Storing a reference to a icon file pre-upload. */
  public readonly iconFile$: BehaviorSubject<File> = new BehaviorSubject<File>(
    null
  );

  /** Storing a reference to a splash file pre-upload. */
  public readonly splashFile$: BehaviorSubject<File> = new BehaviorSubject<
    File
  >(null);

  /** Storing a reference to a square logo file pre-upload. */
  public readonly squareLogoFile$: BehaviorSubject<File> = new BehaviorSubject<
    File
  >(null);

  /** Storing a reference to a horizontal logo file pre-upload. */
  public readonly horizontalLogoFile$: BehaviorSubject<
    File
  > = new BehaviorSubject<File>(null);

  /** Observable of the icon path. */
  public readonly iconPath$: Observable<string> = this.iconFile$.pipe(
    map((file: File): string => (file ? URL.createObjectURL(file) : ICON_PATH))
  );

  /** Observable of the splash path. */
  public readonly splashPath$: Observable<string> = this.splashFile$.pipe(
    map((file: File): string =>
      file ? URL.createObjectURL(file) : SPLASH_PATH
    )
  );

  /** Observable of the square logo path. */
  public readonly squareLogoPath$: Observable<
    string
  > = this.squareLogoFile$.pipe(
    map((file: File): string =>
      file ? URL.createObjectURL(file) : SQUARE_LOGO_PATH
    )
  );

  /** Observable of the horizontal logo path. */
  public readonly horizontalLogoPath$: Observable<
    string
  > = this.horizontalLogoFile$.pipe(
    map((file: File): string =>
      file ? URL.createObjectURL(file) : HORIZONTAL_LOGO_PATH
    )
  );

  /**
   * Upload a file to the config image upload endpoint.
   * @param { File } file - file to upload.
   * @param { MobileConfigImageTypeEnum } type - type of image to upload.
   * @returns { Observable<HttpEvent<ApiResponse>> } api request to subscribe to.
   */
  public upload(
    file: File,
    type: MobileConfigImageTypeEnum
  ): Observable<HttpEvent<ApiResponse>> {
    return this.api.upload(
      `${IMAGE_URL_BASE_PATH}upload`,
      {
        file: file,
        type: type,
      },
      {
        upload: true,
      }
    );
  }
}
