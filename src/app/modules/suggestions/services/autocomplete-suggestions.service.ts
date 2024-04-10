import { Injectable } from '@angular/core';
import { Client } from '../../../services/api/client';
import autobind from '../../../helpers/autobind';

@Injectable()
export class AutocompleteSuggestionsService {
  constructor(private client: Client) {}

  @autobind()
  async findSuggestions(searchText: string, triggerCharacter: string) {
    if (searchText == '') return;

    let url = 'api/v2/search/suggest';

    if (triggerCharacter === '#') {
      url += '/tags';
    }
    const response: any = await this.client.get(url, { q: searchText });

    let result;
    switch (triggerCharacter) {
      case '#':
        result = response.tags.filter((item) =>
          item.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      case '@':
        result = response.entities.filter((item) =>
          item.username.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
    }

    return result.slice(0, 5);
  }

  getChoiceLabel(choice: any, triggerCharacter: string) {
    let text = '';
    if (typeof choice === 'string') {
      text = choice;
    } else if (choice.type && choice.type == 'user') {
      text = choice.username;
    }
    return `${triggerCharacter}${text}`;
  }
}
