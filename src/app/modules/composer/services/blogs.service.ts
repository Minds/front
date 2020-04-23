import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Subscription,
  timer,
  merge,
  interval,
  zip,
  of,
  Observable,
  from,
} from 'rxjs';
import {
  ComposerService,
  NsfwSubjectValue,
  TagsSubjectValue,
  MonetizationSubjectValue,
} from './composer.service';
import { Upload } from '../../../services/api';
import { Router } from '@angular/router';
import {
  distinctUntilChanged,
  tap,
  map,
  delay,
  concatMap,
} from 'rxjs/operators';
import { ComposerServiceType } from './provider.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export interface MetaData {
  title: string;
  description: string;
  author: string;
}

export interface Blog {
  file: string;
  guid: string;
  title: string;
  description: string;
  access_id: string;
  category: string | null;
  license: string | null;
  fileKey: string;
  mature: number;
  nsfw: NsfwSubjectValue;
  paywall: boolean;
  wire_threshold: number;
  published: number;
  custom_meta: MetaData;
  slug: string;
  tags: TagsSubjectValue;
  time_created: number;
  editor_version: number;
}

export interface BlogResponse {
  guid?: string;
  route?: string;
  slug?: string;
  status: string;
  message?: string;
}

@Injectable()
export class ComposerBlogsService implements ComposerServiceType {
  readonly urlSlug$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly error$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly title$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly author$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly banner$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly canPost$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  readonly guid$: BehaviorSubject<string> = new BehaviorSubject<string>('new');
  readonly published$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  readonly draftSaved$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  readonly bannerFile$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  readonly license$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly content$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly description$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  readonly accessId$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly schedule$: BehaviorSubject<number> = new BehaviorSubject<number>(
    null
  );
  readonly savedContent$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  readonly monetization$: BehaviorSubject<
    MonetizationSubjectValue
  > = new BehaviorSubject<MonetizationSubjectValue>(null);
  readonly tags$: BehaviorSubject<TagsSubjectValue> = new BehaviorSubject<
    TagsSubjectValue
  >([]);

  private contentSubscription: Subscription;
  private timerSubscription: Subscription;

  constructor(
    protected composerService: ComposerService,
    protected upload: Upload,
    protected router: Router
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
  }

  /**
   * Saves a blog
   * @param { boolean } - whether to save as draft
   * @returns { Promise<void> }
   */
  async save(draft = false): Promise<BlogResponse> {
    if (!this.bannerFile$.getValue()) {
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
    return this.upload
      .post('api/v1/blog/' + blog.guid, [blog.file], blog)
      .then((response: any) => {
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
      })
      .catch(e => {
        console.error(e);
        this.composerService.attachmentError$.next(e);
        this.composerService.canPost$.next(true);

        return {
          status: '500',
          message: e,
        };
      });
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
  async buildBlog(): Promise<Blog> {
    return {
      file: this.bannerFile$.getValue(),
      guid: this.guid$.getValue(),
      title: this.title$.getValue(),
      description: this.content$.getValue(),
      access_id: this.accessId$.getValue(),
      category: null,
      license: this.license$.getValue(),
      fileKey: 'header',
      mature: this.composerService.nsfw$.getValue().length ? 1 : 0,
      nsfw: this.composerService.nsfw$.getValue(),
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

    if (banner.type.match(/image\/*/) == null) {
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
