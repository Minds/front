import { Component, OnInit } from '@angular/core';
import noOp from '../../../helpers/no-op';
import { CompassService } from '../compass.service';

@Component({
  selector: 'm-compassQuestionnaire__modal',
  templateUrl: './compass-questionnaire-modal.component.html',
  styleUrls: ['./compass-questionnaire-modal.component.ng.scss'],
})
export class CompassQuestionnaireModalComponent {
  constructor(public compassService: CompassService) {}

  submit($event): void {
    this.compassService.submitRequested$.next(true);
  }
}
