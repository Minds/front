import { Injectable, Optional, Inject, SecurityContext } from '@angular/core';
import { Title, Meta, DomSanitizer } from '@angular/platform-browser';
import { SiteService } from './site.service';
import { Location } from '@angular/common';
import { ConfigsService } from './configs.service';
import { DOCUMENT } from '@angular/common';
import maxNum from '../../helpers/max';

const DEFAULT_META_TITLE = 'Minds';
const DEFAULT_META_DESCRIPTION = '...';
export const MIN_METRIC_FOR_ROBOTS = 5;
const DEFAULT_META_AUTHOR = 'Minds';
const DEFAULT_OG_IMAGE = '/assets/og-images/default-v3.png';
const DEFAULT_OG_IMAGE_WIDTH = 1200;
const DEFAULT_OG_IMAGE_HEIGHT = 1200;

@Injectable({
  providedIn: 'root',
})
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
    @Inject(DOCUMENT) private dom,
    private domSanitizer: DomSanitizer
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
    if (value.length > 200) {
      value = value.substr(0, 197) + '...';
    }
    this.metaService.updateTag({ name: 'description', content: value });
    this.metaService.updateTag({ property: 'og:description', content: value });
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

  /**
   * Used for pro domains
   */
  setDynamicFavicon(href: string): MetaService {
    const existingLink = this.dom.head.querySelector('#dynamicFavicon');

    if (existingLink) {
      existingLink.setAttribute('href', href);
    } else {
      let link: HTMLLinkElement;
      link = this.dom.createElement('link');
      link.setAttribute('rel', 'icon');
      link.setAttribute('type', 'image/png');
      link.setAttribute('href', href);
      link.setAttribute('id', 'dynamicFavicon');
      this.dom.head.appendChild(link);
    }
    return this;
  }

  resetDynamicFavicon(): MetaService {
    const link = this.dom.head.querySelector('#dynamicFavicon');

    if (link) {
      this.dom.head.removeChild(link);
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

  /**
   * Sets OEmbed URL for relevant content.
   * @param { entityGuid } - The GUID of the entity to be linked.
   * @returns { MetaService } - Chainable.
   */
  public setOEmbed(entityGuid: string): MetaService {
    const existingLink = this.dom.head.querySelector('#oEmbed');

    if (existingLink) {
      existingLink.setAttribute('href', this.getOEmbedUrl(entityGuid));
    } else {
      let link: HTMLLinkElement;
      link = this.dom.createElement('link');
      link.setAttribute('rel', 'alternative');
      link.setAttribute('href', this.getOEmbedUrl(entityGuid));
      link.setAttribute('type', 'application/json+oembed');
      link.setAttribute('id', 'oEmbed');
      this.dom.head.appendChild(link);
    }
    return this;
  }

  setAuthor(value: string): MetaService {
    this.metaService.updateTag({
      property: 'author',
      content: value,
    });
    return this;
  }

  setOgAuthor(value: string): MetaService {
    this.metaService.updateTag({
      property: 'og:author',
      content: value,
    });
    return this;
  }

  setOgSiteName(): MetaService {
    this.metaService.updateTag({
      property: 'og:site_name',
      content: this.site.title,
    });
    return this;
  }

  reset(
    data: {
      title?: string;
      description?: string;
      ogUrl?: string;
      ogImage?: string;
      ogImageWidth?: number;
      ogImageHeight?: number;
      robots?: string;
      canonicalUrl?: string;
      author?: string;
      ogAuthor?: string;
    } = {}
  ): void {
    this.setTitle(data.title || '')
      .setDescription(data.description || DEFAULT_META_DESCRIPTION)
      .setOgType('website')
      .setOgUrl(data.ogUrl || this.location.path())
      .setOgImage(
        data.ogImage || DEFAULT_OG_IMAGE,
        data.ogImage
          ? data.ogImageWidth && data.ogImageHeight
            ? {
                width: data.ogImageWidth,
                height: data.ogImageHeight,
              }
            : null
          : { width: DEFAULT_OG_IMAGE_WIDTH, height: DEFAULT_OG_IMAGE_HEIGHT }
      )
      .setAuthor(data.author || DEFAULT_META_AUTHOR)
      .setOgAuthor(data.ogAuthor || DEFAULT_META_AUTHOR)
      .setCanonicalUrl(data.canonicalUrl || '') // Only use canonical when required
      .setRobots(data.robots || 'all')
      .setNsfw(false)
      .setOgSiteName()
      .resetDynamicFavicon()
      .resetOEmbed();
  }

  private applyTitle(): void {
    if (this.counter) {
      this.titleService.setTitle(`(${maxNum(this.counter)}) ${this.title}`);
    } else {
      this.titleService.setTitle(this.title);
    }
    this.metaService.updateTag({
      property: 'og:title',
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
    fakeEl.innerHTML = this.domSanitizer.sanitize(SecurityContext.HTML, value);
    return fakeEl.textContent || fakeEl.innerText;
  }

  /**
   * Gets oEmbed URL for a given entity guid.
   * @param { entityGuid } - entityGuid
   * @returns { string } - full oEmbed url with encoded 'url' query parameter.
   */
  private getOEmbedUrl(entityGuid: string): string {
    const baseUrl = this.site.baseUrl;
    const encodedOEmbedUrl = encodeURIComponent(
      `${baseUrl}newsfeed/${entityGuid}`
    );
    return `${baseUrl}api/v3/oembed\?url=${encodedOEmbedUrl}`;
  }

  /**
   * Resets oEmbed link node.
   * @param { MetaService } - Chainable.
   */
  private resetOEmbed(): MetaService {
    const link = this.dom.head.querySelector('#oEmbed');

    if (link) {
      this.dom.head.removeChild(link);
    }
    return this;
  }

  setThemeColor(dark?: boolean): MetaService {
    this.metaService.updateTag({
      name: 'theme-color',
      content: dark ? '#1F252C' : '#ffffff',
    });
    return this;
  }
}
