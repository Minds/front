import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ConfigsService } from '../../services/configs.service';

@Component({
  selector: 'm-tooltip',
  templateUrl: 'tooltip.component.html',
  styleUrls: ['tooltip.component.ng.scss'],
  host: {
    '(mouseover)': 'setHidden(false)',
    '(mouseout)': 'setHidden(true)',
  },
})
export class TooltipComponent implements OnInit {
  @Input() icon;
  @Input() anchor: 'top' | 'bottom' | 'right' | 'left';
  @Input() iconClass;
  @Input() iconSrc;
  @Input() useParentPosition: boolean = false;
  @Input() enabled: boolean = true;

  /**
   * AnchorV2 displays a triangle pointing toward the anchor el
   * Usage: <m-tooltip anchor="bottom" anchorV2="true">
   * Note: anchorV2 overrides/cancels the 'useParentPosition' property
   */

  @Input() anchorV2: false;

  public readonly cdnAssetsUrl: string;

  hidden: boolean = true;
  offsetTop: number = 0;
  offsetRight: number = 0;
  offsetLeft: number = 0;

  constructor(private element: ElementRef, private configs: ConfigsService) {
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    if (this.anchorV2) {
      if (!this.anchor) {
        this.anchor = 'top';
      }

      this.useParentPosition = false;
    }
  }

  setHidden(value: boolean) {
    if (!value && !this.enabled) {
      return;
    }

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

    const clientRect: ClientRect = this.element.nativeElement.parentElement.getBoundingClientRect();
    this.offsetTop = clientRect.top + clientRect.height - 8;

    let left = clientRect.left;

    this.offsetLeft = Math.abs(left);
  }

  anchorBottom() {
    this.resetOffsets();

    const clientRect: ClientRect = this.element.nativeElement.parentElement.getBoundingClientRect();
    this.offsetTop = clientRect.bottom;

    let left = clientRect.left;

    this.offsetLeft = Math.abs(left);
  }

  anchorLeft() {
    this.resetOffsets();

    const clientRect: ClientRect = this.element.nativeElement.parentElement.getBoundingClientRect();
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

    const clientRect: ClientRect = this.element.nativeElement.parentElement.getBoundingClientRect();
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
