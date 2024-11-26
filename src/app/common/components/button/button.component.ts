import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AnchorPosition } from '../../../services/ux/anchor-position';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';

/**
 * Generic button to be used wherever we need buttons.
 *
 * Use inputs to determine the size, color, state and appearance
 * of the button.
 *
 * When saving is true, a loading animation appears.
 *
 * Tells the parent component when it is clicked
 * via the onAction event emitter.
 */

export type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large';
export type ButtonColor =
  | 'blue'
  | 'grey'
  | 'red'
  | 'primary'
  | 'secondary'
  | 'black'
  | 'black-always'
  | 'white-always';

@Component({
  selector: 'm-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.ng.scss'],
})
export class ButtonComponent implements AfterViewChecked {
  /**
   * Button type
   */
  @Input() type: string = 'submit';

  buttonTextWidth: number;
  buttonTextHeight: number;
  @ViewChild('buttonTextContainer')
  buttonTextContainer: ElementRef;

  @Input() disabled: boolean = false;
  @Input() overlay: boolean = false;
  @Input() iconOnly: boolean = false;
  @Input() color: ButtonColor = 'grey';
  @Input() size: ButtonSize = 'medium';

  @Input() pulsating: boolean = false;
  /**
   * whether the button should be borderless or not
   */
  @Input() borderless: boolean = false;
  /**
   * whether the button should have a solid background color or not
   */
  @Input() solid: boolean = false;
  /**
   * !Only works for standard 'grey' buttons at the moment
   * make the button text colorful when true
   */
  @Input() highlightText: boolean = false;

  /**
   * Make the button stretch to 100% width of its container
   */
  @Input() stretch: boolean = false;

  /**
   * Make the button a "soft" square (4px border radius).
   */
  @Input() softSquare: boolean = false;

  /**
   * Handles width for buttons that are not visible onInit
   */
  _saving: boolean = false;
  @Input() set saving(value: boolean) {
    if (value && !this.buttonTextWidth) {
      this.setSavingSize();
    }
    this._saving = value;
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
   * Show the dropdown or not
   */
  @Input() showDropdownMenu = true;

  /**
   * Whether the button text can wrap or not.
   */
  @Input() canWrap: boolean = false;

  /**
   * Event emitter when actioning the button
   */
  @Output() onAction: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * Dropdown menu reference
   */
  @ViewChild('dropdownMenuComponent')
  dropdownMenuComponent: DropdownMenuComponent;

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

  constructor() {}

  ngAfterViewChecked() {
    this.setSavingSize();
  }

  // Prevent button width from shrinking during saving animation
  @HostListener('window:resize')
  resize() {
    this.setSavingSize();
  }

  setSavingSize() {
    if (this.buttonTextContainer && !this._saving) {
      const elWidth = this.buttonTextContainer.nativeElement.clientWidth || 0;
      this.buttonTextWidth = elWidth > 0 ? elWidth : this.buttonTextWidth;

      const elHeight = this.buttonTextContainer.nativeElement.clientHeight || 0;
      this.buttonTextHeight = elHeight > 0 ? elHeight : this.buttonTextHeight;
    }
  }

  /**
   * Emits the action to the parent using the exported interface
   */
  emitAction($event: MouseEvent) {
    if (!this.buttonTextWidth) {
      this.setSavingSize();
    }
    if (this.disabled) {
      $event.preventDefault();
      $event.stopPropagation();
    } else {
      this.onAction.emit($event);
    }
  }
}
