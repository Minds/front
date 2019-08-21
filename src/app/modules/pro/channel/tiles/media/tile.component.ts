import { Component, Input } from '@angular/core';

@Component({
  selector: 'm-pro--channel-tile',
  template: `
    <img [src]="entity.thumbnail_src">
    <div class="m-proChannelTile__text" *ngIf="getTitle() || getText()">
      <h2 [title]="getTitle()">{{ getTitle() }}</h2>
    </div>
  `
})

export class ProTileComponent {
  @Input() entity: any;

  static getType(entity: any) {
    return entity.type === 'object' ? `${entity.type}:${entity.subtype}` : entity.type;
  }

  getTitle() {
    switch (ProTileComponent.getType(this.entity)) {
      case 'object:blog':
        return this.entity.title;
      case 'object:image':
      case 'object:video':
        return this.entity.title && this.entity.title.trim() !== '' ? this.entity.title : this.entity.message;
      default:
        return '';
    }
  }

  getText() {
    switch (ProTileComponent.getType(this.entity)) {
      case 'object:blog':
        return this.entity.excerpt;
      case 'object:image':
      case 'object:video':
        return this.entity.description;
      default:
        return '';
    }
  }

}
