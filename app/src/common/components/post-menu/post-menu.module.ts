import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule} from '@angular/common';

import { PostMenuComponent } from './post-menu.component';
import { ModalsModule } from '../../../modules/modals/modals.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ModalsModule
  ],
  exports: [ PostMenuComponent ],
  declarations: [ PostMenuComponent ],
  providers: [],
  entryComponents: [ PostMenuComponent ]
})
export class PostMenuModule {
}
