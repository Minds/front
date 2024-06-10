import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { InteractionsModalComponent } from './interactions-modal.component';
import { NewsfeedModule } from '../newsfeed.module';

@NgModule({
  imports: [
    CommonModule,
    NgCommonModule,
    NewsfeedModule, // For m-newsfeed__entity
  ],
  declarations: [InteractionsModalComponent],
})
export class InteractionsModalModule {
  public resolveComponent(): typeof InteractionsModalComponent {
    return InteractionsModalComponent;
  }
}
