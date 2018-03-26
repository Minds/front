import { ApplicationRef, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { MindsTitle } from '../../../services/ux/title';
import { AnalyticsService } from '../../../services/analytics';

import { MindsBlogResponse } from '../../../interfaces/responses';
import { MindsBlogEntity } from '../../../interfaces/entities';


@Component({
  moduleId: module.id,
  selector: 'm-blog-view-infinite',
  templateUrl: 'infinite.html'
})

export class BlogViewInfinite {

  minds;
  guid: string;
  blogs: Array<Object> = [];
  sharetoggle: boolean = false;

  inProgress: boolean = false;
  moreData: boolean = true;

  error: string = '';

  paramsSubscription: Subscription;

  constructor(public session: Session, public client: Client, public route: ActivatedRoute, public router: Router, public title: MindsTitle,
              private applicationRef: ApplicationRef, private cd: ChangeDetectorRef, private analytics: AnalyticsService) {
  }

  ngOnInit() {
    this.minds = window.Minds;

    this.paramsSubscription = this.route.params.subscribe(params => {
      let load = false;

      if (params['guid']) {
        this.guid = params['guid'];

        load = true;
      } else if (params['slugid']) {
        const slugParts = params['slugid'].split('-');

        this.guid = slugParts[slugParts.length - 1];

        if (this.guid) {
          load = true;
        }
      }

      if (load) {
        this.load();
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.guid) {
      this.load();
    }
  }

  load(refresh: boolean = false) {
    if (this.inProgress) {
      return false;
    }
    this.inProgress = true;
    this.analytics.preventDefault();
    //console.log('grabbing ' + this.guid);
    this.client.get('api/v1/blog/' + this.guid, {})
      .then((response: MindsBlogResponse) => {
        if (response.blog) {
          this.blogs = [response.blog];
          this.title.setTitle(response.blog.title);
          this.analytics.send('pageview', {
            'url': '/blog/view/' + response.blog.guid,
            'referrer': document.referrer,
            'dimension1': response.blog.ownerObj.guid
          }, response.blog.guid);
        } else if (this.blogs.length === 0) {
          this.error = 'Sorry, we couldn\'t load the blog';
        }
        //hack: ios rerun on low memory
        this.cd.markForCheck();
        this.applicationRef.tick();
        this.inProgress = false;
      })
      .catch((e) => {
        if (this.blogs.length === 0) {
          this.error = 'Sorry, there was a problem loading the blog';
        }
        this.inProgress = false;
      });
  }

  loadNextBlog() {
    if (this.inProgress) {
      return false;
    }
    this.inProgress = true;

    this.client.get('api/v1/blog/next/' + this.guid)
      .then((response: any) => {
        if (!response.blog) {
          this.inProgress = false;
          this.moreData = false;
          return false;
        }
        this.blogs.push(response.blog);
        this.guid = response.blog.guid;
        this.inProgress = false;
      })
      .catch((e) => {
        this.inProgress = false;
      });
  }

}
