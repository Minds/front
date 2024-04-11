import {
  createNgModule,
  Inject,
  Injectable,
  Injector,
  PLATFORM_ID,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  ModalRef,
  ModalService,
} from '../../../../../../../services/ux/modal.service';
import { AddFeaturedEntityModalComponent } from './add-featured-entity-modal.component';
import { AddFeaturedEntityModalLazyModule } from './add-featured-entity-modal-lazy.module';
import {
  MindsGroup,
  MindsUser,
} from '../../../../../../../interfaces/entities';
import { AddFeaturedEntityModalEntityType } from './add-featured-entity-modal.types';

/**
 * Service for loading the modal for adding featured entities lazily.
 */
@Injectable({ providedIn: 'root' })
export class AddFeaturedEntityModalLazyService {
  /** Will emit an entity on completion when an entity is passed back from component. */
  public entity$: Subject<MindsUser | MindsGroup> = new Subject<
    MindsUser | MindsGroup
  >();

  constructor(
    private modalService: ModalService,
    private injector: Injector,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  /**
   * Lazy load module and open modal.
   * @param { AddFeaturedEntityModalEntityType } entityType - type of entity that can be selected.
   * @returns { Promise<ModalRef<AddFeaturedEntityModalComponent>> } - modal reference.
   */
  public async open(
    entityType: AddFeaturedEntityModalEntityType = AddFeaturedEntityModalEntityType.User
  ): Promise<ModalRef<AddFeaturedEntityModalComponent>> {
    const componentRef: typeof AddFeaturedEntityModalComponent =
      await this.getComponentRef();
    const modal = this.modalService.present(componentRef, {
      size: 'md',
      data: {
        onSaveIntent: (entity: MindsUser | MindsGroup): void => {
          this.entity$.next(entity);
          modal.close();
        },
        entityType: entityType,
      },
    });
    return modal;
  }

  /**
   * Gets reference to component to load.
   * @returns { Promise<typeof AddFeaturedEntityModalComponent> } modal component.
   */
  private async getComponentRef(): Promise<
    typeof AddFeaturedEntityModalComponent
  > {
    return createNgModule<AddFeaturedEntityModalLazyModule>(
      (await import('./add-featured-entity-modal-lazy.module'))
        .AddFeaturedEntityModalLazyModule,
      this.injector
    ).instance.resolveComponent();
  }
}
