import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  Observable,
  switchMap,
  take,
} from 'rxjs';
import { MobileAppPreviewService } from '../../services/mobile-app-preview.service';
import { GenericToggleValue } from '../../../../../../../common/components/toggle/toggle.component';
import { GrowShrinkFast } from '../../../../../../../animations';
import { ToasterService } from '../../../../../../../common/services/toaster.service';

/**
 * App tracking message component - allows enabling and setting an Apple ATT message.
 */
@Component({
  selector: 'm-networkAdminConsole__appTrackingMessage',
  templateUrl: './app-tracking-message.component.html',
  styleUrls: ['./app-tracking-message.component.ng.scss'],
  animations: [GrowShrinkFast],
})
export class NetworkAdminConsoleMobileAppTrackingMessageComponent
  implements OnInit
{
  /** Enabled toggle state. */
  public enabledToggleState: GenericToggleValue = 'on';

  /** Message. */
  public readonly message$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  /** Whether a call to set mobile config is in progress. */
  public readonly setMobileConfigInProgress$: Observable<boolean> =
    this.mobileAppPreviewService.setMobileConfigInProgress$.pipe(
      distinctUntilChanged()
    );

  constructor(
    private mobileAppPreviewService: MobileAppPreviewService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.mobileAppPreviewService.initInProgress$
      .pipe(
        // Wait for init to complete
        filter((inProgress: boolean): boolean => !inProgress),
        // Emit once.
        take(1),
        // SwitchMap into the observables we need to init the class.
        switchMap((_) =>
          combineLatest([
            this.mobileAppPreviewService.appTrackingMessageEnabled$,
            this.mobileAppPreviewService.appTrackingMessage$,
          ])
        )
      )
      .subscribe(
        ([appTrackingMessageEnabled, appTrackingMessage]: [
          boolean,
          string,
        ]): void => {
          this.enabledToggleState = appTrackingMessageEnabled ? 'on' : 'off';
          this.message$.next(appTrackingMessage);
        }
      );
  }

  /**
   * On toggle handler.
   * @returns { void }
   */
  public onEnabledToggle(newToggleState: GenericToggleValue): void {
    this.enabledToggleState = newToggleState;

    this.mobileAppPreviewService.setMobileConfig({
      appTrackingMessageEnabled: newToggleState === 'on',
    });
  }

  /**
   * On message save handler.
   * @returns { void }
   */
  public onMessageSave(): void {
    const message: string = this.message$.getValue();

    if (!message?.length) {
      this.toaster.error('Message is required');
      return;
    }

    if (message.length > 5000) {
      this.toaster.error('Message must be under 5000 characters');
      return;
    }

    this.mobileAppPreviewService.setMobileConfig({
      appTrackingMessage: this.message$.getValue(),
    });
  }
}
