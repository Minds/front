import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Injector,
} from '@angular/core';
import { AttachmentService } from '../../../services/attachment';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Router } from '@angular/router';
import isMobile from '../../../helpers/is-mobile';
import { FeaturesService } from '../../../services/features.service';
import { ActivityModalCreatorService } from '../activity/modal/modal-creator.service';

@Component({
  selector: 'm-newsfeed__tiles',
  templateUrl: 'tiles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsfeedTilesComponent {
  @Input() entities: any[] = [];

  constructor(
    public attachment: AttachmentService,
    private router: Router,
    private overlayModalService: OverlayModalService,
    private activityModalCreator: ActivityModalCreatorService,
    private injector: Injector
  ) {}

  getThumbnailSrc(entity: any) {
    let src: string = '';

    if (entity && entity.thumbnail_src) {
      src = entity.thumbnail_src;
    } else if (
      entity &&
      entity.custom_data &&
      entity.custom_data[0] &&
      entity.custom_data[0].src
    ) {
      src = entity.custom_data[0].src;
    } else if (
      entity &&
      entity.custom_data &&
      entity.custom_data.thumbnail_src
    ) {
      src = entity.custom_data.thumbnail_src;
    }

    return src || '';
  }

  isUnlisted(entity: any) {
    return entity && (entity.access_id === '0' || entity.access_id === 0);
  }

  /**
   * @param entity
   * @param event
   */
  clickedImage(entity: any, event: MouseEvent) {
    const isNotTablet = Math.min(screen.width, screen.height) < 768;
    const pageUrl = `/media/${entity.entity_guid}`;

    if (isMobile() && isNotTablet) {
      this.router.navigate([pageUrl]);
      return;
    }

    if (entity.width === '0' || entity.height === '0') {
      this.setImageDimensions(entity, event.target as HTMLImageElement);
    }
    this.openModal(entity);
    event.preventDefault();
    event.stopPropagation();
  }

  setImageDimensions(entity, imageElement: HTMLImageElement) {
    const img: HTMLImageElement = imageElement;
    entity.width = img.naturalWidth;
    entity.height = img.naturalHeight;
  }

  openModal(entity) {
    this.activityModalCreator.create(entity, this.injector);
  }
}
