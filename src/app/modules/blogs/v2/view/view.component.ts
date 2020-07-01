import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable, combineLatest, of } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';
import { Session } from '../../../../services/session';
import { BlogsViewService } from './blog-view.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { FeaturesService } from '../../../../services/features.service';
import { Client } from '../../../../services/api';
import { BlogViewMenuOption } from './dropdown/dropdown.component';
import { ActivityService } from '../../../../common/services/activity.service';

/**
 * Blog view v2
 */
@Component({
  selector: 'm-blogView--v2',
  host: {
    class: 'm-blog',
  },
  templateUrl: 'view.component.html',
  providers: [ActivityService],
})
export class BlogViewV2Component implements OnInit, OnDestroy {
  paramsSubscription: Subscription;

  menuOptions: Array<string> = [
    'edit',
    'follow',
    'feature',
    'delete',
    'report',
    'subscribe',
    'set-explicit',
    'remove-explicit',
    'rating',
    'allow-comments',
  ];

  constructor(
    public service: BlogsViewService,
    private route: ActivatedRoute,
    public session: Session,
    private configs: ConfigsService,
    private router: Router,
    private featuresService: FeaturesService,
    private client: Client
  ) {}

  ngOnInit() {
    // grab current emission from params to get the blog GUID
    this.paramsSubscription = this.route.params
      .pipe(take(1))
      .subscribe(params => {
        let guid: string;

        if (params['guid']) {
          guid = params['guid'];
        } else if (params['slugid']) {
          const slugParts = params['slugid'].split('-');
          guid = slugParts[slugParts.length - 1];
        }

        if (guid) {
          this.service.load(guid);
        }
      });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  get author$(): Observable<string> {
    return combineLatest([this.service.blog$]).pipe(
      map(([blog]) => {
        if (blog.custom_meta.author) {
          return blog.author;
        }
        if (blog.ownerObj.name) {
          return blog.ownerObj.name;
        }
        if (blog.ownerObj.username) {
          return blog.ownerObj.username;
        }
      }),
      catchError(_ => of(null))
    );
  }

  /**
   * Gets the Src string using the global minds object and the held user object.
   */
  get avatarSrc$(): Observable<string> {
    return this.service.blog$.pipe(
      map(blog => {
        if (blog) {
          return `${this.configs.get('cdn_url')}icon/${
            blog.ownerObj.guid
          }/large/${blog.ownerObj.icontime}`;
        }
        return null;
      })
    );
  }

  // get paywallEntity$(): Observable<any> {
  //   return combineLatest([this.service.monetization$, this.service.author$])
  //     .pipe(
  //       map(([ownerObj, author]) => {

  //       }),
  //       catchError(_ => of(null))
  //     );
  // }

  /**
   * Converts a date to a human readable datetime e.g. 29/05/2020, 10:32:46.
   * @returns - human readable datetime.
   */
  toReadableDate(seconds: string): string {
    return new Date(parseInt(seconds) * 1000).toLocaleString();
  }

  async onDropdownOptionSelected(option: BlogViewMenuOption) {
    const blog = this.service.blog$.getValue();

    switch (option) {
      case 'edit':
        if (
          this.featuresService.has('ckeditor5') &&
          (!blog.time_created || Number(blog.editor_version) === 2)
        ) {
          await this.router.navigate(['/blog/v2/edit', blog.guid]);
          break;
        }
        await this.router.navigate(['/blog/edit', blog.guid]);
        break;
      case 'delete':
        console.log('delete called in view');
        this.service.delete();
        break;
      case 'subscribe':
        if (blog.ownerObj.subscribed) {
          this.service.unsubscribe();
          break;
        }
        this.service.subscribe();
        break;
      case 'report':
        break;
      case 'follow':
        break;
      case 'edit':
        break;
      case 'allow-comments':
        break;
      case 'feature':
        break;
      case 'delete':
        break;
    }
  }
}
