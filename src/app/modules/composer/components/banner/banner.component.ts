import { Component } from '@angular/core';
import { ComposerService } from '../../services/composer.service';
import { ComposerBlogsService } from '../../services/blogs.service';

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
   * @param configs
   * @param service
   */
  constructor(
    public blogsService: ComposerBlogsService,
    protected service: ComposerService
  ) {}
}
