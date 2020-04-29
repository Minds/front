import { Component, OnInit } from '@angular/core';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'm-helpdesk--questions--search',
  templateUrl: 'search.component.html',
})
export class SearchQuestionsComponent {
  query: string = '';
  questions: any[] = [];
  searching: boolean = false;
  private throttle;

  constructor(
    public client: Client,
    public session: Session,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  onBlur() {
    this.searching = false;
  }

  search() {
    if (this.throttle) {
      clearTimeout(this.throttle);
      this.throttle = void 0;
    }

    let query = this.query;

    if (!query || query.length <= 2) {
      this.questions = [];
      return;
    }

    this.throttle = setTimeout(async () => {
      try {
        let response: any = await this.client.get(
          `api/v2/helpdesk/questions/search`,
          {
            q: query,
            limit: 8,
          }
        );
        if (!response.entities) {
          return;
        }

        this.questions = response.entities;
      } catch (e) {
        console.error('Cannot load results', e);
      }
    });
  }
}
