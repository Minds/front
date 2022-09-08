import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ComposerService,
  RemindSubjectValue,
} from '../../services/composer.service';

/**
 * Topbar for composer. Contains titlebar dropdown, option to create blog,
 * and the "Composer" label (a.k.a. NOT the title of the post)
 */
@Component({
  selector: 'm-composer__titleBar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'title-bar.component.html',
  styleUrls: ['./title-bar.component.ng.scss'],
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

  remind$: Observable<RemindSubjectValue> = this.service.remind$;

  /**
   * Has attachments
   */
  hasAttachments$: Observable<boolean> = this.service.data$.pipe(
    map(values => values.attachmentGuids?.length > 0)
  );

  /**
   * If is a supermind
   */
  isSupermind$: Observable<boolean> = this.service.supermindRequest$.pipe(
    map(supermindRequest => !!supermindRequest)
  );

  constructor(protected service: ComposerService) {}

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
   * Container GUID from service.
   * @returns { string } container_guid from service.
   */
  get containerGuid(): string {
    return this.service.getContainerGuid();
  }

  /**
   * Clicked Create Blog trigger
   */
  onCreateBlogClick() {
    this.onCreateBlogEmitter.emit();
  }
}
