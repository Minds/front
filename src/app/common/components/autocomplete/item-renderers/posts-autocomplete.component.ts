import { Component, Input, OnInit } from '@angular/core';
import { ConfigsService } from '../../../services/configs.service';

/**
 * Renders suggestions for autocomplete dropdown menu.
 * The suggested item (choice) can be either
 * a user (avatar + username) or a hashtag.
 *
 * Also listens to when a choice is selected
 */
@Component({
  selector: 'm-post-autocomplete-item-renderer',
  templateUrl: 'posts-autocomplete.component.html',
})
export class PostsAutocompleteItemRendererComponent {
  @Input() choice;
  @Input() selectChoice;

  readonly cdnUrl: string;

  constructor(configs: ConfigsService) {
    this.cdnUrl = configs.get('cdn_url');
  }
}
