import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { BoostModalV2LazyService } from '../../../boost/modal-v2/boost-modal-v2-lazy.service';
import { ModalService } from '../../../../services/ux/modal.service';
import { PermissionsService } from '../../../../common/services/permissions.service';

/**
 * Boost button (owner)
 */
@Component({
  selector: 'm-channelActions__boost',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'boost.component.html',
})
export class ChannelActionsBoostComponent implements OnInit {
  /** Whether the user has permission to boost. */
  protected hasBoostPermission: boolean = false;

  constructor(
    public service: ChannelsV2Service,
    protected modalService: ModalService,
    private boostModal: BoostModalV2LazyService,
    private permissionsService: PermissionsService
  ) {}

  ngOnInit(): void {
    this.hasBoostPermission = this.permissionsService.canBoost();
  }

  /**
   * Opens the boost modal
   */
  async onClick(e: MouseEvent): Promise<void> {
    await this.boostModal.open(this.service.channel$.getValue());
  }
}
