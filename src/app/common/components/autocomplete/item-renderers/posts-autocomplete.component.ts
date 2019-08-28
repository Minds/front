import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'm-post-autocomplete-item-renderer',
  templateUrl: 'posts-autocomplete.component.html',
})
export class PostsAutocompleteItemRendererComponent {
  @Input() choice;
  @Input() selectChoice;

  minds = window.Minds;
}
