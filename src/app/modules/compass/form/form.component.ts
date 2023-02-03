import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { CompassService } from '../compass.service';

@Component({
  selector: 'm-compassForm',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.ng.scss'],
})
export class CompassFormComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  init: boolean = false;
  questions: any;
  form;

  constructor(public compassService: CompassService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.compassService.questions$.subscribe(questions => {
        if (!questions || !questions.length) {
          this.compassService.fetchQuestions();
        } else {
          this.questions = questions;
          this.setupForm();
        }
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
      controls[q.questionId] = new UntypedFormControl(q.currentValue, {
        validators: [
          Validators.min(q.minimumRangeValue),
          Validators.max(q.maximumRangeValue),
        ],
      });
    });

    this.form = new UntypedFormGroup(controls);

    this.init = true;
  }

  setAnswers(): void {
    const answers = {};
    this.questions.forEach(q => {
      answers[q.questionId] = this.form.get(q.questionId).value;
    });

    this.compassService.answers$.next(answers);
  }

  async submit(): Promise<void> {
    if (this.canSubmit()) {
      this.setAnswers();

      await this.compassService.saveAnswers();
    }
  }

  canSubmit(): boolean {
    return this.form.valid && !this.form.pristine;
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
