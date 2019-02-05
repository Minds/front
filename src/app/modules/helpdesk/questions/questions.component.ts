import { Component, OnInit } from '@angular/core';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'm-helpdesk--questions',
  templateUrl: 'questions.component.html'
})

export class QuestionsComponent implements OnInit {

  question: any = {};

  minds: Minds = window.Minds;

  constructor(
    public client: Client,
    public session: Session,
    public router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.load(params['uuid']);
    });
  }

  async load(uuid: string) {
    this.question = {};

    try {
      const response: any = await this.client.get(`api/v2/helpdesk/questions/question/${uuid}`);
      this.question = response.question;
    } catch (e) {
      console.error(e);
    }
  }

  hasVoted(direction: 'up' | 'down') {
    return this.question[`thumb_${direction}`] === true;
  }

  async castVote(direction: 'up' | 'down') {
    const key = `thumb_${direction}`;
    this.question[key] = !this.question[key];

    try {
      if (this.question[key]) {
        await this.client.put(`api/v2/helpdesk/questions/${this.question.uuid}/${direction}`);
      } else {
        await this.client.delete(`api/v2/helpdesk/questions/${this.question.uuid}/${direction}`);
      }
    } catch (e) {
      console.error(e);
      this.question[key] = !this.question[key];
    }
  }

}
