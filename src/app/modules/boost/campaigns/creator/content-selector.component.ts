import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CampaignType } from '../campaign.type';

@Component({
  selector: 'm-boost-campaigns-creator--content-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'content-selector.component.html',
})
export class BoostCampaignsCreatorContentSelectorComponent {

  @Input() type: CampaignType;

  @Input() mModel: string[];

  @Output() mModelChange: EventEmitter<string[]> = new EventEmitter();
}
