import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Router } from '@angular/router';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { HelpdeskRedirectService } from '../../../common/services/helpdesk-redirect.service';

/**
 * Category returned from api/v2/helpdesk/categories.
 */
type Category = {
  uuid: string;
  title: string;
  questions?: Question[];
  collapsed?: boolean;
  inProgress?: boolean;
} | null;

/**
 * Question returned from api/v2/helpdesk/questions.
 */
type Question = {
  uuid: string;
  question: string;
} | null;

/**
 * Helpdesk dashboard with collapsible categories and questions.
 */
@Component({
  selector: 'm-helpdesk--dashboard--all',
  templateUrl: 'all.component.html',
  styleUrls: ['all.component.ng.scss'],
})
export class AllHelpdeskDashboardComponent implements OnInit {
  /**
   * Array of categories loaded in OnInit hook.
   */
  public categories: Category[] = [];

  constructor(
    public router: Router,
    public client: Client,
    public session: Session,
    private helpdeskRedirect: HelpdeskRedirectService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit(): Promise<void> {
    if (!isPlatformServer(this.platformId)) {
      window.location.href = this.helpdeskRedirect.getUrl();
    }

    await this.load();
  }

  /**
   * Toggles a category on and off - if unloaded, calls to load child questions.
   * @param { Category } - category to toggle.
   * @returns { Promise<void> } - awaitable.
   */
  public async toggleCategory(category: Category): Promise<void> {
    category.inProgress = true;
    category.collapsed = !category.collapsed;

    if (!category.questions || category.questions.length < 1) {
      category.questions = await this.getQuestions(category);
      category.inProgress = false;
    }
    category.inProgress = false;
  }

  /**
   * Loads categories.
   * @returns { Promise<void> } - awaitable.
   */
  private async load(): Promise<void> {
    this.categories = await this.getCategories();
  }

  /**
   * Gets categories from server.
   * @returns { Promise<void> } - Promise containing categories.
   */
  private async getCategories(): Promise<Category[]> {
    const limit = this.getLimit();
    let response: any = await this.client.get(`api/v2/helpdesk/categories`, {
      limit,
    });

    return response.categories
      .sort((a, b) => a.position - b.position)
      .map(category => {
        category.collapsed = true;
        category.inProgress = false;
        return category;
      });
  }

  /**
   * Get questions from server.
   * @param { Category } - Category to get questions for.
   * @param { Promise<Question> } - Promise containing questions.
   */
  private async getQuestions(category: Category): Promise<Question[]> {
    try {
      const { questions }: any = await this.client.get(
        `api/v2/helpdesk/questions`,
        {
          limit: this.getLimit(),
          category_uuid: category.uuid,
        }
      );
      return questions.sort((a, b) => {
        return a.position - b.position;
      });
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Gets limit for requests.
   * @returns { number } - limit for requests.
   */
  private getLimit(): number {
    return isPlatformServer(this.platformId) ? 12 : 5000; // Load less for SSR
  }
}
