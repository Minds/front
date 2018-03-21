import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule as NgFormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { ModalsModule } from '../modals/modals.module';
import { MindsFormsModule } from '../forms/forms.module';
import { CanDeactivateGuardService } from '../../services/can-deactivate-guard';
import { AdsModule } from '../ads/ads.module';

import { NewsfeedComponent } from './newsfeed.component';
import { NewsfeedSingleComponent } from './single/single.component';
import { NewsfeedBoostRotatorComponent } from './boost-rotator/boost-rotator.component';
import { NewsfeedTopComponent } from './feeds/top.component';
import { NewsfeedSubscribedComponent } from './feeds/subscribed.component';
import { NewsfeedBoostComponent } from './feeds/boost.component';
import { NewsfeedService } from './services/newsfeed.service';
import { BoostRotatorService } from './boost-rotator/boost-rotator.service';
import { NewsfeedDropdownComponent } from './dropdown/dropdown.component';

const routes: Routes = [
  {
    path: 'newsfeed', component: NewsfeedComponent,
    children: [
      { path: '', redirectTo: 'subscribed', pathMatch: 'full' },
      { path: 'top', component: NewsfeedTopComponent },
      { path: 'subscribed', component: NewsfeedSubscribedComponent, canDeactivate: [CanDeactivateGuardService] },
      { path: 'boost', component: NewsfeedBoostComponent, canDeactivate: [CanDeactivateGuardService] },
    ],
  },
  { path: 'newsfeed/:guid', component: NewsfeedSingleComponent },
];

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule.forChild(routes),
    NgFormsModule,
    ReactiveFormsModule,
    CommonModule,
    LegacyModule,
    ModalsModule,
    MindsFormsModule,
    AdsModule,
  ],
  declarations: [
    NewsfeedDropdownComponent,
    NewsfeedComponent,
    NewsfeedSingleComponent,
    NewsfeedBoostRotatorComponent,
    NewsfeedTopComponent,
    NewsfeedSubscribedComponent,
    NewsfeedBoostComponent,
  ],
  providers: [
    NewsfeedService,
    BoostRotatorService
  ],
  exports: [
    NewsfeedDropdownComponent,
    NewsfeedBoostRotatorComponent,
  ],
  entryComponents: [
    NewsfeedComponent,
    NewsfeedSingleComponent,
  ]
})

export class NewsfeedModule {
}
