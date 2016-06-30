import { Inject } from '@angular/core';
import { Client } from './api';
import { Storage } from './storage';

export class TranslationService {
  constructor(
    @Inject(Client) private clientService: Client,
    @Inject(Storage) private storage: Storage
  ) {
    this.load();
  }

  private languagesReady: Promise<any>;

  private load() {
    this.getLanguages(); // Initial caching
  }

  getLanguages(): Promise<any> {
    let target = 'en'; // TODO: Set target to get translated names (when i18n is in place)

    if (!this.languagesReady) {
      let cached = this.storage.get(`translation:languages:${target}`);

      if (cached) {
        this.languagesReady = Promise.resolve(JSON.parse(cached));
      } else {
        this.languagesReady = this.clientService.get(`api/v1/translation/languages`, { target })
          .then((response: any) => {
            if (!response.languages) {
              throw new Error('No languages array');
            }

            this.storage.set(`translation:languages:${target}`, JSON.stringify(response.languages));

            return response.languages;
          })
          .catch(e => [ ]);
      }
    }

    return this.languagesReady;
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

    // Message should exist and have content
    if (typeof entity.message !== 'undefined' && entity.message) {
      return true;
    }

    return false;
  }

  translate(guid, language): Promise<any> {
    return this.clientService.get(`api/v1/translation/translate/${guid}`, { target: language })
      .then((response: any) => {
        if (!response.translation) {
          throw new Error('No translation available');
        }

        return response.translation;
      });
  }
}