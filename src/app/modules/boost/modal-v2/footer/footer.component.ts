import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { BoostModalPanel, BoostSubject } from '../boost-modal-v2.types';
import { BoostModalV2Service } from '../services/boost-modal-v2.service';

/**
 * Footer for boost modal v2. Text content and button behavior vary
 * based on entity type and active panel.
 */
@Component({
  selector: 'm-boostModalV2__footer',
  templateUrl: './footer.component.html',
  styleUrls: ['footer.component.ng.scss'],
})
export class BoostModalV2FooterComponent implements OnDestroy {
  // enums.
  public BoostSubject: typeof BoostSubject = BoostSubject;
  public BoostModalPanel: typeof BoostModalPanel = BoostModalPanel;

  // currently active modal panel.
  public readonly activePanel$: BehaviorSubject<BoostModalPanel> = this.service
    .activePanel$;

  // entity type of the post that is being boosted.
  public readonly entityType$: Observable<BoostSubject> = this.service
    .entityType$;

  // whether boost submission is in progress.
  public readonly boostSubmissionInProgress$: Observable<boolean> = this.service
    .boostSubmissionInProgress$;

  // subscription fired once on button click.
  private buttonClickSubscription: Subscription;

  public constructor(private service: BoostModalV2Service) {}

  ngOnDestroy(): void {
    this.buttonClickSubscription?.unsubscribe();
  }

  /**
   * Fires on button click and calls to change panel.
   * @param { void } $event - mouse event.
   */
  public onButtonClick($event: MouseEvent): void {
    this.activePanel$
      .pipe(take(1))
      .subscribe((activePanel: BoostModalPanel) => {
        this.service.changePanelFrom(activePanel);
      });
  }
}
