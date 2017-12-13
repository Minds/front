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

const routes: Routes = [
  { path: 'newsfeed/subscribed', component: NewsfeedComponent, canDeactivate: [CanDeactivateGuardService] },
  { path: 'newsfeed/boost', component: NewsfeedComponent, canDeactivate: [CanDeactivateGuardService] },
  { path: 'newsfeed/:guid', component: NewsfeedSingleComponent },
  { path: 'newsfeed', component: NewsfeedComponent, canDeactivate: [CanDeactivateGuardService] },
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
    NewsfeedComponent,
    NewsfeedSingleComponent,
    NewsfeedBoostRotatorComponent,
  ],
  exports: [
    NewsfeedBoostRotatorComponent,
  ],
  entryComponents: [
    NewsfeedComponent,
    NewsfeedSingleComponent,
  ]
})

export class NewsfeedModule {
}
