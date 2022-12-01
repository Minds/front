import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';
import { Session } from '../../../../services/session';
import { CashBoostsExperimentService } from '../../../experiments/sub-services/cash-boosts-experiment.service';
import { BoostModalService } from '../boost-modal.service';
import { BoostableEntity, BoostSubject, BoostTab } from '../boost-modal.types';

/**
 * Cash and tokens tabs for boost modal.
 */
@Component({
  selector: 'm-boostModal__tabs',
  templateUrl: './boost-modal-tabs.component.html',
  styleUrls: ['./boost-modal-tabs.component.ng.scss'],
})
export class BoostModalTabsComponent {
  constructor(
    private service: BoostModalService,
    private session: Session,
    private cashExperiment: CashBoostsExperimentService
  ) {}

  // Active tab from service.
  public activeTab$: BehaviorSubject<BoostTab> = this.service.activeTab$;

  // Entity type from service.
  public entityType$: Observable<BoostSubject> = this.service.entityType$;

  // Entity from service.
  public entity$: BehaviorSubject<BoostableEntity> = this.service.entity$;

  /**
   * On next tab click.
   * @param { BoostTab } tab - clicked tab.
   * @returns { void }
   */
  public nextTab(tab: BoostTab): void {
    this.activeTab$.next(tab);
  }

  /**
   * Gets currently logged in user from session service.
   * @returns { MindsUser } - currently logged in user.
   */
  public getLoggedInUser(): MindsUser {
    return this.session.getLoggedInUser();
  }

  /**
   * Whether boost experiment is active.
   * @returns { boolean } true if experiment is active.
   */
  public isCashExperimentActive(): boolean {
    return this.cashExperiment.isActive();
  }
}
