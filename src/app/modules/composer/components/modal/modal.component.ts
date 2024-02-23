import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewChild,
  Inject,
  Injectable,
  PLATFORM_ID,
  OnInit,
} from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { isPlatformServer } from '@angular/common';
import { isIos } from '../../../../helpers/is-mobile-or-tablet';
import { ComposerService } from '../../services/composer.service';

const noOp = () => {};

/**
 * Composer modal
 */
@Injectable()
@Component({
  selector: 'm-composer__modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'modal.component.html',
})
export class ModalComponent implements OnInit {
  resizeEvent;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    protected service: ComposerService
  ) {}

  @ViewChild('baseComponent', { static: false }) baseComponent: BaseComponent;

  onPost: (any) => any = noOp;

  onDismissIntent: () => void = noOp;

  /**
   * Modal options
   *
   * @param onPost
   * @param onDismissIntent
   */
  setModalData({ onPost, onDismissIntent }) {
    this.onPost = onPost || noOp;
    this.onDismissIntent = onDismissIntent || noOp;
  }

  getModalOptions() {
    return {
      canDismiss: async () => {
        if (this.baseComponent.isDirty) {
          // Opens a confirmation dialog
          // To prevent loss of unsaved changes
          return window.confirm('Discard changes?');
        }
        return true;
      },
    };
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
    if (isPlatformServer(this.platformId)) {
      return;
    }

    setTimeout(() => {
      let vh;

      if (isIos()) {
        vh = `85vh`;
        document.documentElement.style.setProperty('--mobileVH', `${vh}`);
      } else {
        vh = `${(window as any).visualViewport.height}px`;
      }
      document.documentElement.style.setProperty('--mobileVH', `${vh}`);
    }, 100);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeEvent);
  }
}
