import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { WireV2Service } from '../../wire-v2.service';
import { ConfigsService } from '../../../../../common/services/configs.service';

/**
 * Bottom toolbar for Wire modal
 */
@Component({
  selector: 'm-wireCreator__toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.ng.scss'],
})
export class WireCreatorToolbarComponent {
  readonly cdnAssetsUrl: string;

  /**
   * Constructor
   * @param service
   */
  constructor(public service: WireV2Service, private configs: ConfigsService) {
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');
  }

  /**
   * Submit intent
   */
  @Output('onSubmit') onSubmitEmitter: EventEmitter<void> = new EventEmitter<
    void
  >();

  /**
   * Submit button event handler
   * @param $event
   */
  onSubmitClick($event?: MouseEvent): void {
    this.onSubmitEmitter.emit();
  }
}
