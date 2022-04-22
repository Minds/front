import { Injectable } from '@angular/core';
import { EMPTY, of, OperatorFunction } from 'rxjs';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { catchError, debounceTime, map, switchAll, tap } from 'rxjs/operators';
import { TextParserService } from '../../../common/services/text-parser.service';
import { EmbedLinkWhitelistService } from '../../../services/embed-link-whitelist.service';
/**
 * Rich embed structure
 */
export interface RichEmbed {
  url: string;
  entityGuid: string | null;
  title?: string;
  description?: string;
  thumbnail?: string;
}

/**
 * Service which helps resolving URLs onto rich embeds
 */
@Injectable()
export class RichEmbedService {
  /**
   * Constructor
   * @param api
   */
  constructor(
    protected api: ApiService,
    private textParser: TextParserService,
    private embedLinkWhitelist: EmbedLinkWhitelistService
  ) {}

  /**
   * Extracts a URL from a body of text
   * @param body
   */
  extract(body: string): string | null {
    const matches = this.textParser.extractUrls(body);
    return matches && typeof matches[0] !== 'undefined' ? matches[0] : null;
  }

  /**
   * Resolves a URL onto a rich embed using engine's preview endpoint
   */
  resolve(
    debounceMs: number
  ): OperatorFunction<RichEmbed | string | null, RichEmbed | null> {
    return input$ =>
      input$.pipe(
        debounceTime(debounceMs),
        map(urlOrRichEmbed => {
          if (!urlOrRichEmbed) {
            // If there's no URL, return a null value
            return of(null);
          } else if (typeof urlOrRichEmbed !== 'string') {
            // If not a string, passthru as is
            return of(urlOrRichEmbed);
          }

          urlOrRichEmbed = this.textParser.prependHttps(urlOrRichEmbed);

          // Request a preview metadata from engine
          return this.api
            .get('api/v1/newsfeed/preview', {
              url: urlOrRichEmbed,
            })
            .pipe(
              map(
                (response: ApiResponse): RichEmbed => {
                  // ... and cast it into a rich embed object
                  const richEmbed: RichEmbed = {
                    url: response.url,
                    entityGuid: null,
                    title: response.meta.title || '',
                    description: response.meta.description || '',
                  };

                  // Extract image from the first link thumbnail, which is usually the main image
                  if (
                    response.links &&
                    response.links.thumbnail &&
                    response.links.thumbnail[0]
                  ) {
                    richEmbed.thumbnail = response.links.thumbnail[0].href;
                  }

                  const videoHref = this.parseVideoHref(response);

                  if (
                    videoHref &&
                    this.embedLinkWhitelist.isWhitelisted(videoHref)
                  ) {
                    richEmbed.url = videoHref;
                  }

                  return richEmbed;
                }
              ),
              catchError(e => {
                console.error(e);
                return EMPTY;
              })
            );
        }),

        // Only subscribe to the latest HOO
        switchAll()
      );
  }

  /**
   * Will parse video href from an ApiResponse, or return an empty string if one is not present.
   * @param { ApiResponse } response - api response to parse.
   * @returns { string } - parsed video href.
   */
  private parseVideoHref(response: ApiResponse): string {
    return Array.isArray(response?.links?.player) &&
      response.links.player[0]['href']
      ? response.links.player[0]['href']
      : '';
  }
}
