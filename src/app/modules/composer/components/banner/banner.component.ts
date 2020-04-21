import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ComposerService } from '../../services/composer.service';
import { ComposerBlogsService } from '../../services/composer-blogs.service';

@Component({
  selector: 'm-composer__banner',
  templateUrl: 'banner.component.html',
})
export class BannerComponent {
  /**
   * banner BehaviorSubject from blogsService.
   */
  get banner$() {
    return this.blogsService.banner$;
  }

  /**
   * Constructor
   * @param domSanitizer
   * @param configs
   * @param service
   */
  constructor(
    protected domSanitizer: DomSanitizer,
    protected blogsService: ComposerBlogsService,
    protected service: ComposerService
  ) {}
}
