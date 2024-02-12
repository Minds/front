import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { RouterModule, Routes } from '@angular/router';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { markedOptionsFactory } from '../../helpers/marked-options-factory';
import { MembershipsPageComponent } from './components/memberships-page/memberships-page.component';
import { StarCardComponent } from '../../common/standalone/star-card/star-card.component';
import { MembershipCardComponent } from './components/membership-card/membership-card.component';
import { MembershipsRouteGuard } from './guards/memberships-route.guard';

const routes: Routes = [
  {
    path: '', // '/memberships
    component: MembershipsPageComponent,
    canActivate: [MembershipsRouteGuard],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory({
          anchorTargets: '_blank',
        }),
      },
    }),
    StarCardComponent,
    MembershipCardComponent,
  ],
  declarations: [MembershipsPageComponent],
})
export class MembershipsLazyModule {}
