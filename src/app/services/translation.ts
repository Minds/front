import { Inject, PLATFORM_ID } from '@angular/core';
import { Client } from './api';
import { Storage } from './storage';
import { isPlatformBrowser } from '@angular/common';

export class TranslationService {
  private defaultLanguage: string;
  private languagesReady: Promise<any>;

  static _(client: Client, storage: Storage, platformId: Object) {
    return new TranslationService(client, storage, platformId);
  }

  constructor(
    @Inject(Client) private clientService: Client,
    @Inject(Storage) private storage: Storage,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.defaultLanguage = 'en'; // TODO: Set to get translated names (when i18n is in place)
    if (isPlatformBrowser(platformId)) this.load();
  }

  getLanguages(): Promise<any> {
    if (!this.languagesReady) {
      let cached = this.storage.get(
        `translation:languages:${this.defaultLanguage}`
      );

      if (cached) {
        cached = JSON.parse(cached);
      }

      if (cached && cached.length > 0) {
        this.languagesReady = Promise.resolve(cached);
      } else {
        this.languagesReady = this.clientService
          .get(`api/v1/translation/languages`, { target: this.defaultLanguage })
          .then((response: any) => {
            if (!response.languages) {
              throw new Error('No languages array');
            }

            this.storage.set(
              `translation:languages:${this.defaultLanguage}`,
              JSON.stringify(response.languages)
            );
            this.storage.set(`translation:userDefault`, response.userDefault);

            return response.languages;
          })
          .catch(e => []);
      }
    }

    return this.languagesReady;
  }

  getUserDefaultLanguage(): Promise<any> {
    return this.getLanguages().then(() => {
      let lang = this.storage.get(`translation:userDefault`);

      if (lang === 'null') {
        // Some users have the default language cache tainted
        lang = null;
      }

      return lang;
    });
  }

  purgeLanguagesCache() {
    this.languagesReady = void 0;
    this.storage.set(`translation:languages:${this.defaultLanguage}`, '');
    this.storage.set(`translation:userDefault`, null);
  }

  getLanguageName(query: string): Promise<string> {
    if (!query) {
      return Promise.resolve('None');
    }

    return this.getLanguages().then((languages: any[]) => {
      let result: string = 'Unknown';

      languages.forEach((language: any) => {
        if (language.language === query) {
          result = language.name;
        }
      });

      return result;
    });
  }

  isTranslatable(entity): boolean {
    if (typeof entity !== 'object') {
      return false;
    }

    if (!entity.guid) {
      return false;
    }

    // Message should exist and have content
    if (typeof entity.message !== 'undefined' && entity.message) {
      return true;
    } else if (entity.type === 'comment' && entity.description) {
      return true;
    } else if (
      entity.custom_type &&
      ((typeof entity.title !== 'undefined' && entity.title) ||
        (typeof entity.blurb !== 'undefined' && entity.blurb))
    ) {
      return true;
    }

    return false;
  }

  translate(guid, language): Promise<any> {
    return this.clientService
      .get(`api/v1/translation/translate/${guid}`, { target: language })
      .then((response: any) => {
        // Optimistically set default language
        if (!this.storage.get(`translation:userDefault`)) {
          this.storage.set(`translation:userDefault`, language);
        }

        if (response.purgeLanguagesCache) {
          this.purgeLanguagesCache();
        }

        if (
          !response.translation ||
          Object.keys(response.translation).length == 0
        ) {
          throw new Error('No translation available');
        }

        return response.translation;
      });
  }

  private load() {
    this.getLanguages(); // Initial caching
  }
}
