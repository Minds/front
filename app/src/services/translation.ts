import { Inject } from '@angular/core';
import { Client } from './api';
import { Storage } from './storage';

export class TranslationService {
  private defaultLanguage: string;

  constructor(
    @Inject(Client) private clientService: Client,
    @Inject(Storage) private storage: Storage
  ) {
    this.defaultLanguage = 'en'; // TODO: Set to get translated names (when i18n is in place)
    this.load();
  }

  private languagesReady: Promise<any>;

  private load() {
    this.getLanguages(); // Initial caching
  }

  getLanguages(): Promise<any> {
    if (!this.languagesReady) {
      let cached = this.storage.get(`translation:languages:${this.defaultLanguage}`);

      if (cached) {
        cached = JSON.parse(cached);
      }

      if (cached && cached.length > 0) {
        this.languagesReady = Promise.resolve(cached);
      } else {
        this.languagesReady = this.clientService.get(`api/v1/translation/languages`, { target: this.defaultLanguage })
          .then((response: any) => {
            if (!response.languages) {
              throw new Error('No languages array');
            }

            this.storage.set(`translation:languages:${this.defaultLanguage}`, JSON.stringify(response.languages));

            return response.languages;
          })
          .catch(e => [ ]);
      }
    }

    return this.languagesReady;
  }

  purgeLanguagesCache() {
    this.languagesReady = void 0;
    this.storage.set(`translation:languages:${this.defaultLanguage}`, '');
  }

  getLanguageName(query: string): Promise<string> {
    if (!query) {
      return Promise.resolve('None');
    }

    return this.getLanguages()
      .then((languages: any[]) => {
        let result: string = 'Unknown';

        languages.forEach((language: any) => {
          if (language.language == query) {
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
      (
        (typeof entity.title !== 'undefined' && entity.title) ||
        (typeof entity.blurb !== 'undefined' && entity.blurb)
      )
    ) {
      return true;
    }

    return false;
  }

  translate(guid, language): Promise<any> {
    return this.clientService.get(`api/v1/translation/translate/${guid}`, { target: language })
      .then((response: any) => {
        if (response.purgeLanguagesCache) {
          this.purgeLanguagesCache();
        }

        if (!response.translation) {
          throw new Error('No translation available');
        }

        return response.translation;
      });
  }
}