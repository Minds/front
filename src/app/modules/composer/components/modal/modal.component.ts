import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewChild,
  Inject,
  Injectable,
  PLATFORM_ID,
} from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { isPlatformServer } from '@angular/common';

const noOp = () => {};
@Injectable()
@Component({
  selector: 'm-composer__modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'modal.component.html',
})
export class ModalComponent implements AfterViewInit {
  resizeEvent;

  constructor(@Inject(PLATFORM_ID) private platformId) {}

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

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) return;

    try {
      this.resizeEvent = (window as any).visualViewport.addEventListener(
        'resize',
        () => {
          this.setViewportHeight();
        }
      );
      this.setViewportHeight();
    } catch (error) {}
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

  setViewportHeight(): void {
    if (isPlatformServer(this.platformId)) return;

    let vh = (window as any).visualViewport.height;
    document.documentElement.style.setProperty('--mobileVH', `${vh}px`);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeEvent);
  }
}
