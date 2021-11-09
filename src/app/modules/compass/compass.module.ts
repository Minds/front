import { NgModule } from '@angular/core';

import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { CompassFormComponent } from './compass-form/compass-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompassService } from './compass.service';

import { CompassQuestionnaireModalComponent } from './compass-questionnaire-modal/compass-questionnaire-modal.component';
import { CompassQuestionnaireBannerComponent } from './compass-questionnaire-banner/compass-questionnaire-banner.component';

@NgModule({
  imports: [NgCommonModule, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [
    CompassFormComponent,
    CompassQuestionnaireModalComponent,
    CompassQuestionnaireBannerComponent,
  ],
  exports: [
    CompassFormComponent,
    CompassQuestionnaireModalComponent,
    CompassQuestionnaireBannerComponent,
  ],
  providers: [CompassService],
})
export class CompassModule {}
