import { ApplicationRef, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { AnalyticsService } from '../../../services/analytics';

import { MindsBlogResponse } from '../../../interfaces/responses';
import { MindsBlogEntity } from '../../../interfaces/entities';
import { ConfigsService } from '../../../common/services/configs.service';
import {
  MetaService,
  MIN_METRIC_FOR_ROBOTS,
} from '../../../common/services/meta.service';
import { HeadersService } from '../../../common/services/headers.service';
import { AuthModalService } from '../../auth/modal/auth-modal.service';
import { RedirectService } from '../../../common/services/redirect.service';

@Component({
  selector: 'm-blog-view-infinite',
  templateUrl: 'infinite.html',
})
export class BlogViewInfinite {
  readonly cdnAssetsUrl: string;
  guid: string;
  blogs: Array<Object> = [];
  sharetoggle: boolean = false;

  inProgress: boolean = false;
  moreData: boolean = true;

  error: string = '';

  paramsSubscription: Subscription;

  constructor(
    public session: Session,
    public client: Client,
    public route: ActivatedRoute,
    public router: Router,
    private applicationRef: ApplicationRef,
    private cd: ChangeDetectorRef,
    private analytics: AnalyticsService,
    configs: ConfigsService,
    private metaService: MetaService,
    private headersService: HeadersService,
    private authModal: AuthModalService,
    private redirectService: RedirectService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params) => {
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
    this.error = null;
    this.inProgress = true;
    this.analytics.preventDefault();
    //console.log('grabbing ' + this.guid);
    this.client
      .get('api/v1/blog/' + this.guid, {})
      .then((response: MindsBlogResponse) => {
        if (response.require_login) {
          this.error = 'You must login to view this blog';
          this.openLoginModal();
          this.headersService.setCode(401);
          this.updateMeta(response.blog);
        } else {
          if (response.blog) {
            this.blogs = [response.blog];
            this.analytics.send(
              'pageview',
              {
                url: '/blog/view/' + response.blog.guid,
                referrer: document.referrer,
                dimension1: response.blog.ownerObj.guid,
              },
              response.blog.guid
            );
            this.updateMeta(response.blog);
          } else if (this.blogs.length === 0) {
            this.error = "Sorry, we couldn't load the blog";
            this.headersService.setCode(404);
          }
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

  async openLoginModal(): Promise<void> {
    const user = await this.authModal.open();
    if (user) {
      this.load(true);
    } else {
      // Goes to homepage if login aborted
      this.redirectService.redirect('/');
    }
  }

  private updateMeta(blog): void {
    const description = blog.custom_meta['description']
      ? blog.custom_meta['description']
      : blog.description.length > 140
        ? blog.excerpt.substr(0, 140) + '...'
        : blog.excerpt;

    const author = blog.custom_meta['author'] || `@${blog.ownerObj.username}`;

    this.metaService
      .setTitle(blog.custom_meta['title'] || blog.title)
      .setDescription(description)
      .setAuthor(author)
      .setOgAuthor(author)
      .setOgType('article')
      .setCanonicalUrl(blog.perma_url)
      .setOgUrl(blog.perma_url)
      .setOgImage(blog.thumbnail_src)
      .setRobots(
        blog['thumbs:up:count'] >= MIN_METRIC_FOR_ROBOTS ? 'all' : 'noindex'
      );

    if (blog.nsfw.length) {
      this.metaService.setNsfw(true);
    }
  }
}
