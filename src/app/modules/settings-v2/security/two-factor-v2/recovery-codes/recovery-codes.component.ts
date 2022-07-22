import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { take, throttleTime } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ToasterService } from '../../../../../common/services/toaster.service';
import {
  SettingsTwoFactorV2Service,
  TwoFactorSetupPanel,
} from '../two-factor-v2.service';

/**
 * Recovery code panel - this is to get the user to backup their recovery code / seed.
 * Progress should not be continued until the user has either copied or downloaded their recovery code / seed.
 */
@Component({
  selector: 'm-twoFactor__recoveryCode',
  templateUrl: './recovery-codes.component.html',
  styleUrls: ['./recovery-codes.component.ng.scss'],
})
export class SettingsTwoFactorRecoveryCodeComponent
  extends AbstractSubscriberComponent
  implements AfterViewInit {
  // true if progress should be disabled.
  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  // Various ViewChildren used in component logic.
  @ViewChild('recoveryCode') recoveryCode: ElementRef;
  @ViewChild('copyButton') copyButton: ElementRef;
  @ViewChild('downloadButton') downloadButton: ElementRef;

  /**
   * Gets secret code from service.
   * @returns { BehaviorSubject<string> } - secret code.
   */
  get recoveryCode$(): BehaviorSubject<string> {
    return this.service.recoveryCode$;
  }

  /**
   * Get active panel from service.
   * @returns { BehaviorSubject<TwoFactorSetupPanel> } active panel from service.
   */
  get activePanel$(): BehaviorSubject<TwoFactorSetupPanel> {
    return this.service.activePanel$;
  }

  constructor(
    private service: SettingsTwoFactorV2Service,
    private toast: ToasterService
  ) {
    super();
  }

  ngAfterViewInit(): void {
    // setup event listeners for download and copy button clicks.
    this.subscriptions.push(
      fromEvent(this.copyButton.nativeElement, 'click')
        .pipe(
          // throttle request to once every 1000ms
          throttleTime(1000)
        )
        .subscribe($event => {
          this.copyToClipboard();
        }),
      fromEvent(this.downloadButton.nativeElement, 'click')
        .pipe(
          // throttle request to once every 2000ms
          throttleTime(2000)
        )
        .subscribe($event => {
          this.downloadRecoveryCode();
        })
    );
  }

  /**
   * Called on continue button click - progresses to next panel.
   * @returns { void }
   */
  public continueButtonClick(): void {
    this.service.reloadSettings();
    this.service.activePanel$.next({
      panel: 'root',
      intent: 'enabled-totp',
    });
  }

  /**
   * Copies text to clipboard.
   * @author sangram-nandkhile <based on solution from https://stackoverflow.com/a/49121680/7396007>
   * @returns { void }
   */
  private copyToClipboard(): void {
    this.subscriptions.push(
      this.recoveryCode$.pipe(take(1)).subscribe((secret: string) => {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = secret;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);

        this.toast.success('Recovery code copied');
        this.disabled$.next(false);
      })
    );
  }

  /**
   * Downloads recovery code.
   * @author hanan <based on solution from https://stackoverflow.com/a/62757333/7396007>
   * @returns { void }
   */
  private downloadRecoveryCode(): void {
    this.subscriptions.push(
      this.recoveryCode$.pipe(take(1)).subscribe((secret: string) => {
        const file = new Blob([secret], { type: 'text/plain' });

        const downloadAncher = document.createElement('a');
        downloadAncher.style.display = 'none';

        const fileURL = URL.createObjectURL(file);
        downloadAncher.href = fileURL;
        downloadAncher.download = 'private-minds-backup.txt';
        downloadAncher.click();

        this.toast.success(
          'Downloaded. Please ensure that you store the file safely.'
        );
        this.disabled$.next(false);
      })
    );
  }
}
