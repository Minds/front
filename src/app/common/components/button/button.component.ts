import {
  Component,
  Input,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { AnchorPosition } from '../../../services/ux/anchor-position';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'm-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.ng.scss'],
})
export class ButtonComponent implements AfterViewInit {
  /**
   * Button type
   */
  @Input() type: string = 'submit';

  buttonTextWidth: number;
  @ViewChild('buttonTextContainer')
  buttonTextContainer: ElementRef;

  @Input() disabled: boolean = false;
  @Input() overlay: boolean = false;
  @Input() iconOnly: boolean = false;
  @Input() color: 'blue' | 'grey' | 'red' | 'primary' | 'secondary' = 'grey';
  @Input() size: 'xsmall' | 'small' | 'medium' | 'large' = 'medium';
  @Input() pulsating: boolean = false;

  /**
   * Handles width for buttons that are not visible onInit
   */
  private _saving: boolean;
  @Input() set saving(value: boolean) {
    if (value && !this.buttonTextWidth) {
      this.setSavingWidth();
    }
    this._saving = value;
  }
  get saving(): boolean {
    return this._saving;
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

  ngAfterViewInit() {
    this.setSavingWidth();
  }

  // Prevent button width from shrinking during saving animation
  @HostListener('window:resize')
  resize() {
    this.setSavingWidth();
  }

  setSavingWidth() {
    if (this.buttonTextContainer && !this.saving) {
      const elWidth = this.buttonTextContainer.nativeElement.clientWidth || 0;
      this.buttonTextWidth = elWidth > 0 ? elWidth : this.buttonTextWidth;
    }
  }

  /**
   * Emits the action to the parent using the exported interface
   */
  emitAction($event: MouseEvent) {
    if (this.disabled) {
      $event.preventDefault();
      $event.stopPropagation();
    } else {
      this.onAction.emit($event);
    }
  }
}
