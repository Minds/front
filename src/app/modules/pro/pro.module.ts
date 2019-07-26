import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../common/common.module';
import { ProService } from './pro.service';
import { ProMarketingComponent } from './marketing.component';
import { ProSubscriptionComponent } from './subscription.component';
import { ProChannelComponent } from "./channel/channel.component";
import { ProChannelSignupComponent } from "./channel/signup/signup.component";
import { MindsFormsModule } from "../forms/forms.module";
import { ProChannelListComponent } from "./channel/list/list.component";
import { ProChannelDonateComponent } from './channel/donate/donate.component';
import { ProTileComponent } from "./channel/tile/tile.component";
import { NewsfeedModule } from "../newsfeed/newsfeed.module";
import { ProSettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: 'pro',
    children: [
      {
        path: '',
        component: ProMarketingComponent,
      },
      {
        path: 'settings',
        component: ProSettingsComponent,
      },
      {
        path: ':username',
        component: ProChannelComponent,
        children: [
          {
            path: '',
            redirectTo: 'articles',
            pathMatch: 'full'
          },
          {
            path: 'donate',
            component: ProChannelDonateComponent
          },
          {
            path: 'signup',
            component: ProChannelSignupComponent
          },
          {
            path: ':type',
            component: ProChannelListComponent
          },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    MindsFormsModule,
    NewsfeedModule,
  ],
  providers: [
    ProService,
  ],
  declarations: [
    ProMarketingComponent,
    ProSettingsComponent,
    ProSubscriptionComponent,
    ProTileComponent,
    ProChannelComponent,
    ProChannelSignupComponent,
    ProChannelListComponent,
    ProChannelDonateComponent,
  ],
  exports: [],
  entryComponents: [
    ProMarketingComponent,
  ],
})
export class ProModule {
}
