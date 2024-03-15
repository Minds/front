import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';
import { MindsFormsModule } from '../forms/forms.module';

import { LoginComponent } from './login.component';
import { LogoutComponent } from './logout.component';
import { RegisterComponent } from './register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MarketingModule } from '../marketing/marketing.module';
import { RegisterPageGuard } from './modal/guards/register-page.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login',
      description: 'Login or create a channel',
      preventLayoutReset: true,
    },
  },
  { path: 'logout/all', component: LogoutComponent },
  { path: 'logout', component: LogoutComponent },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Join',
      canonicalUrl: '/register',
      preventLayoutReset: true,
    },
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: {
      title: 'Forgot Password',
      description: 'Reset your password',
      preventLayoutReset: true,
    },
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule.forChild(routes),
    NgFormsModule,
    ReactiveFormsModule,
    CommonModule,
    ModalsModule,
    MindsFormsModule,
    MarketingModule,
  ],
  declarations: [
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    ForgotPasswordComponent,
  ],
  exports: [ForgotPasswordComponent],
})
export class AuthModule {}
