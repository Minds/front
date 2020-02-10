import { Injectable, Optional } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { SiteService } from './site.service';
import { Location } from '@angular/common';
import { ConfigsService } from './configs.service';

const DEFAULT_META_TITLE = 'Minds';
const DEFAULT_META_DESCRIPTION = '...';

@Injectable()
export class MetaService {
  private counter: number;
  private sep = ' | ';
  private title: string = '';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private site: SiteService,
    private location: Location,
    private configs: ConfigsService
  ) {
    this.reset();
  }

  setTitle(value: string, join = true): MetaService {
    let title;
    const defaultTitle = this.site.isProDomain
      ? this.site.title + ' - ' + this.site.oneLineHeadline
      : DEFAULT_META_TITLE;

    if (value && join) {
      title = [value, defaultTitle]
        .filter(fragment => Boolean(fragment))
        .join(this.sep);
    } else if (value) {
      title = value;
    } else {
      title = defaultTitle;
    }
    this.title = title;
    this.applyTitle();
    return this;
  }

  setDescription(value: string): MetaService {
    this.metaService.updateTag({ name: 'description', content: value });
    return this;
  }

  setCounter(value: number): MetaService {
    this.counter = value;
    this.applyTitle();
    return this;
  }

  setOgUrl(value: string): MetaService {
    if (value && value.indexOf('/') === 0) {
      // Relative path
      value = this.site.baseUrl + value.substr(1);
    }
    this.metaService.updateTag({
      property: 'og:url',
      content: value,
    });
    return this;
  }

  setOgImage(
    value: string,
    @Optional() dimensions: { width: number; height: number } = null
  ): MetaService {
    if (value) {
      if (value.indexOf('/') === 0) {
        // Relative path
        value = this.configs.get('cdn_assets_url') + value.substr(1);
      }
      this.metaService.updateTag({ property: 'og:image', content: value });

      if (dimensions) {
        this.metaService.updateTag({
          property: 'og:image:width',
          content: dimensions.width.toString(),
        });
        this.metaService.updateTag({
          property: 'og:image:height',
          content: dimensions.height.toString(),
        });
      }
    }

    return this;
  }

  setOgType(value: string): MetaService {
    this.metaService.updateTag({
      property: 'og:type',
      content: value,
    });
    return this;
  }

  setRobots(value: string): MetaService {
    this.metaService.updateTag({ name: 'robots', content: value });
    return this;
  }

  reset(
    data: {
      title?: string;
      description?: string;
      ogUrl?: string;
      ogImage?: string;
      robots?: string;
    } = {}
  ): void {
    this.setTitle(data.title || '')
      .setDescription(data.description || DEFAULT_META_DESCRIPTION)
      .setOgType('website')
      .setOgUrl(data.ogUrl || this.location.path())
      .setOgImage(data.ogImage || '/assets/logos/placeholder.jpg', {
        width: 765,
        height: 458,
      })
      .setRobots(data.robots || 'all');
  }

  private applyTitle(): void {
    if (this.counter) {
      this.titleService.setTitle(`(*) ${this.title}`);
    } else {
      this.titleService.setTitle(this.title);
    }
    this.metaService.updateTag({
      name: 'og:title',
      content: this.title,
    });
  }
}
