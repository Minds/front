import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiFactorAuthBaseComponent } from './multi-factor-auth.component';
import { MultiFactorAuthTOTPComponent } from './panels/totp/totp.component';
import { MultiFactorAuthTOTPRecoveryComponent } from './panels/recovery-code/recovery-code.component';
import { MultiFactorAuthSMSComponent } from './panels/sms/sms.component';
import { MultiFactorAuthEmailComponent } from './panels/email/email.component';

const COMPONENTS = [
  MultiFactorAuthBaseComponent,
  MultiFactorAuthTOTPComponent,
  MultiFactorAuthTOTPRecoveryComponent,
  MultiFactorAuthSMSComponent,
  MultiFactorAuthEmailComponent,
];

const MODULES = [
  NgCommonModule,
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
];

/**
 * Lazy loaded module
 */
@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class MultiFactorAuthLazyModule {
  public resolveComponent(): typeof MultiFactorAuthBaseComponent {
    return MultiFactorAuthBaseComponent;
  }
}
