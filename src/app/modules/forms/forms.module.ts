import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';

import { LoginForm } from './login/login';
import { RegisterForm } from './register/register';
import { CaptchaModule } from '../captcha/captcha.module';
import { ExperimentsModule } from '../experiments/experiments.module';
import { PopoverComponent } from './popover-validation/popover.component';
import { MultiFactorAuthLazyModule } from '../auth/multi-factor-auth/multi-factor-auth-lazy.module';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild([]),
    FormsModule,
    ReactiveFormsModule,
    CaptchaModule,
    ExperimentsModule,
    MultiFactorAuthLazyModule,
  ],
  declarations: [LoginForm, RegisterForm, PopoverComponent],
  exports: [LoginForm, RegisterForm, PopoverComponent],
})
export class MindsFormsModule {}
