import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';

import { PostMenuComponent } from './post-menu.component';
import { ModalsModule } from '../../../modules/modals/modals.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '../../common.module';
import { PostMenuV2Component } from './v2/menu.component';

@NgModule({
  imports: [CommonModule, NgCommonModule, FormsModule, ModalsModule],
  exports: [PostMenuComponent, PostMenuV2Component],
  declarations: [PostMenuComponent, PostMenuV2Component],
  providers: [],
  entryComponents: [PostMenuComponent],
})
export class PostMenuModule {}
