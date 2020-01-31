import { Component, Input, OnInit } from '@angular/core';
import { ConfigsService } from '../../../services/configs.service';

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
