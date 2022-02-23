import { Component } from '@angular/core';
import { CompassService } from '../compass.service';

@Component({
  selector: 'm-compassQuestionnaire__modal',
  templateUrl: './questionnaire-modal.component.html',
  styleUrls: ['./questionnaire-modal.component.ng.scss'],
})
export class CompassQuestionnaireModalComponent {
  constructor(public compassService: CompassService) {}

  submit($event): void {
    this.compassService.submitRequested$.next(true);
  }

  setModalData() {}
}
