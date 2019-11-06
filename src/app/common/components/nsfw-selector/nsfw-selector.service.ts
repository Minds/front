import { Storage } from '../../../services/storage';

export class NSFWSelectorService {
  cacheKey: string = '';

  reasons: Array<any> = [
    { value: 1, label: 'Nudity', selected: false, locked: false },
    { value: 2, label: 'Pornography', selected: false, locked: false },
    { value: 3, label: 'Profanity', selected: false, locked: false },
    { value: 4, label: 'Violence and Gore', selected: false, locked: false },
    { value: 5, label: 'Race and Religion', selected: false, locked: false },
    { value: 6, label: 'Other', selected: false, locked: false },
  ];

  constructor(private storage: Storage) {}

  onInit() {}

  build(): NSFWSelectorService {
    let reasons = this.storage.get(`nsfw:${this.cacheKey}`) || [];
    for (let reason of this.reasons) {
      reason.selected = reasons.indexOf(reason.value) > -1;
    }
    return this;
  }

  toggle(reason) {
    if (reason.locked) {
      return;
    }
    for (let r of this.reasons) {
      if (r.value === reason.value) r.selected = !r.selected;
    }
    this.storage.set(
      `nsfw:${this.cacheKey}`,
      this.reasons.filter(r => r.selected).map(r => r.value)
    );
  }
}

export class NSFWSelectorCreatorService extends NSFWSelectorService {
  cacheKey: string = 'creator';
}
export class NSFWSelectorConsumerService extends NSFWSelectorService {
  cacheKey: string = 'consumer';
}
export class NSFWSelectorEditingService extends NSFWSelectorService {
  cacheKey: string = 'editing';

  build(): NSFWSelectorService {
    return this;
  }
}
