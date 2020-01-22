import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';

import { LoginForm } from './login/login';
import { RegisterForm } from './register/register';
import { FbRegisterForm } from './fb-register/fb-register';
import { OnboardingForm } from './onboarding/onboarding';
import { Tutorial } from './tutorial/tutorial';
import { CaptchaModule } from '../captcha/captcha.module';
import { ExperimentsModule } from '../experiments/experiments.module';
import { PopoverComponent } from './popover-validation/popover.component';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild([]),
    FormsModule,
    ReactiveFormsModule,
    CaptchaModule,
    ExperimentsModule,
  ],
  declarations: [
    LoginForm,
    RegisterForm,
    FbRegisterForm,
    OnboardingForm,
    Tutorial,
    PopoverComponent,
  ],
  exports: [LoginForm, RegisterForm, FbRegisterForm, OnboardingForm, Tutorial],
})
export class MindsFormsModule {}
