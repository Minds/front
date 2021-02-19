import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MindsUser } from '../../../../interfaces/entities';
import { Session } from '../../../../services/session';
import {
  BoostModalService,
  BoostSubject,
  BoostTab,
} from '../boost-modal.service';

/**
 * Offer and newsfeed tabs for boost modal.
 */
@Component({
  selector: 'm-boostModal__tabs',
  templateUrl: './boost-modal-tabs.component.html',
  styleUrls: ['./boost-modal-tabs.component.ng.scss'],
})
export class BoostModalTabsComponent {
  constructor(private service: BoostModalService, private session: Session) {}

  /**
   * Should tabs be shown?
   * @returns { Observable<boolean> } - true if tabs should be shown.
   */
  get showTabs$(): Observable<boolean> {
    return this.service.entityType$.pipe(map(subject => subject === 'post'));
  }

  /**
   * Gets active tab from service.
   * @returns { BehaviorSubject<BoostTab> } - the active tab.
   */
  get activeTab$(): BehaviorSubject<BoostTab> {
    return this.service.activeTab$;
  }

  /**
   * Gets entity type from service.
   * @returns { Observable<BoostSubject> } - type of entity, channel or post.
   */
  get entityType$(): Observable<BoostSubject> {
    return this.service.entityType$;
  }

  /**
   * On next tab click.
   * @param { BoostTab } - clicked tab.
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
}
