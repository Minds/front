import { Inject } from '@angular/core';
import { Client } from './api';

export class TranslationService {
  constructor(
    @Inject(Client) public clientService: Client
  ) { }

  getLanguages(): Promise<any> {
    // TODO: Read localstorage cache
    
    return this.clientService.get(`api/v1/translation/languages`)
      .then((response: any) => {
        if (!response.languages) {
          throw new Error('No languages array');
        }

        // TODO: Cache in localstorage

        return response.languages;
      });
  }

  translate(guid, language): Promise<any> {
    return this.clientService.post(`api/v1/translation/translate/${guid}`, { language: language })
      .then((response: any) => {
        if (!response.translation) {
          throw new Error('No translation available');
        }

        // TODO: Cache in localstorage (???)

        return response.translation;
      });
  }
}