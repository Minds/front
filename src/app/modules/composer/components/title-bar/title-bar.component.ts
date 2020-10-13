import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { ComposerService } from '../../services/composer.service';

/**
 * Composer title bar component. It features a label and a dropdown menu
 * with not-that-important options.
 */
@Component({
  selector: 'm-composer__titleBar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'title-bar.component.html',
})
export class TitleBarComponent {
  /**
   * Composer textarea ID
   */
  @Input() inputId: string;

  /**
   * Create blog intent
   */
  @Output('onCreateBlog') onCreateBlogEmitter: EventEmitter<
    void
  > = new EventEmitter<void>();

  constructor(protected service: ComposerService) {}

  /**
   * Attachment subject value from service
   */
  get attachment$() {
    return this.service.attachment$;
  }

  /**
   * Is editing? subject value from service
   */
  get isEditing$() {
    return this.service.isEditing$;
  }

  /**
   * Is posting? subject value from service
   */
  get isPosting$() {
    return this.service.isPosting$;
  }

  /**
   * Clicked Create Blog trigger
   */
  onCreateBlogClick() {
    this.onCreateBlogEmitter.emit();
  }
}
