import {
  Injectable,
  Optional,
  Inject,
  SecurityContext,
  ElementRef,
} from '@angular/core';
import { Title, Meta, DomSanitizer } from '@angular/platform-browser';
import { SiteService } from './site.service';
import { Location } from '@angular/common';
import { ConfigsService } from './configs.service';
import { DOCUMENT } from '@angular/common';
import maxNum from '../../helpers/max';
import { IS_TENANT_NETWORK } from '../injection-tokens/tenant-injection-tokens';
import { HORIZONTAL_LOGO_PATH as DEFAULT_TENANT_HORIZONTAL_LOGO } from '../../modules/multi-tenant-network/services/config-image.service';

const DEFAULT_META_TITLE = 'Minds';
const DEFAULT_META_DESCRIPTION = '...';
export const MIN_METRIC_FOR_ROBOTS = 5;
const DEFAULT_META_AUTHOR = 'Minds';
const DEFAULT_OG_IMAGE = '/assets/og-images/default-v3.png';
const DEFAULT_OG_IMAGE_WIDTH = 1200;
const DEFAULT_OG_IMAGE_HEIGHT = 1200;
const DEFAULT_FAVICON = '/static/en/assets/logos/bulb.svg';
const DEFAULT_TENANT_FAVICON = '/api/v3/multi-tenant/configs/image/favicon';

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
    private domSanitizer: DomSanitizer,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork: boolean
  ) {
    this.reset();
  }

  get defaultTitle(): string {
    return this.isTenantNetwork
      ? this.configs.get<string>('site_name')
      : DEFAULT_META_TITLE;
  }

  get defaultAuthor(): string {
    return this.isTenantNetwork
      ? this.configs.get<string>('site_name')
      : DEFAULT_META_AUTHOR;
  }

  /**
   * Set both the og:title and the page title
   * with a given value
   *
   * If join is true,  append " | Minds" to the end
   */
  setTitle(value: string, join = true): MetaService {
    value = this.stripHtml(value);
    this.ogTitle = this.getOgTitle(value, join);
    this.setPageTitle(value, join);
    this.applyTitle();
    return this;
  }

  public getOgTitle(value: string, join = true): string {
    let ogTitle: string;

    if (!value) {
      ogTitle = this.defaultTitle;
    } else {
      ogTitle = value.trim();

      // For extra long strings, replaee last 3 chars with ellipsis
      const cutoffLength = join ? 242 : 250;
      if (ogTitle.length > 242) {
        ogTitle = ogTitle.substring(0, cutoffLength - 3) + '...';
      }

      if (join) {
        // Add ' | Minds' to the end of every og:title
        ogTitle = ogTitle + `${this.sep}${this.defaultTitle}`;
      }
    }

    return ogTitle;
  }

  setPageTitle(value: string, join = true): MetaService {
    let title;
    if (value.length > 60) {
      value = value.substring(0, 57) + '...';
    }

    if (value && join) {
      title = [value, this.defaultTitle]
        .filter((fragment) => Boolean(fragment))
        .join(this.sep);
    } else if (value) {
      title = value;
    } else {
      title = this.defaultTitle;
    }

    this.title = title;
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

  /**
   * Set thumbnail metatag.
   * @param { string } value - value to set to - will default to match the default og image.
   * @returns { MetaService }
   */
  public setThumbnail(value: string = ''): MetaService {
    if (!value || value?.length < 1) {
      value = DEFAULT_OG_IMAGE;
    }

    if (value.indexOf('/') === 0) {
      value = this.configs.get('cdn_assets_url') + value.substr(1);
    }

    this.metaService.updateTag({ name: 'thumbnail', content: value });
    return this;
  }

  setCounter(value: number): MetaService {
    this.counter = value;
    this.applyTitle();
    return this;
  }

  setCanonicalUrl(value: string): MetaService {
    // Find and clear or canonical links
    const links: HTMLLinkElement[] =
      this.dom.head.querySelectorAll('[rel="canonical"]');
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
   * Used for pro / tenant domains
   */
  setDynamicFavicon(href: string): MetaService {
    const existingDynamicFavicon =
      this.dom.head.querySelector('#dynamicFavicon');
    const favicon = this.dom.head.querySelector('#favicon');

    // remove default favicon if present.
    if (favicon) {
      this.dom.head.removeChild(favicon);
    }

    // if there is already a dynamic favicon, change the href
    // else create a new one.
    if (existingDynamicFavicon) {
      existingDynamicFavicon.setAttribute('href', href);
    } else {
      const link: HTMLLinkElement = this.dom.createElement('link');
      link.setAttribute('rel', 'icon');
      link.setAttribute('type', 'image/png');
      link.setAttribute('href', href);
      link.setAttribute('id', 'dynamicFavicon');
      this.dom.head.appendChild(link);
    }

    const appleTouchLogo: ElementRef =
      this.dom.head.querySelector('#appleTouchIcon');
    if (appleTouchLogo) {
      this.dom.head.removeChild(appleTouchLogo);
    }

    const icon32: ElementRef = this.dom.head.querySelector('#icon32');
    if (icon32) {
      this.dom.head.removeChild(icon32);
    }

    const icon16: ElementRef = this.dom.head.querySelector('#icon16');
    if (icon16) {
      this.dom.head.removeChild(icon16);
    }

    return this;
  }

  resetDynamicFavicon(): MetaService {
    const favicon = this.dom.head.querySelector('#favicon');
    const dynamicFaviconLink = this.dom.head.querySelector('#dynamicFavicon');

    // remove any dynamic favicons.
    if (dynamicFaviconLink) {
      this.dom.head.removeChild(dynamicFaviconLink);
    }

    // re-add default favicon.
    if (!favicon) {
      let link: HTMLLinkElement = this.dom.createElement('link');
      link.setAttribute('rel', 'icon');
      link.setAttribute('type', 'image/svg');
      link.setAttribute('href', DEFAULT_FAVICON);
      link.setAttribute('id', 'favicon');

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

  setTwitterSummaryCard(
    title: string,
    imageUrl: string,
    description?: string
  ): MetaService {
    // Required

    this.metaService.updateTag({
      name: 'twitter:title',
      content: title,
    });

    this.metaService.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });

    // Optional

    if (description) {
      this.metaService.updateTag({
        name: 'twitter:description',
        content: description,
      });
    }

    this.metaService.updateTag({
      name: 'twitter:image',
      content: imageUrl,
    });

    this.metaService.updateTag({
      name: 'twitter:site',
      //content: this.site.title,
      content: '@minds', // TODO: don't hard code this
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
      .setAuthor(data.author || this.defaultAuthor)
      .setOgAuthor(data.ogAuthor || this.defaultAuthor)
      .setCanonicalUrl(data.canonicalUrl || '') // Only use canonical when required
      .setRobots(data.robots || 'all')
      .setNsfw(false)
      .setOgSiteName()
      .resetTwitterCard()
      .resetDynamicFavicon()
      .resetOEmbed();

    if (this.isTenantNetwork) {
      this.setDynamicFavicon(
        `${DEFAULT_TENANT_FAVICON}?lastCache=${
          this.configs.get<number>('last_cache') ?? 0
        }`
      )
        .setOgImage(DEFAULT_TENANT_HORIZONTAL_LOGO)
        .setThumbnail(DEFAULT_TENANT_HORIZONTAL_LOGO);
    } else {
      this.setThumbnail(data.ogImage ?? DEFAULT_OG_IMAGE).setOgImage(
        data.ogImage || DEFAULT_OG_IMAGE,
        data.ogImage
          ? data.ogImageWidth && data.ogImageHeight
            ? {
                width: data.ogImageWidth,
                height: data.ogImageHeight,
              }
            : null
          : { width: DEFAULT_OG_IMAGE_WIDTH, height: DEFAULT_OG_IMAGE_HEIGHT }
      );
    }
  }

  private applyTitle(): void {
    if (this.counter && this.counter > 0) {
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

  /**
   * Resets twitter values
   * @returns MetaService
   */
  private resetTwitterCard(): MetaService {
    const tagNames = [
      'twitter:title',
      'twitter:card',
      'twitter:description',
      'twitter:image',
      'twitter:site',
    ];

    for (let tagName of tagNames) {
      this.metaService.removeTag(`name='${tagName}'`);
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
