import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import {
  Observable,
  Subscription,
  combineLatest,
  firstValueFrom,
  map,
} from 'rxjs';
import { ComposerAudienceSelectorService } from '../../services/audience.service';
import { PopupService } from '../popup/popup.service';
import { ComposerAudienceSelectorPanelComponent } from '../popup/audience-selector/audience-selector.component';
import { ComposerService } from '../../services/composer.service';

/**
 * Audience selector component used within composer.
 */
@Component({
  selector: 'm-composer__audienceSelectorButton',
  templateUrl: 'audience-selector-button.component.html',
  styleUrls: ['./audience-selector-button.component.ng.scss'],
  host: {
    '(click)': 'onClick($event)',
    'data-ref': 'composer-audience-selector-button',
  },
})
export class ComposerAudienceSelectorButtonComponent
  implements OnInit, OnDestroy {
  /** bind disabled class to host component. */
  @HostBinding('class.m-composerAudienceSelector__host--disabled')
  disabled: boolean = false;

  public readonly audienceDisplayName$: Observable<string> = this
    .audienceSelectorService.audienceDisplayName$;

  /** Display name */
  public readonly selectedAudienceDisplayName$: Observable<
    string
  > = combineLatest([
    this.composerService.pendingMonetization$,
    this.audienceSelectorService.audienceDisplayName$,
  ]).pipe(
    map(([monetization, audienceName]) => {
      if (monetization && monetization.name) {
        return monetization.name;
      } else return audienceName;
    })
  );

  /** subscription to variables that change disabled state */
  private disableStateSubscription: Subscription;

  constructor(
    protected audienceSelectorService: ComposerAudienceSelectorService,
    protected popup: PopupService,
    private composerService: ComposerService
  ) {}

  ngOnInit(): void {
    this.disableStateSubscription = combineLatest([
      this.composerService.isSupermindRequest$,
      this.composerService.isGroupPost$,
    ]).subscribe(
      ([isSupermindRequest, isGroupPost]: [boolean, boolean]): void => {
        // if it is a Supermind request it cannot be posted to a group -
        // reset to channel and set host state to disabled.
        if (isSupermindRequest) {
          this.audienceSelectorService.selectedAudience$.next(null);
        }

        this.disabled = this.shouldDisable();
      }
    );
  }

  ngOnDestroy(): void {
    this.disableStateSubscription?.unsubscribe();
  }

  /**
   * On click behavior - opens audience selector panel.
   * @returns { Promise<void> }
   */
  async onClick(): Promise<void> {
    if (this.disabled) {
      return;
    }
    await firstValueFrom(
      this.popup.create(ComposerAudienceSelectorPanelComponent).present()
    );
  }

  /**
   * Whether host component should be in a disabled state.
   * @returns { boolean } true if host component should be disabled.
   */
  private shouldDisable(): boolean {
    if (this.composerService.supermindRequest$.getValue()) {
      return true;
    }
    return (
      !this.audienceSelectorService.shareToGroupMode$.getValue() &&
      (Boolean(this.composerService.remind$.getValue()) ||
        this.composerService.isGroupPost$.getValue())
    );
  }
}
