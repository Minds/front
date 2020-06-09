import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { LanguageModalComponent } from './language-modal/language-modal.component';
import { LanguageBarComponent } from './language-bar.component';
import { LanguageService } from './language.service';
import { LanguageModalService } from './language-modal/language-modal.service';
import { LanguageSidebarPromptComponent } from './prompts/sidebar-prompt.component';
import { CommonModule } from '../../common/common.module';

@NgModule({
  imports: [NgCommonModule, CommonModule],
  declarations: [
    LanguageModalComponent,
    LanguageBarComponent,
    LanguageSidebarPromptComponent,
  ],
  exports: [LanguageBarComponent, LanguageSidebarPromptComponent],
  providers: [LanguageService, LanguageModalService],
})
export class LanguageModule {}
