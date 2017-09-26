import { Component, Output, Input, EventEmitter } from '@angular/core';

import { Client } from '../../../services/api';

@Component({
  selector: 'm-captcha',
  templateUrl: 'captcha.component.html'
})

export class CaptchaComponent {

  answer: string | number;
  @Output('answer') emit: EventEmitter<any> = new EventEmitter();
  inProgress: boolean = false;

  type: string = 'sum';
  question: Array<string | number>;
  nonce: number;
  hash: string = '';
  interval;

  constructor(public client: Client) {
  }

  ngOnInit() {
    this.get();
    this.interval = setInterval(this.get, (1000 * 60 * 4)); //refresh every 4 minutes
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  get() {
    this.client.get('api/v1/captcha')
      .then((response: any) => {
        this.type = response.question.type;
        this.question = response.question.question;

        this.nonce = response.question.nonce;
        this.hash = response.question.hash;
      });
  }

  validate() {
    let payload = { type: this.type, question: this.question, answer: this.answer, nonce: this.nonce, hash: this.hash };
    this.emit.next(JSON.stringify(payload));

    this.client.post('api/v1/captcha', payload)
      .then((response: any) => {
        if (response.success)
          console.log('success');
        else
          console.log('error');
      });
  }

}
