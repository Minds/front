import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client } from '../../services/api';

export type ContentSettingsModalTab = 'tags' | 'compass' | 'nsfw';

@Injectable()
export class ContentSettingsService {
  activeTab$: BehaviorSubject<ContentSettingsModalTab> = new BehaviorSubject<
    ContentSettingsModalTab
  >('tags');

  constructor(private client: Client) {}
}
