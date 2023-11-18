import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { RouterModule, Routes } from '@angular/router';
import { UpgradePageComponent } from './upgrade-page/upgrade-page.component';
import { UpgradeModalService } from './upgrade-modal.service';
import { WireModule } from '../wire/wire.module';

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
  imports: [
    RouterModule.forChild(routes),
    NgCommonModule,
    CommonModule,
    WireModule,
  ],
  declarations: [UpgradePageComponent],
  providers: [UpgradeModalService],
})
export class UpgradeModule {
  /**
   * Resolve component to UpgradePageComponent instance.
   * @returns { typeof UpgradePageComponent }
   */
  public resolveComponent(): typeof UpgradePageComponent {
    return UpgradePageComponent;
  }
}
