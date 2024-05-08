import {
  createNgModule,
  Inject,
  Injectable,
  Injector,
  PLATFORM_ID,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ModalRef, ModalService } from '../../../services/ux/modal.service';
import { BoostModalV2LazyModule } from './boost-modal-v2-lazy.module';
import { BoostModalV2Component } from './boost-modal-v2.component';
import { BoostableEntity, BoostModalExtraOpts } from './boost-modal-v2.types';
import { UpsellModalService } from '../../modals/upsell/upsell-modal.service';
import { isPlatformBrowser } from '@angular/common';
import { Session } from '../../../services/session';
import { PermissionsService } from '../../../common/services/permissions.service';
import { ToasterService } from '../../../common/services/toaster.service';

type PresentableBoostModalComponent = typeof BoostModalV2Component;

/**
 * Lazy loads boost modal.
 */
@Injectable({ providedIn: 'root' })
export class BoostModalV2LazyService {
  // emitted to on boost completion.
  public onComplete$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private modalService: ModalService,
    private injector: Injector,
    private upsellModal: UpsellModalService,
    private session: Session,
    private permissionsService: PermissionsService,
    private toasterService: ToasterService,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  /**
   * Lazy load modules and open modal.
   * @param { BoostableEntity } entity - entity that can be boosted.
   * @returns { Promise<ModalRef<PresentableBoostModalComponent>>} - awaitable.
   */
  public async open(
    entity: BoostableEntity,
    extraOpts: BoostModalExtraOpts = {}
  ): Promise<ModalRef<PresentableBoostModalComponent>> {
    if (!this.permissionsService.canBoost()) {
      this.toasterService.warn('You do not have permission to boost.');
      return;
    }

    const componentRef: PresentableBoostModalComponent =
      await this.getComponentRef();
    const modal = this.modalService.present(componentRef, {
      data: {
        entity: entity,
        onSaveIntent: () => {
          this.onComplete$.next(true);
          modal.close();
          this.openUpsellModal();
        },
        ...extraOpts,
      },
      size: 'md',
    });

    return modal;
  }

  /**
   * Gets reference to component to load based on whether dynamic boost experiment is active.
   * @returns { Promise<PresentableBoostModalComponent> }
   */
  private async getComponentRef(): Promise<PresentableBoostModalComponent> {
    return createNgModule<BoostModalV2LazyModule>(
      (await import('./boost-modal-v2-lazy.module')).BoostModalV2LazyModule,
      this.injector
    ).instance.resolveComponent();
  }

  /**
   * Present upsell modal to users
   * who just boosted but haven't upgraded yet
   */
  private async openUpsellModal() {
    if (
      !(
        this.session.getLoggedInUser().plus ||
        this.session.getLoggedInUser().pro
      )
    ) {
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.upsellModal.open(), 400);
      }
    }
  }
}
