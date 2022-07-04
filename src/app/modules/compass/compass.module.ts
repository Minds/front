import { NgModule } from '@angular/core';

import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { CompassFormComponent } from './form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompassService } from './compass.service';

import { CompassQuestionnaireModalComponent } from './questionnaire-modal/questionnaire-modal.component';

@NgModule({
  imports: [NgCommonModule, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [CompassFormComponent, CompassQuestionnaireModalComponent],
  exports: [CompassFormComponent, CompassQuestionnaireModalComponent],
  providers: [CompassService],
})
export class CompassModule {}
