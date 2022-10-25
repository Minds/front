import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { ModalsModule } from '../../modals/modals.module';
import { ConnectTwitterModalComponent } from './connect-twitter-modal.component';

/**
 * Module for lazy loading ConnectTwitterModal.
 * Can be used to lazy-load.
 */
@NgModule({
  imports: [NgCommonModule, CommonModule, ModalsModule],
  declarations: [ConnectTwitterModalComponent],
})
export class ConnectTwitterModalModule {
  /**
   * Resolve component to ConnectTwitterModalComponent instance.
   * @returns { typeof ConnectTwitterModalComponent }
   */
  public resolveComponent(): typeof ConnectTwitterModalComponent {
    return ConnectTwitterModalComponent;
  }
}
