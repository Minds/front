/**
 * Service for managing blog state in Composer.
 * @author Ben Hayward
 * TODO:
 * [] Footer positioning.
 * [] Scheduling - later iteration.
 * [] Monetization - later iteration.
 */

import { Injectable, Self, Inject } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
// import { MonetizationSubjectValue } from '../../../composer/services/composer.service';
import { Upload, Client } from '../../../../services/api';
import { Router } from '@angular/router';
import { distinctUntilChanged, tap, take } from 'rxjs/operators';
import { SiteService } from '../../../../common/services/site.service';
import { Captcha } from '../../../captcha/captcha.component';
import { ToasterService } from '../../../../common/services/toaster.service';
import {
  ComposerService,
  MonetizationSubjectValue,
  DEFAULT_ACCESS_ID_VALUE,
} from '../../../composer/services/composer.service';
import { BlogPreloadService } from './blog-preload.service';

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

export interface BlogEditEntity {
  guid: string;
  title: string;
  description: string;
  editor_version: number;
  published: number;
  nsfw: number[];
  tags: string[];
  file: any;
  fileKey: string;
  captcha: Captcha;
  paywall?: boolean;
  // monetized?: boolean;
  wire_threshold: MonetizationSubjectValue;
  time_created: number;
  access_id: number;
  custom_meta?: {
    title: string;
    description: string;
    author: string;
  };
  slug?: string;
  license?: string;
}

export const DEFAULT_BLOG_EDITOR_VERSION_VALUE = 2;

@Injectable()
export class BlogsEditService {
  readonly error$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly title$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly author$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly banner$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly guid$: BehaviorSubject<string> = new BehaviorSubject<string>('new');
  readonly published$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  readonly license$: BehaviorSubject<string> = this.composerService.license$;
  readonly content$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly nsfw$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  readonly tags$: BehaviorSubject<string[]> = this.composerService.tags$;
  readonly urlSlug$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  readonly accessId$: BehaviorSubject<string> = this.composerService.accessId$;

  readonly timeCreated$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );

  readonly metaDescription$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  readonly metaTitle$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  readonly captcha$: BehaviorSubject<Captcha> = new BehaviorSubject<Captcha>(
    null
  );

  readonly canPost$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
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

  readonly attachmentError$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  readonly monetize$: BehaviorSubject<MonetizationSubjectValue> =
    this.composerService.monetization$;

  readonly editorVersion$: BehaviorSubject<number> = new BehaviorSubject(
    DEFAULT_BLOG_EDITOR_VERSION_VALUE
  );

  private contentSubscription: Subscription;
  private accessIdSubscription: Subscription;

  constructor(
    protected upload: Upload,
    protected router: Router,
    protected client: Client,
    protected site: SiteService,
    private toaster: ToasterService,
    private preload: BlogPreloadService,
    @Self() @Inject(ComposerService) private composerService: ComposerService
  ) {
    this.contentSubscription = combineLatest([
      this.content$,
      this.preload.message$,
    ])
      .pipe(
        distinctUntilChanged(),
        tap(([content, preloadMessage]: [string, string]) => {
          // if preload message is set, set content to message
          if (preloadMessage) {
            this.content$.next(preloadMessage);
            // clear preloaded message
            this.preload.clear();
          }

          // set canPost$ true if content length greater than 0.
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
  public async load(guid: string): Promise<void> {
    this.inProgress$.next(true);
    this.canPost$.next(false);

    const response: any = await this.client.get('api/v1/blog/' + guid, {});

    if (response.blog) {
      const blog = response.blog;

      this.urlSlug$.next(blog.slug);
      this.title$.next(blog.title);
      this.content$.next(blog.description);
      this.author$.next(blog.custom_meta.author);
      this.nsfw$.next(blog.nsfw);
      this.error$.next('');
      this.banner$.next(
        this.site.baseUrl + 'fs/v1/banners/' + guid + '/' + blog.time_updated
      );
      this.bannerFile$.next('');
      this.canPost$.next(true);
      this.guid$.next(guid);
      this.published$.next(blog.published);
      this.timeCreated$.next(blog.time_created);
      this.accessId$.next(blog.access_id);
      this.schedule$.next(blog.time_created);
      this.savedContent$.next(blog.description);
      this.license$.next(blog.license);
      this.monetize$.next(blog.wire_threshold);
      this.tags$.next(blog.tags);
      this.metaDescription$.next(blog.custom_meta.description);
      this.metaTitle$.next(blog.custom_meta.title);
      this.editorVersion$.next(blog.editor_version);
    }

    this.inProgress$.next(false);
    this.canPost$.next(true);
  }

  /**
   * Runs when dependant component is destroyed
   */
  ngOnDestroy(): void {
    this.tearDown();
    if (this.contentSubscription) {
      this.contentSubscription.unsubscribe();
    }
    if (this.accessIdSubscription) {
      this.accessIdSubscription.unsubscribe();
    }
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
    this.urlSlug$.next('');
    this.title$.next('');
    this.content$.next('');
    this.author$.next('');
    this.content$.next('');
    this.error$.next('');
    this.banner$.next('');
    this.bannerFile$.next('');
    this.canPost$.next(true);
    this.guid$.next('');
    this.published$.next(0);

    this.timeCreated$.next(0);

    this.accessId$.next(DEFAULT_ACCESS_ID_VALUE);
    this.schedule$.next(null);
    this.savedContent$.next('');
    // this.monetization$.next(null);
    this.tags$.next([]);
    this.nsfw$.next([]);
    this.metaDescription$.next('');
    this.metaTitle$.next('');
    this.editorVersion$.next(DEFAULT_BLOG_EDITOR_VERSION_VALUE);
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

    // await this.setNextPublishState(draft);

    const blog = await this.buildBlog();

    this.canPost$.next(false);
    this.inProgress$.next(true);

    try {
      const response: any = await this.upload.post(
        'api/v1/blog/' + blog.guid,
        [blog.file],
        blog
      );

      if (response.status !== 'success') {
        this.canPost$.next(true);
        this.inProgress$.next(false);
        this.error$.next(response.message || 'An unknown error has occurred');
        return response;
      }

      if (!draft) {
        this.tearDown();
        await this.router.navigate(
          response.route
            ? ['/' + response.route]
            : ['/blog/view', response.guid]
        );
        return;
      }

      this.guid$.next(response.guid);
      this.savedContent$.next(this.content$.getValue());
      this.toaster.success('Your draft has been successfully saved.');
      this.inProgress$.next(false);
      this.canPost$.next(true);

      return response;
    } catch (e) {
      console.error(e);
      this.error$.next(e);
      this.canPost$.next(true);
      this.inProgress$.next(false);

      return {
        status: '500',
        message: e,
      };
    }
  }

  /**
   * Override current accessId if a user is publishing to be public.
   * If draft saved, sets accessId$ to be 0 (no 3rd party access).
   * @param { boolean } - draft - true if is saving a draft.
   * @returns { Promise<void> } - Awaitable.
   */
  private async setNextPublishState(draft: boolean): Promise<void> {
    this.accessIdSubscription = this.accessId$
      .pipe(
        take(1),
        tap((id) => {
          this.published$.next(draft ? 0 : 1);

          // if saving as draft force id to be 0.
          if (draft) {
            this.accessId$.next('0');
            return;
          }

          // if not saving as draft and value is 0 set to publicly visible.
          if (id === '0') {
            this.accessId$.next('2');
            return;
          }

          // if value is already set to 1 or 2 and publishing, keep the existing set access id.
          return;
        })
      )
      .subscribe();
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
  async buildBlog(): Promise<BlogEditEntity> {
    return {
      file: this.bannerFile$.getValue(),
      guid: this.guid$.getValue(),
      title: this.title$.getValue(),
      description: this.content$.getValue(),
      access_id: Number(this.accessId$.getValue()),
      license: this.license$.getValue(),
      fileKey: 'header',
      nsfw: this.nsfw$.getValue(),
      paywall: Boolean(this.monetize$.getValue()),
      wire_threshold: this.monetize$.getValue(),
      published: this.published$.getValue(),
      custom_meta: {
        title: this.metaTitle$.getValue(),
        description: this.metaDescription$.getValue(),
        author: this.author$.getValue(),
      },
      slug: this.urlSlug$.getValue(),
      tags: this.tags$.getValue(),
      time_created: this.schedule$.getValue(),
      editor_version: DEFAULT_BLOG_EDITOR_VERSION_VALUE, // NOTE: we always set this to current editor
      captcha: this.captcha$.getValue(),
    };
  }

  /**
   * Validates a banner is an image,
   * adds it as a file and a preview.
   * @param banner - banner for upload.
   */
  addBanner(banner: any): void {
    if (banner.length === 0) {
      return;
    }

    if (banner.type.match(/image\/*/) === null) {
      this.error$.next('Banners must be an image');
      return;
    }
    try {
      this.canPost$.next(true);
      this.bannerFile$.next(banner);
      const reader = new FileReader();
      reader.readAsDataURL(banner);
      reader.onload = (_event) => {
        this.banner$.next(reader.result.toString());
      };
    } catch (e) {
      this.error$.next('Error uploading banner');
    }
  }

  /**
   * Returns whether or not there is unsaved content.
   * @returns { boolean }- true if composer contains content.
   */
  public hasContent(): boolean {
    return this.content$.getValue() !== this.savedContent$.getValue();
  }

  /**
   * pushes a tag to tags unless it already is in the tags
   * or there is more than 5. Removes non alphanumeric characters.
   * @param { string } - tag to be pushed.
   */
  public pushTag(tag: string): void {
    const current: string[] = this.tags$.getValue();
    if (current.indexOf(tag) < 0 && current.length < 5) {
      // strip non-alphanumeric characters
      tag = tag.replace(/\W/g, '');
      if (tag.length > 0) {
        current.push(tag);
        this.tags$.next(current);
      }
    }
  }

  /**
   * Tag to be removed.
   * @param { string } tag - the tag to remove.
   */
  public removeTag(tag: string): void {
    this.tags$.next(this.tags$.getValue().filter((t) => t !== tag));
  }

  /**
   * It should toggle NSFW.
   * @param { number } - the number of nsfw value to toggle on.
   */
  public toggleNSFW(value: number): void {
    let current: number[] = this.nsfw$.getValue();
    if (current.indexOf(value) > -1) {
      current = current.filter((t) => t !== value);
      this.nsfw$.next(current);
      return;
    }
    current.push(value);
    this.nsfw$.next(current);
  }

  /**
   * Returned whether the content matches that held as already saved content.
   * @returns { boolean } - true if content matches the saved content.
   */
  public isContentSaved(): boolean {
    return this.savedContent$.getValue() === this.content$.getValue();
  }
}
