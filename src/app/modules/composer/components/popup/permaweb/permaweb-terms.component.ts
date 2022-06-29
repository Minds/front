import { Component, EventEmitter, Output } from '@angular/core';
import { ComposerService } from '../../../services/composer.service';

/**
 * Permaweb Terms of Service link and checkbox popup modal.
 * Required before one can post to permaweb.
 */
@Component({
  selector: 'm-composer__permawebTerms',
  templateUrl: 'permaweb-terms.component.html',
  styleUrls: ['permaweb-terms.component.ng.scss'],
})
export class PermawebTermsComponent {
  /**
   * Signal event emitter to parent's popup service
   */
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Checkbox checked
   */
  public checked: boolean = false;

  constructor(protected service: ComposerService) {}

  /**
   * Save value of checkbox to post to permaweb and dismiss intent.
   * @returns { Promise<void> } - awaitable.
   */
  public async save(): Promise<void> {
    this.service.postToPermaweb$.next(this.checked);
    this.dismissIntent.emit();
  }
}
