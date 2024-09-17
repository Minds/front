import { Injectable } from '@angular/core';

// Names of sites whitelisted.
type EmbeddableSite =
  | 'odysee'
  | 'rumble'
  | 'livepeer'
  | 'livepeerLegacy'
  | 'scribd';

// Struct of key, val regex map.
type EmbedLinkMap = {
  [key in EmbeddableSite]: RegExp;
};

/**
 * Whitelist of sites for which we can take and convert the provided
 * embed link from metadata.
 */
@Injectable({ providedIn: 'root' })
export class EmbedLinkWhitelistService {
  // map of site name => regex
  private regexMap: EmbedLinkMap = {
    odysee: /^(?:https?:\/\/)?(?:www\.)?odysee\.com\/\$\/embed\/((.+)\/.+)/i,
    rumble: /^(?:https?:\/\/)?(?:www\.)?rumble\.com\/\embed\/([\w\d]+)/i,
    livepeerLegacy:
      /^(http(s)?:\/\/)?(www\.)?minds-player\.withlivepeer\.com\?v=([a-zA-Z0-9]+)$/,
    livepeer:
      /^(http(s)?:\/\/)?(www\.)?minds-player\.vercel\.app\?v=([a-zA-Z0-9]+)$/,
    scribd: /^(?:https?:\/\/)?(?:www\.)?scribd\.com\/document\/(\d+)/i,
  };

  /**
   * true if link is whitelisted.
   * @param { string } link - link to check.
   * @returns { boolean } - true if link is whitelisted.
   */
  public isWhitelisted(link: string): boolean {
    for (const [key, regex] of Object.entries(this.regexMap)) {
      if (regex.test(link)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets regex from regex map by key.
   * @param { EmbeddableSite } key - key to get by.
   * @returns { RegExp } - regex to validate the sites embed link.
   */
  public getRegex(key: EmbeddableSite): RegExp {
    return this.regexMap[key];
  }
}
