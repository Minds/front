import { Component, Input, OnDestroy } from '@angular/core';
import {
  ComposerService,
  AccessIdSubjectValue,
  LicenseSubjectValue,
  PostToPermawebSubjectValue,
} from '../../../services/composer.service';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import {
  LicensesEntry,
  LICENSES,
  ACCESS,
} from '../../../../../services/list-options';
import { PermawebTermsComponent } from '../../popup/permaweb/permaweb-terms.component';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { Session } from '../../../../../services/session';
import { take } from 'rxjs/operators';
import { PopupService } from '../../popup/popup.service';

/**
 * A dropdown of nested menus for users to configure license/permaweb/visibility for a post
 */
@Component({
  selector: 'm-composerTitleBar__dropdown',
  templateUrl: './dropdown.component.html',
})
export class ComposerTitleBarDropdownComponent implements OnDestroy {
  @Input() displayAsButton: boolean = false;

  @Input() anchorPosition = { top: '0', left: '0' };
  submenuAnchorPosition = { top: '0', right: 'calc(100% - 4px)' };

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

  permawebPostClickSubscription: Subscription;

  constructor(
    protected service: ComposerService,
    protected toaster: ToasterService,
    protected session: Session,
    protected popup: PopupService
  ) {}

  ngOnDestroy() {
    if (this.permawebPostClickSubscription) {
      this.permawebPostClickSubscription.unsubscribe();
    }
  }

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
   * Get monetization subject value from service
   */
  get monetization$() {
    return this.service.monetization$;
  }

  /**
   * Post to permaweb subject from service
   */
  get postToPermaweb$(): BehaviorSubject<PostToPermawebSubjectValue> {
    return this.service.postToPermaweb$;
  }

  /**
   * Emits the new visibility (access ID)
   * @param $event
   */
  onVisibilityClick($event) {
    if (!this.canChangeVisibility) {
      return;
    }

    if (this.service.postToPermaweb$?.getValue() && $event !== 2) {
      this.toaster.warn(
        'Cannot set visibility to non-public on permaweb posts.'
      );
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

  /**
   * Opens modal for permaweb if it can be opened.
   * @returns { void }
   */
  public async onPostToPermawebClick(): Promise<void> {
    this.permawebPostClickSubscription = combineLatest([
      this.postToPermaweb$,
      this.monetization$,
      this.accessId$,
    ])
      .pipe(take(1))
      .subscribe(async ([postToPermaweb, monetization, accessId]) => {
        if (postToPermaweb) {
          this.postToPermaweb$.next(!postToPermaweb);
          return;
        }

        if (monetization) {
          this.toaster.warn('Cannot post monetized posts to permaweb');
          return;
        }

        if (accessId !== '2') {
          this.toaster.warn('Only public posts can be posted to the permaweb');
          return;
        }

        await this.popup
          .create(PermawebTermsComponent)
          .present()
          .toPromise(/* Promise is needed to boot-up the Observable */);
      });
  }

  /**
   * Show permaweb option.
   * @returns { boolean } true if option should be shown.
   */
  public shouldShowPermawebOption(): boolean {
    return (
      !this.service.isEditing$.getValue() &&
      !this.service.remind$.getValue() &&
      this.canChangeVisibility // true is there is a container_guid
    );
  }
}
