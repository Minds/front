import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'm-dropdownMenu__item',
  templateUrl: './dropdown-menu-item.component.html',
  styleUrls: ['./dropdown-menu-item.component.ng.scss'],
})
export class DropdownMenuItemComponent implements OnInit {
  // The text to be displayed
  @Input() label: string;

  // Translation string for the displayed text
  @Input() i18n: string;

  // Material icon to be displayed left of the label
  @Input() icon: string;

  // If clicking on the item opens another nested menu,
  // include its template here.
  // An arrow will be displayed on the right side of the item.
  @Input() submenu: TemplateRef<any>;

  // TRUE if the item is part of a menu of filters or some other
  // selectable trait that persists after the item is clicked
  // (e.g. 'Videos' in the feed filter).
  // This will leave space for a checkmark to the left of the item
  // that will display when 'selected' is true.
  // ...
  // FALSE if the item is an ephemeral action
  // e.g. 'leave group' or 'remind post'
  @Input() persistant: boolean = false;

  // True if a 'persistant' item is selected.
  // A checkmark will be displayed on the left of the label.
  @Input() selected: boolean = false;

  // If the item is destructive, make the text/icon red
  @Input() red: boolean = false;

  // If the item cannot be selected, the text will be lighter
  // and the cursor won't be a pointer
  @Input() disabled: boolean = false;

  // ojm todo: isLink?

  // ojm delete constuctor, etc?

  constructor() {}

  ngOnInit(): void {}
}
