// Credit https://javascript.plainenglish.io/how-to-use-json-ld-for-advanced-seo-in-angular-63528c98bb91

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class JsonLdService {
  readonly scriptType: string = 'application/json+ld';

  constructor(@Inject(DOCUMENT) private _document: Document) {}

  removeStructuredData(): void {
    const els = [];
    // An array in case we want to start adding add'l schemass
    ['m-structuredData--video'].forEach(className => {
      els.push(
        ...Array.from(this._document.head.getElementsByClassName(className))
      );
    });
    els.forEach(el => this._document.head.removeChild(el));
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

    const fallback = `@${entity.ownerObj.username}'s video on Minds`;
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
