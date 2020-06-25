import { Component } from '@angular/core';
import {
  ACCESS,
  LICENSES,
  LicensesEntry,
} from '../../../../services/list-options';
import { BlogsEditService } from '../blog-edit.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { NSFW_REASONS } from '../../../../common/components/nsfw-selector/nsfw-selector.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'm-blogEditor__dropdown',
  host: {
    class: 'm-blogEditor__dropdown',
  },
  template: `
    <m-dropdownMenu
      triggerClass="m-blogEditor__optionsDropdown"
      menuClass="m-blogEditor__optionsMenu"
      [anchorPosition]="{ top: '0', right: '0' }"
      [menu]="menu"
      data-cy="meatball-menu-trigger"
    >
      <m-icon iconId="more_vert" class="m-blodEditor__optionMenuIcon"></m-icon>
    </m-dropdownMenu>
    <ng-template #menu>
      <ul data-cy="meatball-menu">
        <li>
          <m-dropdownMenu
            [menu]="licenseMenu"
            [anchorPosition]="{ top: '0' }"
            triggerClass="m-dropdownMenu__item"
            data-cy="meatball-menu-license"
          >
            <span i18n="noun|@@BLOG_EDITOR_DROPDOWN__LICENSE">License</span>
            <m-icon iconId="chevron_right"></m-icon>
          </m-dropdownMenu>
        </li>

        <li>
          <m-dropdownMenu
            [menu]="visibilityMenu"
            [anchorPosition]="{ top: '0' }"
            triggerClass="m-dropdownMenu__item"
            data-cy="meatball-menu-visibility"
          >
            <span i18n="@@BLOG_EDITOR_DROPDOWN__VISIBILITY">Visibility</span>
            <m-icon iconId="chevron_right"></m-icon>
          </m-dropdownMenu>
        </li>

        <li>
          <m-dropdownMenu
            [menu]="nsfwMenu"
            [anchorPosition]="{ top: '0' }"
            triggerClass="m-dropdownMenu__item"
            data-cy="meatball-menu-nsfw"
          >
            <span i18n="@@COMMON__NSFW">NSFW</span>
            <m-icon iconId="chevron_right"></m-icon>
          </m-dropdownMenu>
        </li>
      </ul>
    </ng-template>

    <ng-template #licenseMenu>
      <ul data-cy="meatball-menu-license-menu">
        <li
          *ngFor="let licenseItem of licenseItems"
          (click)="setLicense(licenseItem.value)"
        >
          <span class="m-dropdownMenu__item">
            <span>{{ licenseItem.text }}</span>
            <m-icon
              iconId="check"
              *ngIf="(getLicense() | async) === licenseItem.value"
            ></m-icon>
          </span>
        </li>
      </ul>
    </ng-template>

    <ng-template #visibilityMenu>
      <ul data-cy="meatball-menu-visibility-menu">
        <li
          *ngFor="let accessItem of accessItems"
          (click)="setAccessId(accessItem.value)"
        >
          <span>{{ accessItem.text }}</span>
          <m-icon
            iconId="check"
            *ngIf="(getAccessId() | async) == accessItem.value"
          ></m-icon>
        </li>
      </ul>
    </ng-template>

    <ng-template #nsfwMenu>
      <ul data-cy="meatball-menu-nsfw-menu">
        <li *ngFor="let reason of reasons" (click)="toggleNSFW(reason.value)">
          <span>{{ reason.label }}</span>
          <m-icon
            iconId="check"
            *ngIf="(getNSFW() | async).indexOf(reason.value) > -1"
          ></m-icon>
        </li>
      </ul>
    </ng-template>
  `,
})
export class BlogEditorDropdownComponent {
  public reasons: typeof NSFW_REASONS = NSFW_REASONS;

  /**
   * License items list
   */
  licenseItems: Array<LicensesEntry> = LICENSES.filter(
    license => license.selectable
  );

  accessItems = ACCESS;

  constructor(
    private editService: BlogsEditService,
    private overlayModal: OverlayModalService
  ) {}

  getLicense(): BehaviorSubject<string> {
    return this.editService.license$;
  }

  setLicense(value: string): void {
    const current = this.editService.license$.getValue();
    if (current === value) {
      this.editService.license$.next('');
      return;
    }
    this.editService.license$.next(value);
  }

  getAccessId() {
    return this.editService.accessId$;
  }

  setAccessId(value: number): void {
    const current: number = this.editService.accessId$.getValue();
    if (current === value) {
      this.editService.accessId$.next(null);
      return;
    }
    this.editService.accessId$.next(value);
  }

  getNSFW() {
    return this.editService.nsfw$;
  }

  toggleNSFW(value: number): void {
    this.editService.toggleNSFW(value);
  }
}
