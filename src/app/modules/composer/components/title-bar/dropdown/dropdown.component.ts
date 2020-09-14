import { Component, Input } from '@angular/core';
import {
  ComposerService,
  AccessIdSubjectValue,
  LicenseSubjectValue,
} from '../../../services/composer.service';
import { BehaviorSubject } from 'rxjs';
import {
  LicensesEntry,
  LICENSES,
  ACCESS,
} from '../../../../../services/list-options';

@Component({
  selector: 'm-composerTitleBar__dropdown',
  templateUrl: './dropdown.component.html',
})
export class ComposerTitleBarDropdownComponent {
  @Input() anchorPosition = { top: '0', left: '0' };

  /**
   * Visibility items list
   */
  visibilityItems: Array<{ text: string; value: string }> = ACCESS.map(
    ({ text, value }) => ({
      text,
      value: `${value}`,
    })
  );

  /**
   * License items list
   */
  licenseItems: Array<LicensesEntry> = LICENSES.filter(
    license => license.selectable
  );

  constructor(protected service: ComposerService) {}

  /**
   * Access ID subject from service
   */
  get accessId$(): BehaviorSubject<AccessIdSubjectValue> {
    return this.service.accessId$;
  }

  /**
   * License subject from service
   */
  get license$(): BehaviorSubject<LicenseSubjectValue> {
    return this.service.license$;
  }

  /**
   * Can the actor change visibility? (disabled when there's a container)
   */
  get canChangeVisibility(): boolean {
    return !this.service.getContainerGuid();
  }

  /**
   * Is editing? subject value from service
   */
  get isEditing$() {
    return this.service.isEditing$;
  }

  /**
   * Is posting? subject value from service
   */
  get isPosting$() {
    return this.service.isPosting$;
  }

  /**
   * Emits the new visibility (access ID)
   * @param $event
   */
  onVisibilityClick($event) {
    if (!this.canChangeVisibility) {
      return;
    }

    this.accessId$.next($event);
  }

  /**
   * Emits the new license
   * @param $event
   */
  onLicenseClick($event) {
    this.license$.next($event);
  }
}
