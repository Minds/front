import { CookieService } from '../../../common/services/cookie.service';
import { Injectable } from '@angular/core';

type NsfwReason = {
  value: number;
  label: string;
  selected: boolean;
  locked: boolean;
};

export const NSFW_REASONS: NsfwReason[] = [
  { value: 1, label: 'Nudity', selected: false, locked: false },
  { value: 2, label: 'Pornography', selected: false, locked: false },
  { value: 3, label: 'Profanity', selected: false, locked: false },
  { value: 4, label: 'Violence and Gore', selected: false, locked: false },
  { value: 5, label: 'Race and Religion', selected: false, locked: false },
  { value: 6, label: 'Other', selected: false, locked: false },
];

@Injectable()
export class NSFWSelectorService {
  cacheKey: string = '';

  reasons: Array<any> = NSFW_REASONS;

  constructor(private cookieService: CookieService) {}

  onInit() {}

  build(): NSFWSelectorService {
    let reasons = JSON.parse(
      this.cookieService.get(`nsfw:${this.cacheKey}`) || `[]`
    );
    for (let reason of this.reasons) {
      reason.selected = reasons.indexOf(reason.value) > -1;
    }
    return this;
  }

  toggle(reason): void {
    if (reason.locked) {
      return;
    }
    for (let r of this.reasons) {
      if (r.value === reason.value) r.selected = !r.selected;
    }
    this.saveToCookie();
  }

  saveToCookie(): void {
    this.cookieService.set(
      `nsfw:${this.cacheKey}`,
      JSON.stringify(this.reasons.filter((r) => r.selected).map((r) => r.value))
    );
  }
}

@Injectable()
export class NSFWSelectorCreatorService extends NSFWSelectorService {
  cacheKey: string = 'creator';
}
@Injectable()
export class NSFWSelectorConsumerService extends NSFWSelectorService {
  cacheKey: string = 'consumer';
}

/**
 * Editing service, overrides build to allow pre-setting of values.
 */
@Injectable()
export class NSFWSelectorEditingService extends NSFWSelectorService {
  cacheKey: string = 'editing';

  build(): NSFWSelectorService {
    return this;
  }
}
