import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Router } from '@angular/router';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-helpdesk--dashboard--all',
  templateUrl: 'all.component.html',
})
export class AllHelpdeskDashboardComponent implements OnInit {
  questions = [];
  categories = [];

  constructor(
    public router: Router,
    public client: Client,
    public session: Session,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    const limit = isPlatformServer(this.platformId) ? 12 : 5000; // Load less for SSR
    let response: any = await this.client.get(`api/v2/helpdesk/categories`, {
      limit,
    });
    this.categories = response.categories.sort(
      (a, b) => a.position - b.position
    );

    response = await this.client.get(`api/v2/helpdesk/questions`, { limit });
    this.questions = response.questions;

    for (let category of this.categories) {
      category.questions = this.questions
        .filter(question => {
          return category.uuid === question.category_uuid;
        })
        .sort((a, b) => {
          return a.position - b.position;
        });
    }
  }
}
