import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';

import { LoginForm } from './login/login';
import { RegisterForm } from './register/register';
import { FbRegisterForm } from './fb-register/fb-register';
import { OnboardingForm } from './onboarding/onboarding';
import { OnboardingCategoriesSelector } from './categories-selector/categories-selector';
import { Tutorial } from './tutorial/tutorial';
import { CaptchaModule } from '../captcha/captcha.module';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild([]),
    FormsModule,
    ReactiveFormsModule,
    CaptchaModule
  ],
  declarations: [
    LoginForm,
    RegisterForm,
    FbRegisterForm,
    OnboardingForm,
    OnboardingCategoriesSelector,
    Tutorial
  ],
  exports: [
    LoginForm,
    RegisterForm,
    FbRegisterForm,
    OnboardingForm,
    OnboardingCategoriesSelector,
    Tutorial
  ]
})
export class MindsFormsModule {
}
