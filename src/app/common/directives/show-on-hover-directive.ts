import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

/**
 * Directive that shows an element on hover of another provided element.
 */
@Directive({
  selector: '[showOnHover]',
})
export class ShowOnHoverDirective implements OnDestroy, OnInit, OnChanges {
  /** Element that when hovered, shows the directives root element ref.  */
  @Input() private hoverSourceElement: ElementRef;

  /** Whether to force showing - allows an external override of behaviour */
  @Input() private forceShow: boolean = false;

  /**
   * If reacting directly to forceShow change, input changes will trigger
   * the element to be toggled between block and hidden regardless of hover state.
   */
  @Input() private reactToForceShowChange: boolean = false;

  // subscriptions.
  private mouseEnterSubscription: Subscription;
  private mouseLeaveSubscription: Subscription;

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.reactToForceShowChange) return;

    this.elementRef.nativeElement.style.visibility = changes['forceShow']
      ?.currentValue
      ? 'block'
      : 'hidden';
  }

  ngOnInit(): void {
    this.elementRef.nativeElement.style.visibility = this.forceShow
      ? 'block'
      : 'hidden';

    this.mouseEnterSubscription = fromEvent(
      this.hoverSourceElement.nativeElement,
      'mouseenter'
    ).subscribe(() => {
      this.elementRef.nativeElement.style.visibility = 'visible';
    });

    this.mouseLeaveSubscription = fromEvent(
      this.hoverSourceElement.nativeElement,
      'mouseleave'
    ).subscribe(() => {
      if (this.forceShow) return;
      this.elementRef.nativeElement.style.visibility = 'hidden';
    });
  }

  ngOnDestroy(): void {
    this.mouseEnterSubscription?.unsubscribe();
    this.mouseLeaveSubscription?.unsubscribe();
    this.elementRef.nativeElement.style.visibility = 'hidden';
  }
}
