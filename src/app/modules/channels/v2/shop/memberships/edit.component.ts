import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import noOp from '../../../../../helpers/no-op';
import { SupportTier } from '../../../../wire/v2/support-tiers.service';
import { ChannelShopMembershipsEditService } from './edit.service';

@Component({
  selector: 'm-channelShopMemberships__edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'edit.component.html',
  providers: [ChannelShopMembershipsEditService],
})
export class ChannelShopMembershipsEditComponent {
  /**
   * Save intent
   */
  onSave: (any) => any = noOp;

  /**
   * Dismiss intent
   */
  onDismissIntent: () => void = noOp;

  /**
   * Modal options
   * @param onSave
   * @param onDismissIntent
   */
  set opts({ onSave, onDismissIntent }) {
    this.onSave = onSave || noOp;
    this.onDismissIntent = onDismissIntent || noOp;
  }

  /**
   *
   * @param supportTier
   */
  @Input('supportTier') set data(supportTier: SupportTier | null) {
    this.load(supportTier);
  }

  /**
   * Constructor
   * @param service
   */
  constructor(public service: ChannelShopMembershipsEditService) {}

  /**
   * Loads a Support Tier into the editor
   * @param supportTier
   */
  load(supportTier: SupportTier): void {
    this.service.reset();

    if (!supportTier) {
      return;
    }

    this.service.load(supportTier);
  }

  /**
   * Saves a Support Tier
   */
  async save(): Promise<void> {
    const supportTier = await this.service.save().toPromise();

    if (supportTier) {
      this.onSave(supportTier);
    }
  }
}
