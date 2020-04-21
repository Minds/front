import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MetaData {
  urlSlug: string;
  title: string;
  description: string;
  author: string;
}
@Injectable()
export class ComposerBlogsService {
  readonly urlSlug$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly title$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly description$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  readonly author$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly banner$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly error$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {}

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
    // Reset data
    this.urlSlug$.next('');
    this.title$.next('');
    this.description$.next('');
    this.author$.next('');
    this.error$.next('');
    this.banner$.next('');
  }

  save(): void {
    // TODO: Link save.
    console.log('TODO: SAVE');
  }

  addBanner(banner: any): void {
    if (banner.length === 0) {
      return;
    }

    if (banner.type.match(/image\/*/) == null) {
      this.error$.next('Banners must be an image');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(banner);
    reader.onload = _event => {
      this.banner$.next(reader.result.toString());
    };
  }
}
