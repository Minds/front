/* taken from https://github.com/mattlewis92/angular-text-input-autocomplete */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputAutocompleteDirective } from './text-input-autocomplete.directive';
import { TextInputAutocompleteContainerComponent } from './text-input-autocomplete-container.component';
import { TextInputAutocompleteMenuComponent } from './text-input-autocomplete-menu.component';
import { PostsAutocompleteItemRendererComponent } from './item-renderers/posts-autocomplete.component';

@NgModule({
  declarations: [
    TextInputAutocompleteDirective,
    TextInputAutocompleteContainerComponent,
    TextInputAutocompleteMenuComponent,
    PostsAutocompleteItemRendererComponent,
  ],
  imports: [CommonModule],
  exports: [
    TextInputAutocompleteDirective,
    TextInputAutocompleteContainerComponent,
    TextInputAutocompleteMenuComponent,
    PostsAutocompleteItemRendererComponent,
  ],
  entryComponents: [TextInputAutocompleteMenuComponent],
})
export class TextInputAutocompleteModule {}
