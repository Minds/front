import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { RouterModule, Routes } from '@angular/router';
import { UpgradePageComponent } from './upgrade-page/upgrade-page.component';

const routes: Routes = [
  {
    path: '',
    component: UpgradePageComponent,
    data: {
      title: 'Upgrade',
      description: 'Unleash the full Minds experience',
      ogImage: '/assets/photos/network.jpg',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), NgCommonModule, CommonModule],
  declarations: [UpgradePageComponent],
})
export class UpgradeModule {}
