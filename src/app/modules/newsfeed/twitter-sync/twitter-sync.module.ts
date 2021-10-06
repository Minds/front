import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TwitterSyncComponent } from './twitter-sync.component';
import { TwitterSyncService } from './twitter-sync.service';

@NgModule({
  imports: [
    CommonModule,
    NgCommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: TwitterSyncComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [TwitterSyncComponent],
  providers: [TwitterSyncService],
})
export class TwitterSyncModule {}
