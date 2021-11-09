import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CompassService } from '../compass.service';

@Component({
  selector: 'm-compassForm',
  templateUrl: './compass-form.component.html',
  styleUrls: ['./compass-form.component.ng.scss'],
})
export class CompassFormComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  saving: boolean = false;
  init: boolean = false;
  questions: any;
  form;

  constructor(public compassService: CompassService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.compassService.questions$.subscribe(questions => {
        console.log('ojm questions subscription', questions);

        if (!questions || !questions.length) {
          this.compassService.fetchQuestions();
        } else {
          this.questions = questions;
          this.setupForm();
        }
      })
    );
    this.subscriptions.push(
      this.compassService.saving$.subscribe(saving => {
        this.saving = saving;
      })
    );
    this.subscriptions.push(
      this.compassService.submitRequested$.subscribe(requested => {
        if (requested) {
          this.submit();
        }
      })
    );
  }

  setupForm(): void {
    const controls: any = {};

    // Make a form control for each question
    this.questions.forEach(q => {
      controls[q.questionId] = new FormControl(q.currentValue, {
        validators: [
          Validators.min(q.minimumRangeValue),
          Validators.max(q.maximumRangeValue),
        ],
      });
    });

    this.form = new FormGroup(controls);

    this.init = true;
  }

  setAnswers(): void {
    const answers = {};
    this.questions.forEach(q => {
      answers[q.questionId] = this.form.get(q.questionId).value;
    });

    console.log('ojmanswers', answers);

    this.compassService.answers$.next(answers);
  }

  async submit(): Promise<void> {
    if (this.canSubmit) {
      this.setAnswers();

      const saved = await this.compassService.saveAnswers();

      if (saved) {
        await this.compassService.fetchQuestions();
        this.compassService.submitRequested$.next(false);
        // ojm todo : do I need to set form as pristine?
        // aka this.form.markAsPristine();
      }
      // reset the form
    }
  }

  canSubmit(): boolean {
    return !this.saving && this.form.valid && !this.form.pristine;
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
