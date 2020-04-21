import { Injectable } from '@angular/core';
import { Attachment, AttachmentType } from './attachment.service';
import getFileType from '../../../helpers/get-file-type';
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
    // // Reset preview (state + blob URL)
    // this.setPreview(null);

    // // Reset rich embed preview
    // this.richEmbedPreview$.next(null);

    // // Reset original source
    // this.entity = null;
  }

  save(): void {
    // TODO: Link save.
    console.log('TODO: SAVE');
  }
}
