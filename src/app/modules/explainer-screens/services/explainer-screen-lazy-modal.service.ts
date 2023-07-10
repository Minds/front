import { Injectable, Injector, createNgModule } from '@angular/core';
import { ModalRef, ModalService } from '../../../services/ux/modal.service';
import { ExplainerScreenModalComponent } from '../components/explainer-screen-modal.component';
import { ExplainerScreenModalLazyModule } from '../explainer-screen-modal-lazy.module';
import { ExplainerScreenWeb } from '../../../../graphql/generated.strapi';
import { DismissalV2Service } from '../../../common/services/dismissal-v2.service';
import { firstValueFrom } from 'rxjs';

/**
 * Service managing the opening of an explainer screen modal.
 */
@Injectable({ providedIn: 'root' })
export class ExplainerScreenModalService {
  constructor(
    private injector: Injector,
    private modal: ModalService,
    private dismissV2Service: DismissalV2Service
  ) {}

  /**
   * Open explainer screen modal with given data.
   * @param { ExplainerScreenWeb } explainerScreenData - data to pass to modal.
   * @returns { Promise<ModalRef<ExplainerScreenModalComponent>> } - modal reference.
   */
  public async open(
    explainerScreenData: ExplainerScreenWeb
  ): Promise<ModalRef<ExplainerScreenModalComponent>> {
    const lazyComponent = createNgModule<ExplainerScreenModalLazyModule>(
      (await import('../explainer-screen-modal-lazy.module'))
        .ExplainerScreenModalLazyModule,
      this.injector
    ).instance.resolveComponent();

    const modal: ModalRef<ExplainerScreenModalComponent> = this.modal.present(
      lazyComponent,
      {
        data: {
          onDismissIntent: () => {
            modal.close();
          },
          explainerScreenData: explainerScreenData,
        },
        injector: this.injector,
        size: 'lg',
      }
    );

    // handle updating server and local state on modal close.
    // This is here and NOT in dismiss as this will also catch
    // the case where the user clicks outside the modal to dismiss.
    modal.result.then(async data => {
      await firstValueFrom(
        this.dismissV2Service.dismiss(explainerScreenData.key)
      );
    });

    return modal;
  }
}
