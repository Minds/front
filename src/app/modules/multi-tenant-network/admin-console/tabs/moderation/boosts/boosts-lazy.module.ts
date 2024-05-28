import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkAdminConsoleBoostsComponent } from './boosts.component';
import { BoostModule } from '../../../../../boost/boost.module';
import { BoostConsoleService } from '../../../../../boost/console-v2/services/console.service';

/** Boost network admin console routes. */
const routes: Routes = [
  {
    path: '',
    component: NetworkAdminConsoleBoostsComponent,
  },
];

/**
 * Routes for the network admin boosts console.
 * Using a lazy module for this saves us from having to pull
 * the BoostModule in to the main Network admin console module.
 */
@NgModule({
  imports: [BoostModule, RouterModule.forChild(routes)],
  declarations: [NetworkAdminConsoleBoostsComponent],
  providers: [BoostConsoleService],
})
export class NetworkAdminBoostsLazyModule {}
