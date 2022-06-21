import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { EmbedServiceV2 } from '../../../services/embedV2.service';
import { ModalsModule } from '../../../modules/modals/modals.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '../../common.module';
import { PostMenuV2Component } from './v2/menu.component';

@NgModule({
  imports: [CommonModule, NgCommonModule, FormsModule, ModalsModule],
  exports: [PostMenuV2Component],
  declarations: [PostMenuV2Component],
  providers: [EmbedServiceV2],
})
export class PostMenuModule {}
