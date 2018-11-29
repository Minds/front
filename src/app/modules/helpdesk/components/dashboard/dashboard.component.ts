import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-helpdesk--dashboard',
  templateUrl: 'dashboard.component.html'
})

export class HelpdeskDashboardComponent implements OnInit {
  minds = window.Minds;

  query: string = '';
  results: any[] = [];
  searching: boolean = false;
  private throttle;

  @ViewChild('input') private input: ElementRef;

  topQuestions = [];

  constructor(
    public router: Router,
    public client: Client,
    public session: Session,
  ) {
  }

  async ngOnInit() {
    await this.loadPopular();
  }

  async loadPopular() {
    try {
      const response: any = await this.client.get(`api/v2/helpdesk/questions/top`, { limit: 8 });

      this.topQuestions = response.questions;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Activates and sets focus on the question seach box
   *
   */
  onFocus() {
    this.searching = true;

    if (this.input.nativeElement) {
      setTimeout(() => (<HTMLInputElement>this.input.nativeElement).focus(), 100);
    }
  }

  newCategory() {
    this.router.navigate(['/help/category/edit/new']);
  }

  newQuestion() {
    this.router.navigate(['/help/question/edit/new']);
  }

  /**
   * Deactivates the question seach box
   */
  onBlur() {
    this.searching = false;
  }

  setQuestion(question, $event?) {
    if ($event) {
      $event.preventDefault();
    }

    this.results = [];
    this.query = question.question;
  }

  search() {
    if (this.throttle) {
      clearTimeout(this.throttle);
      this.throttle = void 0;
    }

    let query = this.query;

    if (!query || query.length <= 2) {
      this.results = [];
      return;
    }

    this.throttle = setTimeout(() => {
      this.client.get(`api/v2/helpdesk/questions/search`, {
        q: query,
        limit: 8,
      })
        .then(({ entities }) => {
          if (!entities) {
            return;
          }

          this.results = entities;
        })
        .catch((e) => {
          console.error('Cannot load results', e);
        });
    });
  }

}