import { Component, Input, OnInit } from '@angular/core';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'm-helpdesk--questions--suggested',
  templateUrl: 'suggested.component.html',
})
export class SuggestedQuestionsComponent implements OnInit {
  categories: any[] = [];
  topQuestions: any[] = [];

  @Input() type = 'popular';
  @Input() question;

  constructor(
    public client: Client,
    public session: Session,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    switch (this.type) {
      case 'popular':
        this.loadPopular();
        break;
      case 'category':
        this.loadCategory(this.question.category_uuid);
        break;
    }
  }

  async loadPopular() {
    try {
      const response: any = await this.client.get(
        `api/v2/helpdesk/questions/top`,
        {
          limit: 8,
        }
      );
      this.topQuestions = response.questions;
    } catch (e) {
      console.error(e);
    }
  }

  async loadCategory(uuid: string) {
    try {
      const response: any = await this.client.get(
        `api/v2/helpdesk/categories/category/${uuid}`
      );

      this.categories = [response.category];
    } catch (e) {
      console.error(e);
    }
  }

  sorted(questions) {
    return questions.sort((a, b) => {
      return a.position - b.position;
    });
  }
}
