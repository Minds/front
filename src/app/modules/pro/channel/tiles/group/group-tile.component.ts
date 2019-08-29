import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'm-pro--channel--group-tile',
  template: `
    <div class="banner">
      <img [src]="getBanner()" />
    </div>
    <div class="m-proChannelGroupTile__content">
      <div class="avatar">
        <img [src]="getAvatar()" />
      </div>
      <div class="body">
        <h2>{{ this.entity.name }}</h2>
        <p i18n>
          Subscribers: <span>{{ this.entity['members:count'] }}</span>
        </p>
      </div>
    </div>
  `,
})
export class ProGroupTileComponent {
  @Input() entity: any;

  @Output('onOpen') onOpenEventEmitter: EventEmitter<
    boolean
  > = new EventEmitter();

  minds = window.Minds;

  getBanner() {
    return `/fs/v1/banners/${this.entity.guid}/${this.entity.banner_position}/'${this.entity.banner}`;
  }

  getAvatar() {
    return `${this.minds.cdn_url}fs/v1/avatars/${this.entity.guid}/large/${this.entity.icontime}`;
  }

  @HostListener('click') onClick() {
    this.onOpenEventEmitter.emit(true);
  }
}
