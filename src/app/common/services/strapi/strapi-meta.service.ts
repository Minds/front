import { Injectable, Inject } from '@angular/core';
import { MetaService } from '../meta.service';
import { STRAPI_URL } from '../../injection-tokens/url-injection-tokens';

// metadata type.
export type StrapiMetadata = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  robots?: string;
  author?: string;
  ogAuthor?: string;
  ogUrl?: string;
  ogType?: string;
  ogImage?: {
    data?: StrapiImageData;
  };
};

// image data type.
export type StrapiImageData = {
  attributes?: {
    url: string;
    height?: number;
    width?: number;
  };
};

// snippet for inclusion within queries to get Strapi data.
export const STRAPI_METADATA_SNIPPET = `
  metadata {
    title
    description
    canonicalUrl
    robots
    author
    ogUrl
    ogType
    ogAuthor
    ogImage {
      data {
        attributes {
          url
          height
          width
        }
      }
    }
  }
`;

/**
 * Service used to take apply Strapi provided Metadata to the current page.
 * To use, include the above STRAPI_METADATA_SNIPPET in your query
 * and pass the resulting StrapiMetadata returned into the apply function of this class.
 */
@Injectable({ providedIn: 'root' })
export class StrapiMetaService {
  constructor(
    private meta: MetaService,
    @Inject(STRAPI_URL) private strapiUrl: string
  ) {}

  /**
   * Applies metadata from Strapi to the current page.
   * @param { StrapiMetadata } data - metadata to apply.
   * @returns { void }
   */
  public apply(data: StrapiMetadata): void {
    if (!data) {
      return;
    }

    if (data.title) {
      this.meta.setTitle(data.title);
    }
    if (data.description) {
      this.meta.setDescription(data.description);
    }
    if (data.canonicalUrl) {
      this.meta.setCanonicalUrl(data.canonicalUrl);
    }
    if (data.robots) {
      this.meta.setRobots(data.robots);
    }
    if (data.author) {
      this.meta.setAuthor(data.author);
    }
    if (data.ogAuthor) {
      this.meta.setOgAuthor(data.ogAuthor);
    }
    if (data.ogUrl) {
      this.meta.setOgUrl(data.ogUrl);
    }
    if (data.ogType) {
      this.meta.setOgType(data.ogType);
    }
    if (data.ogImage?.data?.attributes?.url) {
      const imageData: StrapiImageData = data.ogImage.data;
      this.meta.setOgImage(this.parseImageUrl(imageData), {
        height: imageData.attributes.height ?? 1200,
        width: imageData.attributes.width ?? 1200,
      });
    }
  }

  /**
   * Parses StrapiImageData to add base URL such that it is a valid absolute image URL.
   * @returns { string } valid image URL.
   */
  private parseImageUrl(data: StrapiImageData): string {
    return this.strapiUrl + data.attributes.url;
  }
}
