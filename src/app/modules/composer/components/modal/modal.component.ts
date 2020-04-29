import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewChild,
} from '@angular/core';
import { BaseComponent } from '../base/base.component';

const noOp = () => {};

@Component({
  selector: 'm-composer__modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'modal.component.html',
})
export class ModalComponent implements AfterViewInit {
  @ViewChild('baseComponent', { static: true }) baseComponent: BaseComponent;

  onPost: (any) => any = noOp;

  onDismissIntent: () => void = noOp;

  /**
   * Modal options
   *
   * @param onPost
   * @param onDismissIntent
   */
  set opts({ onPost, onDismissIntent }) {
    this.onPost = onPost || noOp;
    this.onDismissIntent = onDismissIntent || noOp;
  }

  /**
   * Auto-focus after view init
   */
  ngAfterViewInit(): void {
    this.baseComponent.focus();
  }

  /**
   * Processes Esc keys as dismissal intent
   * @param $event
   */
  @HostListener('window:keydown', ['$event']) onWindowKeyDown(
    $event: KeyboardEvent
  ) {
    if (!$event || !$event.target) {
      return true;
    }

    const tagName = (
      ($event.target as HTMLElement).tagName || ''
    ).toLowerCase();

    const isContentEditable =
      ($event.target as HTMLElement).contentEditable === 'true';

    if (
      // NOTE: For now, let's allow pressing Esc even on editable
      // tagName === 'input' ||
      // tagName === 'textarea' ||
      // isContentEditable ||
      $event.key !== 'Escape'
    ) {
      return true;
    }

    $event.stopPropagation();
    $event.preventDefault();
    this.onDismissIntent();

    return true;
  }
}
