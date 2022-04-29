import { Component, Input } from '@angular/core';
@Component({
  selector: 'm-dropdownMenu__item',
  templateUrl: './dropdown-menu-item.component.html',
  styleUrls: ['./dropdown-menu-item.component.ng.scss'],
})
export class DropdownMenuItemComponent {
  // See storybook for docs

  @Input() label: string;
  @Input() i18nId: string;
  @Input() icon?: string;
  @Input() red?: boolean = false;
  @Input() disabled?: boolean = false;
  @Input() hasSubmenu?: boolean = false;

  @Input() persistent?: boolean = false;
  @Input() selected?: boolean = false;
}
