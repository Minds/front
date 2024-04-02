import { Inject, Injectable, Injector, createNgModule } from '@angular/core';
import { ModalRef, ModalService } from '../../../../services/ux/modal.service';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';
import { StartChatModalServiceComponent } from './start-chat-modal.component';
import { StartChatModalModule } from './start-chat-modal.module';
import { Router } from '@angular/router';

/**
 * Start chat modal service - opens modal to allow the user to select participants to start
 * a chat with.
 */
@Injectable({ providedIn: 'root' })
export class StartChatModalService {
  constructor(
    private injector: Injector,
    private modalService: ModalService,
    private router: Router,
    @Inject(IS_TENANT_NETWORK) public readonly isTenantNetwork: boolean
  ) {}

  /**
   * Opens the start chat modal.
   * @param { boolean } openOnSuccess - Whether to open the chat room on success.
   * @returns { Promise<string> } - The chat room id.
   */
  public async open(openOnSuccess: boolean = false): Promise<string> {
    const componentRef: typeof StartChatModalServiceComponent = await this.getComponentRef();

    const modal: ModalRef<any> = this.modalService.present(componentRef, {
      injector: this.injector,
      lazyModule: StartChatModalModule,
      size: 'md',
      data: {
        onCompleted: (chatRoomId: string) => {
          modal.close(chatRoomId);
        },
      },
    });

    if (openOnSuccess) {
      const result: string = await modal.result;
      if (result) {
        this.router.navigate([`/chat/rooms/${result}`]);
        return result;
      }
    }

    return modal.result;
  }

  /**
   * Gets reference to component to load
   * @returns { Promise<typeof StartChatModalServiceComponent> }
   */
  private async getComponentRef(): Promise<
    typeof StartChatModalServiceComponent
  > {
    return createNgModule<StartChatModalModule>(
      (await import('./start-chat-modal.module')).StartChatModalModule,
      this.injector
    ).instance.resolveComponent();
  }
}
