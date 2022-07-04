import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Horizontal animation indicating composer media attachment is in progress
 */
@Component({
  selector: 'm-composer__progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'progress.component.html',
})
export class ProgressComponent {
  @Input() inProgress: boolean = false;

  @Input() progress: number = 0;

  /**
   * Compact mode
   */
  @Input() compactMode: boolean = false;

  get progressPct() {
    return (this.progress || 0) * 100;
  }

  get active() {
    return this.inProgress && this.progressPct < 99.9; // First 99.9%
  }

  get indeterminate() {
    return this.inProgress && this.progressPct >= 99.9;
  }

  get currentProgressWidth() {
    if (!this.inProgress || this.indeterminate) {
      return void 0;
    }

    return `${this.progressPct}%`;
  }
}
