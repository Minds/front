import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { InteractionsModalComponent } from './interactions-modal.component';
import { NewsfeedModule } from '../newsfeed.module';
import { ModalCloseButtonComponent } from '../../../common/components/modal-close-button/modal-close-button.component';

@NgModule({
  imports: [
    CommonModule,
    NgCommonModule,
    NewsfeedModule, // For m-newsfeed__entity
    ModalCloseButtonComponent,
  ],
  declarations: [InteractionsModalComponent],
})
export class InteractionsModalModule {
  public resolveComponent(): typeof InteractionsModalComponent {
    return InteractionsModalComponent;
  }
}
