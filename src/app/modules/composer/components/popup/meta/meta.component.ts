import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ComposerService } from '../../../services/composer.service';
import {
  ComposerBlogsService,
  MetaData,
} from '../../../services/composer-blogs.service';
import { Session } from '../../../../../services/session';

/**
 * Tags popup component. Called programatically via PopupService.
 */
@Component({
  selector: 'm-composer__meta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'meta.component.html',
})
export class MetaComponent {
  /**
   * Signal event emitter to parent's popup service
   */
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  private state: MetaData = {
    urlSlug: '',
    title: '',
    description: '',
    author: '',
  };

  /**
   * Constructor
   * @param service
   * @param configs
   */
  constructor(
    protected session: Session,
    protected service: ComposerService,
    protected blogsService: ComposerBlogsService
  ) {}

  /**
   * Component initialization. Sets current state.
   */
  ngOnInit() {
    // this.state = (this.service.tags$.getValue() || [])
    //   .filter(Boolean)
    //   .filter((value, index, self) => self.indexOf(value) === index);
  }

  /**
   * URL slug from the service
   */
  get urlSlug$() {
    return this.blogsService.urlSlug$;
  }

  onUrlSlugChange($event) {
    this.urlSlug$.next($event);
  }

  /**
   * title from the service
   */
  get title$() {
    return this.blogsService.title$;
  }

  onTitleChange($event) {
    this.title$.next($event);
  }

  /**
   * description from the service
   */
  get description$() {
    return this.blogsService.description$;
  }

  onDescriptionChange($event) {
    this.description$.next($event);
  }

  /**
   * author from the service
   */
  get author$() {
    return this.blogsService.author$;
  }

  onAuthorChange($event) {
    this.author$.next($event);
  }

  /**
   * Emits the internal state to the composer service, stores to MRU cache and attempts to dismiss the modal
   */
  save() {
    if (this.validate(this.state)) {
      this.dismissIntent.emit();
    } else {
      console.error('Invalid blog state');
      // this.error = '';
    }
  }

  validate(meta: MetaData) {
    // TODO: Validation
    return true;
  }
}
