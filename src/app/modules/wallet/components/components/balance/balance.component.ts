import {
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'm-wallet__balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.ng.scss'],
  host: {
    '(mouseover)': 'showExpanded($event)',
    '(mouseleave)': 'hideExpanded($event)',
  },
})
export class WalletBalanceComponent {
  /** Expanded value */
  expanded = false;

  @ViewChild('expandedRef') expandedContent: ElementRef;

  @ViewChild('addressRef') addressContent: ElementRef;

  /**
   * Will show the expanded content
   * @param e
   */
  showExpanded(e: MouseEvent): void {
    if (this.canExpand) this.expanded = true;
  }

  /**
   * Will hide the expanded content
   * @param e
   */
  hideExpanded(e: MouseEvent): void {
    this.expanded = false;
  }

  /**
   * Returns if there is any content to expand
   */
  get canExpand(): boolean {
    return this.expandedContent?.nativeElement?.childNodes.length > 0;
  }

  get hasAddress(): boolean {
    return this.addressContent?.nativeElement?.childNodes.length > 0;
  }
}
