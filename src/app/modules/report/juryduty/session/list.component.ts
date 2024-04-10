import { Component, Input } from '@angular/core';

import { JurySessionService } from './session.service';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';

@Component({
  selector: 'm-jurydutySession__list',
  templateUrl: 'list.component.html',
})
export class JuryDutySessionListComponent extends AbstractSubscriberComponent {
  @Input() juryType = 'appeal';

  offset = null;
  hasNext = true;
  count: number = 0;

  // subject holding reports.
  public readonly reports$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );

  public readonly inProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  constructor(private sessionService: JurySessionService) {
    super();
  }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.inProgress$.next(true);
    let result: any = await this.sessionService.getList({
      juryType: this.juryType,
    });

    this.count = result['count'];
    this.hasNext = result['has-next'];
    this.offset = result['load-next'];
    this.reports$.next(result.reports);
    this.inProgress$.next(false);
  }

  /**
   * Load more items using existing offset, push new reports to reports array.
   * @returns { Promise<void> } - awaitable.
   */
  async loadMore(): Promise<void> {
    this.inProgress$.next(true);
    let result: any = await this.sessionService.getList({
      juryType: this.juryType,
      offset: this.offset,
    });

    this.offset = result['load-next'];
    this.hasNext = result['has-next'];

    if (result && result.reports && result.reports.length) {
      // sub to existing reports to get current value.
      this.subscriptions.push(
        this.reports$.pipe(take(1)).subscribe((existingReports) => {
          // concat already loaded reports with new ones.
          this.reports$.next([...existingReports, ...result.reports]);
        })
      );
    }

    this.inProgress$.next(false);
  }
}
