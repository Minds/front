import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupermindButtonComponent } from './supermind-button/supermind-button.component';
import { SupermindBannerComponent } from './supermind-banner/supermind-banner.component';

@NgModule({
  imports: [NgCommonModule, FormsModule, ReactiveFormsModule, CommonModule],
  declarations: [SupermindButtonComponent, SupermindBannerComponent],
  exports: [SupermindButtonComponent, SupermindBannerComponent],
})
export class SupermindSharedModule {}
