import { Component } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { ComposerAudienceSelectorService } from '../../services/audience.service';
import { PopupService } from '../popup/popup.service';
import { ComposerAudienceSelectorPanelComponent } from '../popup/audience-selector/audience-selector.component';

/**
 * Audience selector component used within composer.
 */
@Component({
  selector: 'm-composer__audienceSelectorButton',
  templateUrl: 'audience-selector.component.html',
  styleUrls: ['./audience-selector.component.ng.scss'],
  host: {
    '(click)': 'onClick($event)',
    'data-ref': 'composer-audience-selector-button',
  },
})
export class ComposerAudienceSelectorComponent {
  /** Audience display name from service */
  public readonly audienceDisplayName$: Observable<string> = this
    .audienceSelectorService.audienceDisplayName$;

  constructor(
    protected audienceSelectorService: ComposerAudienceSelectorService,
    protected popup: PopupService
  ) {}

  /**
   * On click behavior - opens audience selector panel.
   * @returns { Promise<void> }
   */
  async onClick(): Promise<void> {
    await firstValueFrom(
      this.popup.create(ComposerAudienceSelectorPanelComponent).present()
    );
  }
}
