/**
 * Service for managing blog state in Composer.
 * @author Ben Hayward
 */

/**
 * TODO:
 * [x] Captcha modal
 * [x] Saving
 * [x] Meta
 * [x] Sort buttons
 * [x] Saving Draft - does guid in url need to change?
 * [x] NSFW
 * [x] Bottom drawer
 * [x] Hashtags - confer with Michael.
 * [x] Load blogs. - ALL LOADING EXCEPT TITLE AND VISIBILITY
 * [] CanDeactivate changes for routing after save.
 * [] Routing.
 * [] Placeholder - maybe make a package level default.
 * [] Monetization - later iteration.
 * [] Scheduling.
 * [] Mobile responsiveness.
 * [] Housekeeping.
 * [] Validation - meta / captcha / title.
 * [] Spec Test.
 * [] E2E test.
 * [] Regression test.
 * [] Revert changes to old blogs.
 * [] Feat flag test.
 * [] Doc.
 * [] Footer positioning.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { MonetizationSubjectValue } from '../../composer/services/composer.service';
import { Upload, Client } from '../../../services/api';
import { Router } from '@angular/router';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { SiteService } from '../../../common/services/site.service';
import { MindsBlogEntity } from '../../../interfaces/entities';
import { Captcha } from '../../captcha/captcha.component';

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

@Injectable({
  providedIn: 'root',
})
export class BlogsEditService {
  readonly urlSlug$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly metaDescription$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('');
  readonly metaTitle$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
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
  readonly captcha$: BehaviorSubject<Captcha> = new BehaviorSubject<Captcha>(
    null
  );

  readonly canPost$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
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

  readonly attachmentError$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('');

  readonly monetization$: BehaviorSubject<
    MonetizationSubjectValue
  > = new BehaviorSubject<MonetizationSubjectValue>(null);

  private contentSubscription: Subscription;
  private timerSubscription: Subscription;

  constructor(
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
      this.content$.next(blog.description);
      this.nsfw$.next(blog.nsfw);
      this.error$.next('');
      this.banner$.next(
        this.site.baseUrl + 'fs/v1/banners/' + guid + '/' + blog.time_updated
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
      this.metaDescription$.next(blog.custom_meta.description);
      this.metaTitle$.next(blog.custom_meta.title);
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
    this.content$.next('');
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
    this.metaDescription$.next('');
    this.metaTitle$.next('');
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

    this.canPost$.next(false);
    this.inProgress$.next(true);

    try {
      const response: any = await this.upload.post(
        'api/v1/blog/' + blog.guid,
        [blog.file],
        blog
      );

      this.canPost$.next(true);
      this.inProgress$.next(false);

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
      this.attachmentError$.next(e);
      this.canPost$.next(true);

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
      nsfw: this.nsfw$.getValue(),
      paywall: Boolean(this.monetization$.getValue()),
      wire_threshold: this.monetization$.getValue()
        ? this.monetization$.getValue().min
        : 0,
      published: this.published$.getValue(),
      custom_meta: {
        title: this.metaTitle$.getValue(),
        description: this.metaDescription$.getValue(),
        author: this.author$.getValue(),
      },
      slug: this.urlSlug$.getValue(),
      tags: this.tags$.getValue(),
      time_created: this.schedule$.getValue(),
      editor_version: 2,
      captcha: this.captcha$.getValue(),
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

    this.canPost$.next(true);

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

  public pushTag(tag: string): void {
    const current: string[] = this.tags$.getValue();
    if (current.indexOf(tag) < 0 && current.length < 5 && tag.length < 50) {
      // strip non-alphanumeric characters
      tag = tag.replace(/\W/g, '');
      if (tag.length > 0) {
        current.push(tag);
        this.tags$.next(current);
      }
    }
  }

  public removeTag(tag: string): void {
    this.tags$.next(this.tags$.getValue().filter(t => t !== tag));
  }

  toggleNSFW(value: number): void {
    let current: number[] = this.nsfw$.getValue();
    console.log('current', current);
    console.log('value', value);
    console.log('current.indexOf(value) > -1', current.indexOf(value) > -1);
    if (current.indexOf(value) > -1) {
      current = current.filter(t => t !== value);
      this.nsfw$.next(current);
      return;
    }
    current.push(value);
    this.nsfw$.next(current);
  }
}
