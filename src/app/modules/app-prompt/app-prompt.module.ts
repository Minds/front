import { AppPromptService } from './app-prompt.service';
import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { AppPromptComponent } from './app-prompt.component';

@NgModule({
  declarations: [AppPromptComponent],
  exports: [AppPromptComponent],
  imports: [NgCommonModule, CommonModule],
  providers: [AppPromptService],
})
export class AppPromptModule {}
