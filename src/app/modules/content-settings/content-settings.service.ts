import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ContentSettingsTab = 'tags' | 'compass' | 'nsfw';

@Injectable({ providedIn: 'root' })
export class ContentSettingsService {
  activeTab$: BehaviorSubject<ContentSettingsTab> =
    new BehaviorSubject<ContentSettingsTab>('tags');

  constructor() {}
}
