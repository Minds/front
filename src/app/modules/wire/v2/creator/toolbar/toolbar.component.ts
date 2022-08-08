import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { WireV2Service } from '../../wire-v2.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { Observable, combineLatest } from 'rxjs';
import { map, last, first } from 'rxjs/operators';

/**
 * Bottom action button toolbar for Wire modal
 */
@Component({
  selector: 'm-wireCreator__toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.ng.scss'],
})
export class WireCreatorToolbarComponent {
  readonly cdnAssetsUrl: string;

  disabled: Observable<boolean> = combineLatest(
    this.service.validation$,
    this.service.inProgress$,
    this.service.supportTier$
  ).pipe(
    map(([validation, inProgress, supportTier]) => {
      return Boolean(
        !(validation && validation.isValid) ||
          inProgress ||
          (supportTier && supportTier.subscription_urn)
      );
    })
  );

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
  async onSubmitClick($event?: MouseEvent): Promise<void> {
    if (await this.disabled.pipe(first()).toPromise()) return;
    this.onSubmitEmitter.emit();
  }
}
