import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupermindButtonComponent } from './supermind-button/supermind-button.component';
import { SupermindBannerComponent } from './supermind-banner/supermind-banner.component';
import { IfTenantDirective } from '~/common/directives/if-tenant.directive';

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IfTenantDirective,
  ],
  declarations: [SupermindButtonComponent, SupermindBannerComponent],
  exports: [SupermindButtonComponent, SupermindBannerComponent],
})
export class SupermindSharedModule {}
