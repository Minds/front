import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { Client } from '../../common/api/client.service';
import { CookieService } from '../../common/services/cookie.service';

import { ExperimentDirective } from './experiment.directive';
import { ExperimentsService } from './experiments.service';

@NgModule({
  imports: [NgCommonModule, CommonModule],
  declarations: [ExperimentDirective],
  exports: [ExperimentDirective],
  providers: [
    {
      provide: ExperimentsService,
      useFactory: (_client, cookieService) =>
        new ExperimentsService(_client, cookieService),
      deps: [Client, CookieService],
    },
  ],
})
export class ExperimentsModule {}
