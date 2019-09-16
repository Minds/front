import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'm-pro--channel--group-tile',
  templateUrl: 'group-tile.component.html',
})
export class ProGroupTileComponent {
  @Input() entity: any;

  @Output('onOpen') onOpenEventEmitter: EventEmitter<
    boolean
  > = new EventEmitter();

  minds = window.Minds;

  getBanner() {
    return `${this.minds.cdn_url}fs/v1/banners/${this.entity.guid}/${this.entity.banner_position}/'${this.entity.banner}`;
  }

  getAvatar() {
    return `${this.minds.cdn_url}fs/v1/avatars/${this.entity.guid}/large/${this.entity.icontime}`;
  }

  @HostListener('click') onClick() {
    this.onOpenEventEmitter.emit(true);
  }
}
