import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Upload, Client } from '../../../../services/api';
import { Router } from '@angular/router';
import { SiteService } from '../../../../common/services/site.service';
import { SignupModalService } from '../../../modals/signup/service';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { Session } from '../../../../services/session';

export interface MetaData {
  title: string;
  description: string;
  author: string;
}

export interface BlogResponse {
  guid?: string;
  route?: string;
  slug?: string;
  status: string;
  message?: string;
}

@Injectable()
export class BlogsViewService {
  readonly error$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  readonly blog$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    protected upload: Upload,
    protected router: Router,
    protected client: Client,
    private session: Session,
    protected site: SiteService,
    private signupModal: SignupModalService,
    private formToastService: FormToastService
  ) {}

  /**
   * Loads an activity by sending GET request to v1/blog endpoint
   * Adds response to local state.
   * @param activity - activity
   */
  public async load(guid: string): Promise<void> {
    this.inProgress$.next(true);
    try {
      const response: any = await this.client.get('api/v1/blog/' + guid, {});
      if (response.blog) {
        let blog = response.blog;
        blog.banner =
          this.site.baseUrl + 'fs/v1/banners/' + guid + '/' + blog.time_updated;
        this.blog$.next(response.blog);
        this.error$.next('');
      }
    } catch (e) {
      // do nothing
    } finally {
      this.inProgress$.next(false);
    }
  }

  /**
   * Runs when dependant component is destroyed
   */
  ngOnDestroy(): void {
    this.tearDown();
  }

  /**
   * Destroys the service and its state
   */
  tearDown(): void {
    this.reset();
  }

  /**
   * Resets composer data and state
   */
  reset(): void {
    this.blog$.next(null);
  }

  delete() {
    const blog = this.blog$.getValue();
    this.client.delete('api/v1/blog/' + blog.guid).then((response: any) => {
      this.router.navigate(['/blog/owner']);
    });
  }

  subscribe() {
    if (!this.session.isLoggedIn()) {
      this.signupModal
        .setSubtitle('You need to have a channel in order to subscribe')
        .open();
      return false;
    }

    const blog = this.blog$.getValue();
    this.client
      .post('api/v1/subscribe/' + blog.ownerObj.guid, {})
      .then((response: any) => {
        if (response && response.error) {
          throw 'error';
        }
        blog.ownerObj.subscribed = true;
        this.blog$.next(blog);
      })
      .catch(e => {
        this.formToastService.error("You can't subscribe to this user.");
      });
  }

  unsubscribe() {
    const blog = this.blog$.getValue();

    this.client
      .delete('api/v1/subscribe/' + blog.ownerObj.guid, {})
      .then((response: any) => {
        blog.ownerObj.subscribed = false;
        this.blog$.next(blog);
      })
      .catch(e => {
        // do nothing
      });
  }
}
