import { Component, Input } from '@angular/core';

@Component({
  selector: 'm-faq',
  templateUrl: 'faq.component.html'
})

export class FaqComponent {

  @Input() question = '';
  showAnswer: boolean = false;

  toggleAnswer() {
    this.showAnswer = !this.showAnswer;
  }

}
