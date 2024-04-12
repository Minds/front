import { isPlatformServer } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { ConfigsService } from '../../services/configs.service';
import { NgStyleValue } from '../../types/angular.types';

@Component({
  selector: 'm-tooltip',
  templateUrl: 'tooltip.component.html',
  host: {
    '(mouseover)': 'setHidden(false)',
    '(mouseout)': 'setHidden(true)',
  },
})
export class TooltipComponent implements AfterContentInit {
  @Input() icon; // icon name.
  @Input() anchor: 'top' | 'bottom' | 'right' | 'left'; // position.
  @Input() iconClass; // class for icon
  @Input() iconStyle: NgStyleValue; // style to apply to an icon.
  @Input() tooltipBubbleStyle: NgStyleValue; // style to apply to tooltip bubble.
  @Input() iconSrc; // src for icon.
  @Input() useParentPosition: boolean = false; // whether parent position should be used.
  @Input() enabled: boolean = true; // whether hover functionality of tooltip is enabled.
  @Input() showArrow: boolean = false; // whether arrow should be shown.
  @Input() arrowOffset: number = 0; // offset of the arrow.

  // fires on tooltip mousedown. - this is NOT covered by the standard click event.
  @Output() tooltipMouseDown: EventEmitter<void> = new EventEmitter<void>();

  @Input('hidden') set _hidden(value: boolean) {
    this.hidden = value;
  }

  public readonly cdnAssetsUrl: string;

  hidden: boolean = true;
  offsetTop: number = 0;
  offsetRight: number = 0;
  offsetLeft: number = 0;
  triangleOffset: number = 0;

  constructor(
    private element: ElementRef,
    private configs: ConfigsService,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');
  }

  ngAfterContentInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    const { width, height } =
      this.element.nativeElement.getBoundingClientRect();

    switch (this.anchor) {
      case 'top':
      case 'bottom':
        this.triangleOffset = width / 2 + this.arrowOffset;
        break;
      case 'left':
      case 'right':
        this.triangleOffset = height / 2 + this.arrowOffset;
        break;
    }
  }

  setHidden(value: boolean) {
    if (!this.enabled) return;

    this.hidden = value;

    if (!this.hidden && this.useParentPosition) {
      switch (this.anchor) {
        case 'top':
          this.anchorTop();
          break;
        case 'bottom':
          this.anchorBottom();
          break;
        case 'left':
          this.anchorLeft();
          break;
        case 'right':
          this.anchorRight();
          break;
      }
    }
  }

  anchorTop() {
    this.resetOffsets();

    const clientRect: ClientRect =
      this.element.nativeElement.parentElement.getBoundingClientRect();
    this.offsetTop = clientRect.top + clientRect.height - 8;

    let left = clientRect.left;

    this.offsetLeft = Math.abs(left);
  }

  anchorBottom() {
    this.resetOffsets();

    const clientRect: ClientRect =
      this.element.nativeElement.parentElement.getBoundingClientRect();
    this.offsetTop = clientRect.bottom;

    let left = clientRect.left;

    this.offsetLeft = Math.abs(left);
  }

  anchorLeft() {
    this.resetOffsets();

    const clientRect: ClientRect =
      this.element.nativeElement.parentElement.getBoundingClientRect();
    this.offsetTop = clientRect.top;

    let left = clientRect.left + clientRect.width;

    if (left + clientRect.width >= window.innerWidth) {
      this.offsetRight =
        window.innerWidth - clientRect.right + clientRect.width;
    } else {
      this.offsetLeft = Math.abs(left);
    }
  }

  anchorRight() {
    this.resetOffsets();

    const clientRect: ClientRect =
      this.element.nativeElement.parentElement.getBoundingClientRect();
    this.offsetTop = clientRect.top;

    let right = window.innerWidth - clientRect.left;

    if (right >= window.innerWidth) {
      right = 0;
      this.offsetLeft = clientRect.left + clientRect.width;
    }

    this.offsetRight = Math.abs(right);
  }

  resetOffsets() {
    this.offsetTop = this.offsetLeft = this.offsetRight = undefined;
  }
}
