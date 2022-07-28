import { Component, Input } from '@angular/core';

/**
 * An item to be used in an m-dropdownMenu
 *
 * Item can be styled in a variety of ways
 * (see storybook for additional documentation)
 *
 * See it in the channel feed filter
 */
@Component({
  selector: 'm-dropdownMenu__item',
  templateUrl: './dropdown-menu-item.component.html',
  styleUrls: ['./dropdown-menu-item.component.ng.scss'],
})
export class DropdownMenuItemComponent {
  @Input() label: string;
  @Input() icon?: string;
  @Input() red?: boolean = false;
  @Input() disabled?: boolean = false;
  @Input() hasSubmenu?: boolean = false;

  @Input() selectable?: boolean = false;
  @Input() selected?: boolean = false;
}
