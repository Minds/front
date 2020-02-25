import { Injectable, Optional, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { SiteService } from './site.service';
import { Location } from '@angular/common';
import { ConfigsService } from './configs.service';
import { DOCUMENT } from '@angular/common';

const DEFAULT_META_TITLE = 'Minds';
const DEFAULT_META_DESCRIPTION = '...';
export const MIN_METRIC_FOR_ROBOTS = 5;

@Injectable()
export class MetaService {
  private counter: number;
  private sep = ' | ';
  private title: string = '';
  private ogTitle: string = '';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private site: SiteService,
    private location: Location,
    private configs: ConfigsService,
    @Inject(DOCUMENT) private dom
  ) {
    this.reset();
  }

  setTitle(value: string, join = true): MetaService {
    let title;
    const defaultTitle = this.site.isProDomain
      ? this.site.title + ' - ' + this.site.oneLineHeadline
      : DEFAULT_META_TITLE;

    value = this.stripHtml(value);

    // Full title for og:title
    this.ogTitle = value || defaultTitle;

    if (value.length > 60) {
      value = value.substr(0, 57) + '...';
    }

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
    value = this.stripHtml(value);
    if (value.length > 160) {
      value = value.substr(0, 157) + '...';
    }
    this.metaService.updateTag({ name: 'description', content: value });
    return this;
  }

  setCounter(value: number): MetaService {
    this.counter = value;
    this.applyTitle();
    return this;
  }

  setCanonicalUrl(value: string): MetaService {
    // Find and clear or canonical links
    const links: HTMLLinkElement[] = this.dom.head.querySelectorAll(
      '[rel="canonical"]'
    );
    if (links.length) {
      for (const link of links) {
        this.dom.head.removeChild(link);
      }
    }

    if (value) {
      // TODO: fix duplicated code with ogUrl here...
      if (value && value.indexOf('/') === 0) {
        // Relative path
        value = this.site.baseUrl + value.substr(1);
      }

      let link: HTMLLinkElement;
      link = this.dom.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', value);
      this.dom.head.appendChild(link);
    }
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

  setLanguage(language: string): MetaService {
    return this;
  }

  setRobots(value: string): MetaService {
    this.metaService.updateTag({ name: 'robots', content: value });
    return this;
  }

  setNsfw(value: boolean): MetaService {
    if (value) {
      this.metaService.updateTag({ name: 'rating', content: 'adult' });
    } else {
      this.metaService.removeTag("name='rating'");
    }
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
      .setOgImage(data.ogImage || null, { width: 0, height: 0 })
      .setCanonicalUrl('') // Only user canonical when required
      .setRobots(data.robots || 'all')
      .setNsfw(false);
  }

  private applyTitle(): void {
    if (this.counter) {
      this.titleService.setTitle(`(*) ${this.title}`);
    } else {
      this.titleService.setTitle(this.title);
    }
    this.metaService.updateTag({
      name: 'og:title',
      content: this.ogTitle,
    });
  }

  /**
   * Removes any html found and returns on text
   * @param value
   * @return string
   */
  private stripHtml(value: string): string {
    if (!value) return '';
    const fakeEl = this.dom.createElement('span');
    fakeEl.innerHTML = value;
    return fakeEl.textContent || fakeEl.innerText;
  }
}
