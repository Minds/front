import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { SideBarSelectorChange } from '../../hashtags/sidebar-selector/sidebar-selector.component';
import { debounceTime } from 'rxjs/operators';

@Injectable()
export class NewsfeedHashtagSelectorService {
  protected hashtagFilterChangeSubject: Subject<
    SideBarSelectorChange
  > = new Subject<SideBarSelectorChange>();

  emit(value: SideBarSelectorChange) {
    this.hashtagFilterChangeSubject.next(value);
  }

  subscribe(
    next: (value: SideBarSelectorChange) => void,
    debounce?: number
  ): Subscription {
    let hashtagFilterChangeSubject: any = this.hashtagFilterChangeSubject;

    if (debounce) {
      hashtagFilterChangeSubject = hashtagFilterChangeSubject.pipe(
        debounceTime(debounce)
      );
    }

    return hashtagFilterChangeSubject.subscribe(next);
  }
}
