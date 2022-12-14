import { createNgModuleRef, Injectable, Injector } from '@angular/core';
import { ModalRef, ModalService } from '../../../services/ux/modal.service';
import { DynamicBoostExperimentService } from '../../experiments/sub-services/dynamic-boost-experiment.service';
import { BoostModalV2LazyModule } from '../modal-v2/boost-modal-v2-lazy.module';
import { BoostModalV2Component } from '../modal-v2/boost-modal-v2.component';
import { BoostModalLazyModule } from './boost-modal-lazy.module';
import { BoostModalComponent } from './boost-modal.component';
import { BoostableEntity } from './boost-modal.types';

type PresentableBoostModalComponent =
  | typeof BoostModalV2Component
  | typeof BoostModalComponent;

/**
 * Lazy loads boost modal.
 */
@Injectable({ providedIn: 'root' })
export class BoostModalLazyService {
  constructor(
    private modalService: ModalService,
    private injector: Injector,
    private dynamicBoostExperiment: DynamicBoostExperimentService
  ) {}

  /**
   * Lazy load modules and open modal.
   * @param { BoostableEntity } entity - entity that can be boosted.
   * @returns { Promise<ModalRef<PresentableBoostModalComponent>>} - awaitable.
   */
  public async open(
    entity: BoostableEntity = {}
  ): Promise<ModalRef<PresentableBoostModalComponent>> {
    const componentRef: PresentableBoostModalComponent = await this.getComponentRef();
    const modal = this.modalService.present(componentRef, {
      data: {
        entity: entity,
        onSaveIntent: () => modal.close(),
      },
      size: this.getModalSize(),
    });
    return modal;
  }

  /**
   * Gets reference to component to load based on whether dynamic boost experiment is active.
   * @returns { Promise<PresentableBoostModalComponent> }
   */
  private async getComponentRef(): Promise<PresentableBoostModalComponent> {
    return createNgModuleRef<BoostModalV2LazyModule | BoostModalLazyModule>(
      this.dynamicBoostExperiment.isActive()
        ? (await import('../modal-v2/boost-modal-v2-lazy.module'))
            .BoostModalV2LazyModule
        : (await import('./boost-modal-lazy.module')).BoostModalLazyModule,
      this.injector
    ).instance.resolveComponent();
  }

  private getModalSize(): string {
    return this.dynamicBoostExperiment.isActive() ? 'md' : 'lg';
  }
}
