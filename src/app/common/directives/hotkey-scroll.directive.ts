import { Directive, Input, OnInit, QueryList, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

export type FeedScrollDirection = 'up' | 'down' | '';

export type AnchorElement = { element: any; position: number };

export const TOPBAR_HEIGHT: number = 75;

/**
 * Directive to scroll on hotkey press (j and k).
 * To use pass ViewChildren into anchors
 *
 * e.g.
 *  <div
 *    m-hotkeyScroll
 *    [anchors]="feedViewChildren"
 *  >
 *    <item #feedViewChildren></item>
 *    <item #feedViewChildren></item>
 *  </div>
 *
 *  Recommended: read your ViewChildren as ElementRefs as below:
 *
 *  @ViewChildren('feedViewChildren', { read: ElementRef }) feedViewChildren: QueryList<ElementRef>;
 */
@Directive({
  selector: '[m-hotkeyScroll]',
})
export class HotkeyScrollDirective implements OnInit {
  // ViewChildren to be used as scrolling anchors.
  @Input() anchors: QueryList<ViewChild>;

  // filtered keypress events.
  private readonly keyPresses = fromEvent(document, 'keydown').pipe(
    filter((e: KeyboardEvent) => {
      if (this.isFocusCaptured(e.target)) {
        return;
      }

      return e.key === 'j' || e.key === 'J' || e.key === 'k' || e.key === 'K';
    })
  );

  ngOnInit() {
    this.keyPresses.subscribe((val) => {
      if (!this.anchors) {
        return;
      }

      let arr: AnchorElement[] = [];
      let direction: FeedScrollDirection = this.getDirection(val.key);

      // iterate through anchors and remap to array with positions
      this.anchors.forEach((anchor: any) => {
        if (!anchor || !anchor.nativeElement) {
          return;
        }
        arr.push({
          element: anchor,
          position: anchor.nativeElement.getBoundingClientRect().top,
        });
      });

      const currentPosition: number = this.getCurrentPosition(arr);

      const feedArray: ViewChild[] = this.anchors.toArray();

      // get current element and index.
      const currentElArr: AnchorElement[] = arr.filter(
        (val) => val.position === currentPosition
      );

      let currentEl: AnchorElement;

      // empty elements can have shared y position - pick correct element
      // depending on direction.
      if (currentElArr.length > 1) {
        currentEl =
          direction === 'down' ? currentElArr.reverse()[0] : currentElArr[0];
      } else {
        currentEl = currentElArr[0];
      }

      if (!currentEl) {
        return;
      }

      const currentIndex: number = feedArray.indexOf(currentEl.element);

      // derive next index, element and position.
      const nextIndex: number =
        direction === 'down' ? currentIndex + 1 : currentIndex - 1;

      const nextElement = (feedArray[nextIndex] as any)?.nativeElement;

      if (!nextElement) {
        return;
      }

      const nextPosition =
        (nextElement?.getBoundingClientRect().top ?? 0) +
        (window.pageYOffset - TOPBAR_HEIGHT);

      this.scrollToPosition(nextPosition);
    });
  }

  /**
   * Gets direction based on keypress
   * @param { string } key - pressed key as a string
   * @returns { FeedScrollDirection } - 'up' or 'down'.
   */
  private getDirection(key: string): FeedScrollDirection {
    if (key === 'j' || key === 'J') {
      return 'up';
    } else {
      return 'down';
    }
  }

  /**
   * Gets position of current element
   * @param { AnchorElement[] } arr - array of positions
   * @returns number - current position index.
   */
  private getCurrentPosition(arr: AnchorElement[]): number {
    return arr.reduce(
      (acc, { position }) =>
        acc === 0
          ? position
          : position > 0 && position <= Math.abs(acc)
            ? position
            : position < 0 && -position < Math.abs(acc)
              ? position
              : acc,
      0
    );
  }

  /**
   * Scroll to a given position.
   * @param { number } position - position to scroll in window.
   * @returns { void }
   */
  private scrollToPosition(position: number): void {
    window.scrollTo({
      top: position,
      behavior: 'smooth',
    });
  }

  /**
   * True if an editable container is current being focused.
   * @param target - event.target
   * @returns { boolean } - true if a container is being focused.
   */
  private isFocusCaptured(target: any): boolean {
    try {
      return (
        target.localName === 'input' ||
        target.localName === 'textarea' ||
        target.isContentEditable
      );
    } catch (e) {
      return true; // default to false - if there is an issue fallback to hotkey not working.
    }
  }
}
