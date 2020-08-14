import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
  Injector,
} from '@angular/core';
import { FeaturesService } from '../../../../../services/features.service';
import { OverlayModalService } from '../../../../../services/ux/overlay-modal';
import { Router } from '@angular/router';
import { ProChannelService } from '../../channel.service';
import isMobile from '../../../../../helpers/is-mobile';
import { SiteService } from '../../../../../common/services/site.service';
import { ActivityModalCreatorService } from '../../../../newsfeed/activity/modal/modal-creator.service';

@Component({
  selector: 'm-pro--channel-tile',
  templateUrl: 'tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProTileComponent {
  @Input() entity: any;
  @ViewChild('img') img: ElementRef;

  videoDimensions: any = null;

  constructor(
    protected featuresService: FeaturesService,
    protected channelService: ProChannelService,
    protected modalService: OverlayModalService,
    protected router: Router,
    protected site: SiteService,
    private activityModalCreator: ActivityModalCreatorService,
    private injector: Injector
  ) {}

  getType(entity: any) {
    return entity.type === 'object'
      ? `${entity.type}:${entity.subtype}`
      : entity.type;
  }

  getTitle() {
    switch (this.getType(this.entity)) {
      case 'object:blog':
        return this.entity.title;
      case 'object:image':
      case 'object:video':
        return this.entity.title && this.entity.title.trim() !== ''
          ? this.entity.title
          : this.entity.message;
      case 'activity':
        return this.entity.title && this.entity.title.trim() !== ''
          ? this.entity.title
          : this.entity.blurb
          ? this.entity.blurb
          : this.entity.message;
      default:
        return '';
    }
  }

  getText() {
    switch (this.getType(this.entity)) {
      case 'object:blog':
        return this.entity.excerpt;
      case 'object:image':
      case 'object:video':
        return this.entity.description;
      case 'activity':
        return this.entity.blurb ? this.entity.blurb : this.entity.message;
      default:
        return '';
    }
  }

  setVideoDimensions($event) {
    this.videoDimensions = $event.dimensions;
  }

  tileClicked() {
    switch (this.getType(this.entity)) {
      case 'object:image':
      case 'object:video':
      case 'object:blog':
        this.showMediaModal();
        break;
    }
  }

  goToEntityPage(entity: any) {
    switch (this.getType(entity)) {
      case 'activity':
        this.router.navigate([`/newsfeed/${entity.guid}`]);
        break;
      case 'object:image':
      case 'object:video':
        this.router.navigate([`/media/${entity.guid}`]);
        break;
      case 'object:blog':
        let url = `/blog/${this.entity.slug}-${this.entity.guid}`;
        if (!this.site.isProDomain) {
          url = `${this.channelService.currentChannel.username}/${url}`;
        }
        this.router.navigate([url]);
        break;
    }
  }

  getEntityType(entity: any) {
    return entity.type === 'object'
      ? `${entity.type}:${entity.subtype}`
      : entity.type;
  }

  showMediaModal() {
    const isNotTablet = Math.min(screen.width, screen.height) < 768;

    // Mobile (not tablet) users go to media page instead of modal
    if (isMobile() && isNotTablet) {
      this.goToEntityPage(this.entity);
      return;
    }

    if (this.getEntityType(this.entity) === 'object:video') {
      this.entity.dimensions = this.videoDimensions;
    } else if (this.getEntityType(this.entity) === 'object:image') {
      // Image
      // Set image dimensions if they're not already there
      const img: HTMLImageElement = this.img.nativeElement;
      this.entity.width = img.naturalWidth;
      this.entity.height = img.naturalHeight;
    }

    this.activityModalCreator.create(this.entity, this.injector);
  }
}
