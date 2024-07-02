import { Component, Inject } from '@angular/core';
import { CopyToClipboardService } from '../../../../../../../../common/services/copy-to-clipboard.service';
import { SITE_URL } from '../../../../../../../../common/injection-tokens/url-injection-tokens';
import { ToasterService } from '../../../../../../../../common/services/toaster.service';

/**
 * Network admin create boost link component.
 * Provides a link users can click to copy, that will direct users
 * into the create Boost flow.
 */
@Component({
  selector: 'm-networkAdminConsole__createBoostLink',
  styleUrls: ['./create-boost-link.component.ng.scss'],
  templateUrl: './create-boost-link.component.html',
  standalone: true,
  host: {
    '(click)': 'copyToClipboard()',
  },
})
export class NetworkAdminCreateBoostLinkComponent {
  /** Link to be displayed and copied. */
  protected readonly boostAnchorLink: string;

  constructor(
    private copyToClipboardService: CopyToClipboardService,
    private toasterService: ToasterService,
    @Inject(SITE_URL) private readonly siteUrl: string
  ) {
    this.boostAnchorLink = `${this.siteUrl}#boost`;
  }

  /**
   * Copies the boost anchor link to the clipboard.
   * @returns { void }
   */
  public copyToClipboard(): void {
    this.copyToClipboardService.copyToClipboard(this.boostAnchorLink);
    this.toasterService.success('Copied to clipboard');
  }
}
