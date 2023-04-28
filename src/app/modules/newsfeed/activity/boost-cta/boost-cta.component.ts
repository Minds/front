import { Component, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import { BoostGoalButtonText } from '../../../boost/boost.types';
import { Session } from '../../../../services/session';
import {
  ClientMetaData,
  ClientMetaService,
} from '../../../../common/services/client-meta.service';
import { ClientMetaDirective } from '../../../../common/directives/client-meta.directive';
import { ActivityEntity } from '../activity.service';
import { BoostGoalsExperimentService } from '../../../experiments/sub-services/boost-goals-experiment.service';

/**
 * The button that displays for boosts when users have
 * created a boost with a goal that is associated with a CTA button.
 *
 * Depending on the goal, the button may be a subscribe button
 * or one that opens a new window with a custom url
 */
@Component({
  selector: 'm-activity__boostCta',
  templateUrl: './boost-cta.component.html',
  styleUrls: ['./boost-cta.component.ng.scss'],
})
export class ActivityBoostCtaComponent {
  // public readonly BoostGoalButtonText = BoostGoalButtonText;
  public BoostGoalButtonText: typeof BoostGoalButtonText = BoostGoalButtonText;
  /**
   * The numeric code that corresponds to the user's chosen text to display on the button
   */
  protected textEnum: BoostGoalButtonText = 2; // ojm remove default

  /**
   * The url string that the user will go to if they click the button
   */
  protected url: string;

  // set to true once a click is recorded.
  private clickRecorded: boolean = false;

  /**
   * Whether the current user is subscribed to (or IS) the boost owner when this component is first loaded
   */
  subscribedOnLoad: boolean = false;

  /**
   * The owner of the boost with the CTA. Used to determine subscription status.
   */
  private _entity: ActivityEntity;
  @Input() set entity(entity: ActivityEntity) {
    if (entity) {
      this._entity = entity;
    }

    if (entity.ownerObj && this.session.getLoggedInUser()) {
      this.subscribedOnLoad =
        entity.ownerObj.subscribed ||
        entity.ownerObj.guid === this.session.getLoggedInUser().guid;
    }

    this.textEnum = this.entity?.goal_button_text;
    this.url = this.entity?.goal_button_url;
  }

  get entity(): ActivityEntity {
    return this._entity;
  }

  constructor(
    protected boostGoalsExperiment: BoostGoalsExperimentService,
    private session: Session,
    private clientMetaService: ClientMetaService,
    @SkipSelf() @Optional() private parentClientMeta: ClientMetaDirective
  ) {}

  /**
   * Records a click on the cta button
   * @param { MouseEvent } $event - mouse event.
   * @returns { void }
   */
  public recordClick($event: MouseEvent): void {
    if (this.clickRecorded) {
      return;
    }
    this.clickRecorded = true;

    const extraClientMetaData: Partial<ClientMetaData> = {};

    if (Boolean(this.entity.boosted_guid) && Boolean(this.entity.urn)) {
      extraClientMetaData.campaign = this.entity.urn;
    }

    this.clientMetaService.recordClick(
      this.entity.guid,
      this.parentClientMeta,
      extraClientMetaData
    );
  }
}
