import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { LanguageModalComponent } from './language-modal/language-modal.component';
import { LanguageBarComponent } from './language-bar.component';

@NgModule({
  imports: [NgCommonModule],
  declarations: [LanguageModalComponent, LanguageBarComponent],
  exports: [LanguageBarComponent],
  entryComponents: [LanguageModalComponent],
})
export class LanguageModule {}
