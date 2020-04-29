import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';

import { FaqComponent } from './faq.component';
import { FaqService } from './faq.service';

const faqRoutes = [
  { path: 'faq/:category', redirectTo: '/help' },
  { path: 'faq', redirectTo: '/help' },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(faqRoutes),
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [FaqComponent],
  exports: [FaqComponent],
  providers: [FaqService],
})
export class FaqModule {}
