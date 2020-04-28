/**
 * Service for managing blog state in Composer.
 * @author Ben Hayward
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { ComposerService, MonetizationSubjectValue } from './composer.service';
import { Upload, Client } from '../../../services/api';
import { Router } from '@angular/router';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { SiteService } from '../../../common/services/site.service';
import { MindsBlogEntity } from '../../../interfaces/entities';

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
export class ComposerBlogsService {
  readonly urlSlug$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly error$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly title$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly author$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly banner$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly guid$: BehaviorSubject<string> = new BehaviorSubject<string>('new');
  readonly published$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  readonly license$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly content$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly accessId$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly nsfw$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  readonly tags$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  readonly canPost$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  readonly draftSaved$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  readonly bannerFile$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  readonly schedule$: BehaviorSubject<number> = new BehaviorSubject<number>(
    null
  );

  readonly savedContent$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  readonly description$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  readonly monetization$: BehaviorSubject<
    MonetizationSubjectValue
  > = new BehaviorSubject<MonetizationSubjectValue>(null);

  private contentSubscription: Subscription;
  private timerSubscription: Subscription;

  constructor(
    protected composerService: ComposerService,
    protected upload: Upload,
    protected router: Router,
    protected client: Client,
    protected site: SiteService
  ) {
    this.contentSubscription = this.content$
      .pipe(
        distinctUntilChanged(),
        tap(content => {
          // console.log(`contentPipe | setting canPost ${content.length > 0}`);
          this.canPost$.next(content.length > 0);
        })
      )
      .subscribe();
  }

  /**
   * Loads an activity by sending GET request to v1/blog endpoint
   * Adds response to local state.
   * @param activity - activity
   */
  public load(activity: any): void {
    let guid: string = activity.entity_guid
      ? activity.entity_guid
      : activity.guid;

    this.client.get('api/v1/blog/' + guid, {}).then((response: any) => {
      if (response.blog) {
        const blog = response.blog;

        this.urlSlug$.next(blog.slug);
        this.title$.next(blog.title);
        this.description$.next(blog.description);
        this.author$.next(blog.custom_meta.author);
        this.content$.next(blog.description);
        this.nsfw$.next(blog.nsfw);
        this.error$.next('');
        this.banner$.next(
          this.site.baseUrl +
            'fs/v1/banners/' +
            guid +
            '/' +
            activity.time_updated
        );
        this.bannerFile$.next('');
        this.canPost$.next(true);
        this.guid$.next(guid);
        this.published$.next(blog.published);
        this.draftSaved$.next(false);
        this.accessId$.next(blog.access_id);
        this.schedule$.next(blog.time_created);
        this.savedContent$.next(blog.description);
        this.monetization$.next({ type: 'tokens', min: blog.wire_threshold });
        this.tags$.next(blog.tags);
      }
    });
  }

  /**
   * Runs when dependant component is destroyed
   */
  ngOnDestroy(): void {
    this.tearDown();
    if (this.contentSubscription) {
      this.contentSubscription.unsubscribe();
    }
  }

  /**
   * Destroys the service and its state
   */
  tearDown(): void {
    // Reset state and free resources
    this.reset();
  }

  /**
   * Resets composer data and state
   */
  reset(): void {
    this.urlSlug$.next('');
    this.title$.next('');
    this.description$.next('');
    this.author$.next('');
    this.content$.next('');
    this.error$.next('');
    this.banner$.next('');
    this.bannerFile$.next('');
    this.canPost$.next(true);
    this.guid$.next('');
    this.published$.next(0);
    this.draftSaved$.next(false);
    this.accessId$.next(null);
    this.schedule$.next(null);
    this.savedContent$.next('');
    this.monetization$.next(null);
    this.tags$.next([]);
    this.nsfw$.next([]);
  }

  /**
   * Saves a blog
   * @param { boolean } - whether to save as draft
   * @returns { Promise<void> }
   */
  async save(draft = false): Promise<BlogResponse> {
    if (!this.bannerFile$.getValue() && !this.banner$.getValue()) {
      this.error$.next('You must upload a banner');
      return;
    }

    if (!this.title$.getValue()) {
      this.error$.next('Your blog must have a title');
      return;
    }

    this.published$.next(draft ? 0 : 1);
    const blog = await this.buildBlog();

    this.composerService.canPost$.next(false);
    try {
      const response: any = await this.upload.post(
        'api/v1/blog/' + blog.guid,
        [blog.file],
        blog
      );

      this.composerService.canPost$.next(true);

      if (response.status !== 'success') {
        if (response.message) {
          this.error$.next('An unknown error has occured');
          return response;
        }
        this.error$.next(response.message);
        return response;
      }

      if (!draft) {
        this.tearDown();
        this.router.navigate(
          response.route
            ? ['/' + response.route]
            : ['/blog/view', response.guid]
        );
      }
      // else
      this.emitDraftSaved();
      this.savedContent$.next(this.content$.getValue());
      this.guid$.next(response.guid);

      return response;
    } catch (e) {
      console.error(e);
      this.composerService.attachmentError$.next(e);
      this.composerService.canPost$.next(true);

      return {
        status: '500',
        message: e,
      };
    }
  }

  /**
   * Sets draftSaved to true for 5 seconds.
   */
  private emitDraftSaved(): void {
    this.draftSaved$.next(true);
    const observableTimer = timer(5000);
    this.timerSubscription = observableTimer.subscribe(t => {
      this.draftSaved$.next(false);
      this.timerSubscription.unsubscribe();
    });
  }

  /**
   * Saves as draft.
   * @returns { Promise<any> }
   */
  public async saveDraft(): Promise<BlogResponse> {
    return this.save(true);
  }

  /**
   * Assembles blog from current values.
   * @returns { Promise<Blog>} the built blog.
   */
  async buildBlog(): Promise<MindsBlogEntity> {
    return {
      file: this.bannerFile$.getValue(),
      guid: this.guid$.getValue(),
      title: this.title$.getValue(),
      description: this.content$.getValue(),
      access_id: Number(this.accessId$.getValue()),
      license: this.license$.getValue(),
      fileKey: 'header',
      mature: this.nsfw$.getValue().length > 0,
      nsfw: this.nsfw$.getValue(),
      paywall: Boolean(this.monetization$.getValue()),
      wire_threshold: this.monetization$.getValue()
        ? this.monetization$.getValue().min
        : 0,
      published: this.published$.getValue(),
      custom_meta: {
        title: this.title$.getValue(),
        description: this.description$.getValue(),
        author: this.author$.getValue(),
      },
      slug: this.urlSlug$.getValue(),
      tags: this.tags$.getValue(),
      time_created: this.schedule$.getValue(),
      editor_version: 2,
    };
  }

  /**
   * Validates a banner is an image,
   * adds it as a file and a preview.
   */
  addBanner(banner: any): void {
    if (banner.length === 0) {
      return;
    }

    if (banner.type.match(/image\/*/) === null) {
      this.error$.next('Banners must be an image');
      return;
    }

    this.composerService.canPost$.next(true);

    this.bannerFile$.next(banner);
    const reader = new FileReader();
    reader.readAsDataURL(banner);
    reader.onload = _event => {
      this.banner$.next(reader.result.toString());
    };
  }

  /**
   * Returns whether or not there is unsaved content.
   * @returns - true if composer contains content.
   */
  public hasContent(): boolean {
    return this.content$.getValue() !== this.savedContent$.getValue();
  }
}
