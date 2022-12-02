import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BoostSubject } from '../boost-modal-v2.types';
import { BoostModalV2Service } from '../services/boost-modal-v2.service';

/**
 * Boost modal header - displays different title based on entity type.
 */
@Component({
  selector: 'm-boostModalV2__header',
  template: `
    <div class="m-modalV2__header">
      <h2
        class="m-modalV2Header__title"
        [ngSwitch]="entityType$ | async"
        data-ref="boost-modal-v2-header-title"
      >
        <ng-container
          *ngSwitchCase="'post'"
          i18n="@@BOOST_MODAL_V2__TITLE__BOOST_POST"
        >
          Boost Post
        </ng-container>
        <ng-container
          *ngSwitchCase="'channel'"
          i18n="@@BOOST_MODAL_V2__TITLE__BOOST_CHANNEL"
        >
          Boost Channel
        </ng-container>
        <ng-container *ngSwitchDefault i18n="@@BOOST_MODAL_V2__TITLE__BOOST">
          Boost
        </ng-container>
      </h2>
      <m-modalCloseButton
        [color]="'white'"
        [absolutePosition]="false"
        data-ref="boost-modal-v2-header-close-button"
      ></m-modalCloseButton>
    </div>
  `,
  styleUrls: ['header.component.ng.scss'],
})
export class BoostModalV2HeaderComponent {
  // type of the entity.
  public entityType$: Observable<BoostSubject> = this.service.entityType$;

  constructor(private service: BoostModalV2Service) {}
}
