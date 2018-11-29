import { Component, OnInit } from '@angular/core';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'm-helpdesk--questions',
  templateUrl: 'questions.component.html'
})

export class QuestionsComponent implements OnInit {
  categories: any[] = [];
  relatedPosts: any[] = [];
  topQuestions: any[] = [];
  selectedQuestion: any = {};
  selectedUUID: string;

  query: string = '';
  results: any[] = [];
  searching: boolean = false;
  private throttle;

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
      this.selectedUUID = params['uuid'];

      this.load();
    });
  }

  async load() {
    return Promise.all([await this.loadPopular(), await this.loadQuestion()]);
  }

  async loadPopular() {
    try {
      const response: any = await this.client.get(`api/v2/helpdesk/questions/top`, { limit: 8 });

      this.topQuestions = response.questions;
    } catch (e) {
      console.error(e);
    }
  }

  async loadRelatedPost(q) {
    this.relatedPosts = [];
    try {
      const response: any = await this.client.get(`api/v2/helpdesk/relatedposts`, { limit: 8, q});

      this.relatedPosts = response.posts;
    } catch (e) {
      console.error(e);
    }
  }

  async loadQuestion() {
    try {
      const response: any = await this.client.get(`api/v2/helpdesk/questions/question/${this.selectedUUID}`);
      if (!response.question) {
        this.navigateToSupportGroup();
      }
      this.selectedQuestion = response.question;

      this.loadCategory(this.selectedQuestion.category_uuid);
      this.loadRelatedPost(this.selectedQuestion.question);
    } catch (e) {
      console.error(e);
    }
  }

  async loadCategory(uuid: string) {
    try {
      const response: any = await this.client.get(`api/v2/helpdesk/categories/category/${uuid}`);

      this.categories = [response.category];
    } catch (e) {
      console.error(e);
    }
  }

  redirectToQuestion(question) {
    this.router.navigate(['/help/question', question.uuid]);
  }

  navigateToHelpdesk() {
    this.router.navigate(['/help']);
  }

  navigateToSupportGroup() {
    this.router.navigate(['/groups/profile', '100000000000000681']);
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


  hasVoted(direction: 'up' | 'down') {
    return this.selectedQuestion[`thumb_${direction}`] === true;
  }

  async castVote(direction: 'up' | 'down') {
    const key = `thumb_${direction}`;
    this.selectedQuestion[key] = !this.selectedQuestion[key];

    try {
      if (this.selectedQuestion[key]) {
        await this.client.put(`api/v2/helpdesk/questions/${this.selectedUUID}/${direction}`);
      } else {
        await this.client.delete(`api/v2/helpdesk/questions/${this.selectedUUID}/${direction}`);
      }
    } catch (e) {
      console.error(e);
      this.selectedQuestion[key] = !this.selectedQuestion[key];
    }
  }

}
