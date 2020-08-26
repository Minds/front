import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { ConfigsService } from '../../../../../common/services/configs.service';

@Component({
  selector: 'm-pro--channel--group-tile',
  templateUrl: 'group-tile.component.html',
})
export class ProGroupTileComponent {
  readonly cdnUrl: string;

  @Input() entity: any;

  @Output('onOpen') onOpenEventEmitter: EventEmitter<
    boolean
  > = new EventEmitter();

  constructor(configs: ConfigsService) {
    this.cdnUrl = configs.get('cdn_url');
  }

  getBanner() {}

  getAvatar() {}

  @HostListener('click') onClick() {
    this.onOpenEventEmitter.emit(true);
  }
}
