import { Component, Inject } from '@angular/core';
import { SITE_NAME } from '../../../../../../../common/injection-tokens/common-injection-tokens';
import { Observable } from 'rxjs';
import { MobilePreviewStatusEnum } from '../../../../../../../../graphql/generated.engine';
import { MobileAppPreviewService } from '../../services/mobile-app-preview.service';

/**
 * Preview builder section. Allows a user to request an app build,
 * or see the current state of a build, including accessing the QR when ready.
 */
@Component({
  selector: 'm-networkAdminConsole__previewBuilder',
  templateUrl: './preview-builder.component.html',
  styleUrls: ['./preview-builder.component.ng.scss'],
})
export class NetworkAdminConsoleMobilePreviewBuilderComponent {
  // enum for use in template.
  public readonly MobilePreviewStatusEnum: typeof MobilePreviewStatusEnum = MobilePreviewStatusEnum;

  /** preview status from service */
  public readonly previewStatus$: Observable<MobilePreviewStatusEnum> = this
    .MobileAppPreviewService.previewStatus$;

  /** preview QR code from service */
  public readonly previewQRCode$: Observable<string> = this
    .MobileAppPreviewService.previewQRCode$;

  /** whether setting of mobile config is in progress from service. */
  public readonly setMobileConfigInProgress$: Observable<boolean> = this
    .MobileAppPreviewService.setMobileConfigInProgress$;

  constructor(
    private MobileAppPreviewService: MobileAppPreviewService,
    @Inject(SITE_NAME) public readonly siteName: string
  ) {}

  /**
   * Request a build from the service.
   * @returns { void }
   */
  public onBuildClick(): void {
    this.MobileAppPreviewService.buildPreview();
  }
}
