import {
  createNgModule,
  Inject,
  Injectable,
  Injector,
  PLATFORM_ID,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ModalRef, ModalService } from '../../../services/ux/modal.service';
import { PlusVerifyModalComponent } from './verify-modal.component';
import { PlusVerifyModalLazyModule } from './verify-modal-lazy.module';
import { Session } from '../../../services/session';
import { ToasterService } from '../../../common/services/toaster.service';

/**
 * Lazy loads plus verify modal.
 */
@Injectable({ providedIn: 'root' })
export class PlusVerifyModalLazyService {
  // emitted to on completion.
  public onComplete$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private modalService: ModalService,
    private session: Session,
    private injector: Injector,
    private toaster: ToasterService,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {}

  /**
   * Lazy load modules and open modal.
   * @returns { Promise<ModalRef<PlusVerifyModalComponent>>} - awaitable.
   */
  public async open(): Promise<ModalRef<PlusVerifyModalComponent>> {
    if (this.session.getLoggedInUser()?.verified) {
      this.toaster.error('Your channel is already verified');
      return;
    }

    const componentRef: typeof PlusVerifyModalComponent = await this.getComponentRef();

    const modal = this.modalService.present(componentRef, {
      data: {
        onCompleted: () => {
          this.onComplete$.next(true);
          modal.close();
        },
      },
      size: 'md',
    });

    return modal;
  }

  /**
   * Gets reference to component to load
   * @returns { Promise<PlusVerifyModalComponent> }
   */
  private async getComponentRef(): Promise<typeof PlusVerifyModalComponent> {
    return createNgModule<PlusVerifyModalLazyModule>(
      (await import('./verify-modal-lazy.module')).PlusVerifyModalLazyModule,
      this.injector
    ).instance.resolveComponent();
  }
}
