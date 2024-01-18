import { Component, OnDestroy } from '@angular/core';
import { ImageInputOrientationEnum } from '../../../../components/image-uploader/image-input.component';
import {
  MobileConfigImageTypeEnum,
  MobileAppBuildImageService,
} from '../../services/mobile-app-build-image.service';
import {
  BehaviorSubject,
  NEVER,
  Observable,
  Subscription,
  catchError,
  filter,
  take,
} from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { ApiResponse } from '../../../../../../../common/api/api.service';
import { ToasterService } from '../../../../../../../common/services/toaster.service';

/**
 * Mobile asset upload section of network admin console.
 * Allows for the upload of various app configuration images.
 */
@Component({
  selector: 'm-networkAdminConsole__mobileAssets',
  templateUrl: './assets.component.html',
  styleUrls: [
    './assets.component.ng.scss',
    '../../stylesheets/network-admin-mobile.ng.scss',
  ],
})
export class NetworkAdminConsoleMobileAssetsComponent implements OnDestroy {
  // Enums for use in template.
  public readonly ImageInputOrientationEnum: typeof ImageInputOrientationEnum = ImageInputOrientationEnum;
  public readonly MobileConfigImageTypeEnum: typeof MobileConfigImageTypeEnum = MobileConfigImageTypeEnum;

  // File paths / blobs for different images.
  public readonly iconFilePath$: Observable<string> = this
    .MobileAppBuildImageService.iconPath$;
  public readonly splashFilePath$: Observable<string> = this
    .MobileAppBuildImageService.splashPath$;
  public readonly squareLogoFilePath$: Observable<string> = this
    .MobileAppBuildImageService.squareLogoPath$;
  public readonly horizontalLogoFilePath$: Observable<string> = this
    .MobileAppBuildImageService.horizontalLogoPath$;

  // in progrress variables for different files.
  public readonly splashUploadInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);
  public readonly iconUploadInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);
  public readonly squareLogoUploadInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);
  public readonly horizontalLogoUploadInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  private subscriptions: Subscription[] = [];

  constructor(
    private MobileAppBuildImageService: MobileAppBuildImageService,
    private toaster: ToasterService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void =>
      subscription?.unsubscribe()
    );
  }

  /**
   * Handle image change request.
   * @param { File } newFile - new file to upload.
   * @param { MobileConfigImageTypeEnum } imageType - type of image to upload.
   * @returns { void }
   */
  public onImageChange(
    newFile: File,
    imageType: MobileConfigImageTypeEnum
  ): void {
    const file$: BehaviorSubject<File> = this.getFileSubjectByImageType(
      imageType
    );
    const inProgress$: BehaviorSubject<boolean> = this.getInProgressSubjectByImageType(
      imageType
    );

    if (inProgress$.getValue()) {
      this.toaster.warn('Upload already in progress');
      return;
    }

    inProgress$.next(true);
    file$.next(newFile);

    this.subscriptions.push(
      this.MobileAppBuildImageService.upload(newFile, imageType)
        .pipe(
          filter(
            (response: HttpEvent<ApiResponse>): boolean => response.type === 4
          ),
          take(1),
          catchError(
            (e: any): Observable<never> => {
              console.error(e);
              file$.next(null);
              inProgress$.next(false);
              this.toaster.error(
                e?.error?.message ?? 'An unknown error has occurred'
              );
              return NEVER;
            }
          )
        )
        .subscribe((response: HttpEvent<ApiResponse>): void => {
          if (!response) return;
          inProgress$.next(false);
          this.toaster.success('Upload successful');
        })
    );
  }

  /**
   * Get the file subject for a given image type.
   * @param { MobileConfigImageTypeEnum } imageType - type of image to get file subject for.
   * @returns { BehaviorSubject<File> } - file subject for given image type.
   */
  private getFileSubjectByImageType(
    imageType: MobileConfigImageTypeEnum
  ): BehaviorSubject<File> {
    switch (imageType) {
      case MobileConfigImageTypeEnum.Icon:
        return this.MobileAppBuildImageService.iconFile$;
      case MobileConfigImageTypeEnum.Splash:
        return this.MobileAppBuildImageService.splashFile$;
      case MobileConfigImageTypeEnum.SquareLogo:
        return this.MobileAppBuildImageService.squareLogoFile$;
      case MobileConfigImageTypeEnum.HorizontalLogo:
        return this.MobileAppBuildImageService.horizontalLogoFile$;
      default:
        throw new Error(`Unsupported image type: ${imageType}`);
    }
  }

  /**
   * Get the in progress subject for a given image type.
   * @param { MobileConfigImageTypeEnum } imageType - type of image to get in progress subject for.
   * @returns { BehaviorSubject<boolean> } - in progress subject for given image type.
   */
  private getInProgressSubjectByImageType(
    imageType: MobileConfigImageTypeEnum
  ): BehaviorSubject<boolean> {
    switch (imageType) {
      case MobileConfigImageTypeEnum.Icon:
        return this.iconUploadInProgress$;
      case MobileConfigImageTypeEnum.Splash:
        return this.splashUploadInProgress$;
      case MobileConfigImageTypeEnum.SquareLogo:
        return this.squareLogoUploadInProgress$;
      case MobileConfigImageTypeEnum.HorizontalLogo:
        return this.horizontalLogoUploadInProgress$;
      default:
        throw new Error(`Unsupported image type: ${imageType}`);
    }
  }
}
