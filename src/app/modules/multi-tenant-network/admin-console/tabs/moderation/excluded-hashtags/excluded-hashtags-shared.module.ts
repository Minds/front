import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../../../common/common.module';
import { NetworkAdminConsoleExcludedHashtagsListItemComponent } from './list-item/excluded-hashtags-list-item.component';
import { NetworkAdminConsoleExcludedHashtagsListComponent } from './list/excluded-hashtags-list.component';

@NgModule({
  imports: [NgCommonModule, CommonModule],
  declarations: [
    NetworkAdminConsoleExcludedHashtagsListComponent,
    NetworkAdminConsoleExcludedHashtagsListItemComponent,
  ],
  exports: [NetworkAdminConsoleExcludedHashtagsListComponent],
})
export class NetworkAdminExcludedHashtagsSharedModule {}
