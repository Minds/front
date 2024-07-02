import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ComposerBoostService } from '../../services/boost.service';
import { ComposerService } from '../../services/composer.service';
import { ToasterService } from '../../../../common/services/toaster.service';

/**
 * Boost mode toggle component for composer.
 */
@Component({
  selector: 'm-composer__boostToggle',
  styleUrls: ['./boost-toggle.component.ng.scss'],
  template: `
    <button
      class="m-composerBoostToggle__button"
      data-ref="data-minds-composer-boost-toggle-button"
      [ngClass]="{
        'm-composerBoostToggle__button--selected': isBoostMode$ | async
      }"
      (click)="onClick()"
    >
      <span i18n="@@COMPOSER_BOOST_TOGGLE_BUTTON__BOOST_ACTION">Boost</span>
    </button>
  `,
})
export class ComposerBoostToggleComponent {
  /** Whether composer is in Boost mode. */
  protected readonly isBoostMode$: BehaviorSubject<boolean> =
    this.composerBoostService.isBoostMode$;

  constructor(
    private composerBoostService: ComposerBoostService,
    private composerService: ComposerService,
    private toasterService: ToasterService
  ) {}

  /**
   * Handle on click behaviour by toggling boost mode.
   * @returns { Promise<void> }
   */
  async onClick(): Promise<void> {
    if (
      this.composerService.nsfw$.getValue().length &&
      !this.composerBoostService.isBoostMode$.getValue()
    ) {
      this.toasterService.error('NSFW content cannot be boosted');
      return;
    }

    this.composerBoostService.isBoostMode$.next(
      !this.composerBoostService.isBoostMode$.getValue()
    );
  }
}
