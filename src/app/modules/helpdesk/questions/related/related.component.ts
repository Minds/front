import { Component, Input, OnInit } from '@angular/core';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'm-helpdesk--questions--related',
  templateUrl: 'related.component.html',
})
export class RelatedQuestionsComponent implements OnInit {
  @Input() question;
  posts: any[] = [];
  inProgress: boolean = false;

  constructor(
    public client: Client,
    public session: Session,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    this.inProgress = true;
    this.posts = [];
    try {
      const response: any = await this.client.get(
        `api/v2/helpdesk/relatedposts`,
        {
          limit: 8,
          q: this.question.question,
        }
      );

      this.posts = response.posts;
    } catch (e) {
      console.error(e);
    } finally {
      this.inProgress = false;
    }
  }
}
