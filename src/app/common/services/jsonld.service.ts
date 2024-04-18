// Credit https://javascript.plainenglish.io/how-to-use-json-ld-for-advanced-seo-in-angular-63528c98bb91

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as moment from 'moment';
import { ConfigsService } from './configs.service';
import { SiteService } from './site.service';

@Injectable({
  providedIn: 'root',
})
export class JsonLdService {
  readonly scriptType: string = 'application/ld+json';
  readonly siteUrl: string;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private site: SiteService,
    configs: ConfigsService
  ) {
    this.siteUrl = configs.get('site_url');
  }

  removeStructuredData(): void {
    const els = [];
    // An array in case we want to start adding add'l schemass
    ['m-structuredData--video', 'm-structuredData--image'].forEach(
      (className) => {
        els.push(
          ...Array.from(this._document.head.getElementsByClassName(className))
        );
      }
    );
    els.forEach((el) => this._document.head.removeChild(el));
  }

  // Check that an element with the same class name doesn’t exist in the DOM,
  // then either creates a new script element to interact with
  // or uses the already existing one.
  insertSchema(schema: any, className = 'm-structuredData--video'): void {
    let script;
    let shouldAppend = false;
    if (this._document.head.getElementsByClassName(className).length) {
      script = this._document.head.getElementsByClassName(className)[0];
    } else {
      script = this._document.createElement('script');
      shouldAppend = true;
    }
    script.setAttribute('class', className);
    script.type = this.scriptType;
    script.text = JSON.stringify(schema);
    if (shouldAppend) {
      this._document.head.appendChild(script);
    }
  }

  getVideoSchema(entity: any): any {
    if (!entity || entity.subtype !== 'video') {
      return;
    }

    const fallback = `@${entity.ownerObj.username}'s video on ${this.site.title}`;
    const parsedDesc = this.parseDescriptionText(entity.description);

    /**
     * Required properties:
     *  name
     *  description
     *  thumbnailUrl
     *  uploadDate
     * */
    return {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: entity.title && entity.title.length ? entity.title : fallback,
      description: parsedDesc.length ? parsedDesc : fallback,
      thumbnailUrl: [entity.thumbnail_src],
      uploadDate: this.getISODate(entity.time_created * 1000),
      contentUrl: entity.src['720.mp4'] ?? entity.src['360.mp4'],
    };
  }

  /**
   *
   * @param entity
   * @param title the current value used for the og:title field
   * @param description the current value used for the og:description field
   */
  getImageSchema(entity: any, title: string, description: string): any {
    if (!entity || !entity.custom_type || entity.custom_type !== 'batch') {
      return;
    }

    const parsedDesc = this.parseDescriptionText(description);

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SocialMediaPosting',
      headline: title,
      'sharedContent:headline': title,
      articleBody: parsedDesc,
      image: entity.custom_data[0].src,
      datePublished: this.getISODate(entity.time_created * 1000),
      'author:@type': 'Person',
      'author:name': entity.ownerObj.username,
      'author:url': `${this.siteUrl}${entity.ownerObj.username}/`,
      'sharedContent:@type': 'WebPage',
      'sharedContent:url': `${this.siteUrl}newsfeed/${entity.guid}/`,
      'mainEntityOfPage:type': 'WebPage',
      'mainEntityOfPage:id': `${this.siteUrl}newsfeed/${entity.guid}/`,
    };

    return schema;
  }

  getISODate(ts): string {
    return moment(ts).toISOString();
  }

  parseDescriptionText(desc): string {
    if (!desc) {
      return '';
    }

    // Strip out xml and rich embed tags
    const regex = /<[^>]+>/g;
    let text = desc.replaceAll(regex, '');

    // Strip out new line markup
    text = text.replaceAll('\n', ' ');

    return text;
  }
}
