import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  AnchorPosition,
  DropdownMenuComponent,
} from '../dropdown-menu/dropdown-menu.component';

/**
 * Interface for action emitter
 */
export interface ButtonComponentAction {
  type: string;
}

/**
 * Standard button based on 2020 designs, with dropdown support
 */
@Component({
  selector: 'm-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'button.component.html',
})
export class ButtonComponent {
  /**
   * Button type
   */
  @Input() type: string = 'default';

  /**
   * Is the button disabled?
   */
  @HostBinding('class.m-button--disabled') disabled: boolean = false;

  /**
   * Disabled setter, it will set this.disabled and close the menu, if open
   * @param disabled
   * @private
   */
  @Input('disabled') set _disabled(disabled: boolean) {
    this.disabled = disabled;

    if (disabled && this.dropdownMenuComponent) {
      this.dropdownMenuComponent.close();
    }
  }

  /**
   * Dropdown template
   */
  @Input() dropdown: TemplateRef<any>;

  /**
   * Dropdown positioning
   */
  @Input() dropdownAnchorPosition: AnchorPosition = {
    top: '100%',
    right: '0',
  };

  /**
   * Event emitter when actioning the button
   */
  @Output() onAction: EventEmitter<ButtonComponentAction> = new EventEmitter<
    ButtonComponentAction
  >();

  /**
   * Dropdown menu reference
   */
  @ViewChild('dropdownMenuComponent', { static: false })
  dropdownMenuComponent: DropdownMenuComponent;

  /**
   * Emits the action to the parent using the exported interface
   */
  emitAction() {
    this.onAction.emit({
      type: this.type,
    });
  }
}
