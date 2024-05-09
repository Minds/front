import { Injectable, Injector, createNgModule } from '@angular/core';
import {
  ModalRef,
  ModalService,
} from '../../../../../services/ux/modal.service';
import { CreateApiKeyModalComponent } from './create-api-key-modal.component';
import { CreateApiKeyModalModule } from './create-api-key-modal.module';
import { PersonalApiKey } from '../../../../../../graphql/generated.engine';

/**
 * Create personal API key modal service.
 */
@Injectable({ providedIn: 'root' })
export class CreateApiKeyModalService {
  constructor(
    private injector: Injector,
    private modalService: ModalService
  ) {}

  /**
   * Opens the create API key modal.
   * @returns { Promise<PersonalApiKey> } - The generated personal API key.
   */
  public async open(): Promise<PersonalApiKey> {
    const componentRef: typeof CreateApiKeyModalComponent =
      await this.getComponentRef();

    const modal: ModalRef<any> = this.modalService.present(componentRef, {
      injector: this.injector,
      lazyModule: CreateApiKeyModalModule,
      size: 'md',
      data: {
        onCompleted: (personalApiKey: PersonalApiKey) => {
          modal.close(personalApiKey);
        },
      },
    });

    return modal.result;
  }

  /**
   * Gets reference to component to load.
   * @returns { Promise<typeof CreateApiKeyModalComponent> }
   */
  private async getComponentRef(): Promise<typeof CreateApiKeyModalComponent> {
    return createNgModule<CreateApiKeyModalModule>(
      (await import('./create-api-key-modal.module')).CreateApiKeyModalModule,
      this.injector
    ).instance.resolveComponent();
  }
}
