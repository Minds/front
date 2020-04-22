import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ComposerService } from '../../../services/composer.service';
import { ComposerBlogsService } from '../../../services/blogs.service';
import { Session } from '../../../../../services/session';
import { BehaviorSubject } from 'rxjs';
import { SiteService } from '../../../../../common/services/site.service';

/**
 * Meta popup component. Called programatically via PopupService.
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

  /**
   * Constructor
   * @param service
   * @param configs
   */
  constructor(
    public session: Session,
    protected service: ComposerService,
    protected site: SiteService,
    protected blogsService: ComposerBlogsService
  ) {}

  /**
   * User from session service.
   */
  get user(): any {
    return this.session.getLoggedInUser();
  }

  /**
   * URL slug from the service
   */
  get urlSlug$(): BehaviorSubject<string> {
    return this.blogsService.urlSlug$;
  }

  /**
   * title from the service
   */
  get title$(): BehaviorSubject<string> {
    return this.blogsService.title$;
  }

  /**
   * description from the service
   */
  get description$(): BehaviorSubject<string> {
    return this.blogsService.description$;
  }

  /**
   * author from the service
   */
  get author$(): BehaviorSubject<string> {
    return this.blogsService.author$;
  }

  /**
   * Update observable urlSlug$
   */
  onUrlSlugChange($event: string): void {
    this.urlSlug$.next($event);
  }

  /**
   * Update observable title$
   */
  onTitleChange($event: string): void {
    this.title$.next($event);
  }

  /**
   * Update observable description$
   */
  onDescriptionChange($event: string): void {
    this.description$.next($event);
  }

  /**
   * Update observable author$
   */
  onAuthorChange($event: string): void {
    this.author$.next($event);
  }

  /**
   * Emits the internal state to the composer service, stores to MRU cache and attempts to dismiss the modal
   */
  save(): void {
    this.dismissIntent.emit();
  }
}
