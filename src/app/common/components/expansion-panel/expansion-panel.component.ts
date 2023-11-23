import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Generic panel that starts off closed and
 * can be clicked open to reveal
 * additional projected content
 */
@Component({
  selector: 'm-expansionPanel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.ng.scss'],
})
export class ExpansionPanelComponent {
  protected expanded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  protected toggleExpansion(): void {
    this.expanded$.next(!this.expanded$.value);
  }
}
