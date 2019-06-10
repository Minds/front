import { NgModule } from '@angular/core';

import { MindsModule } from './app.module';
import { Minds } from './app.component';

@NgModule({
  imports: [
    MindsModule,
  ],
  bootstrap: [Minds],
})
export class AppBrowserModule {}
