import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import {
  ComposerService,
  NsfwSubjectValue,
  TagsSubjectValue,
} from './composer.service';
import { Upload } from '../../../services/api';
import { Router } from '@angular/router';
import { distinctUntilChanged, tap } from 'rxjs/operators';

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
  access_id: number;
  category: string | null;
  license: string | null;
  fileKey: string;
  mature: number;
  nsfw: NsfwSubjectValue;
  monetized: number;
  published: number;
  custom_meta: MetaData;
  slug: string;
  tags: TagsSubjectValue;
  monetization: { type: string; min: number };
  time_created: number;
  editor_version: number;
}

@Injectable()
export class ComposerBlogsService {
  readonly urlSlug$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly error$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly title$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly author$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly banner$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly bannerFile$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  readonly content$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly description$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  private contentSubscription: Subscription;

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
          this.composerService.canPost$.next(content.length > 0);
        })
      )
      .subscribe();
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
    // Reset state and free resources
    this.reset();
  }

  /**
   * Resets composer data and state
   */
  reset(): void {
    if (this.contentSubscription) {
      this.contentSubscription.unsubscribe();
    }
    // Reset data
    this.urlSlug$.next('');
    this.title$.next('');
    this.description$.next('');
    this.author$.next('');
    this.content$.next('');
    this.error$.next('');
    this.banner$.next('');
    this.bannerFile$.next('');
  }

  async save() {
    //: Promise<ActivityEntity> {
    const blog = await this.buildBlog();

    if (!this.bannerFile$.getValue()) {
      console.log('no banner...');
      this.error$.next('You must upload a banner');
      return;
    }

    this.composerService.canPost$.next(false);

    this.upload
      .post('api/v1/blog/' + blog.guid, [blog.file], blog)
      .then((response: any) => {
        this.composerService.canPost$.next(true);

        if (response.status !== 'success') {
          if (response.message) {
            this.error$.next('An unknown error has occured');
            return;
          }
          this.error$.next(response.message);
          return;
        }

        this.tearDown();

        this.router.navigate(
          response.route
            ? ['/' + response.route]
            : ['/blog/view', response.guid]
        );
      })
      .catch(e => {
        console.log(e);
        this.composerService.attachmentError$.next(e);
        this.composerService.canPost$.next(true);
      });
  }

  async buildBlog(): Promise<Blog> {
    return {
      file: this.bannerFile$.getValue(),
      guid: 'new',
      title: this.title$.getValue(),
      description: this.content$.getValue(),
      access_id: 2,
      category: null,
      license: this.composerService.license$.getValue(),
      fileKey: 'header',
      mature: this.composerService.nsfw$.getValue() ? 1 : 0,
      nsfw: this.composerService.nsfw$.getValue(),
      monetized: 0,
      published: 1,
      custom_meta: {
        title: this.title$.getValue(),
        description: this.description$.getValue(),
        author: this.author$.getValue(),
      },
      slug: this.urlSlug$.getValue(),
      tags: this.composerService.tags$.getValue(),
      monetization: this.composerService.monetization$.getValue(),
      time_created: this.composerService.schedule$.getValue(),
      editor_version: 2,
    };
  }

  /**
   * Valiates a banner is an image,
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
   * Returns whether or not there is content.
   * @returns - true if composer contains content.
   */
  public hasContent(): boolean {
    return !!(this.content$.getValue() || this.bannerFile$.getValue());
  }
}
