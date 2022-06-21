import { ChangeDetectorRef, Component } from '@angular/core';

import { FormToastService } from '../../../common/services/form-toast.service';
import { ApiService } from '../../../common/api/api.service';
import { MindsUser } from '../../../interfaces/entities';

@Component({
  selector: 'm-admin__liquidityProviders',
  templateUrl: 'liquidity-providers.component.html',
  styleUrls: ['./liquidity-providers.component.ng.scss'],
})
export class AdminLiquidityProvidersComponent {
  users: MindsUser[] = [];

  inProgress: boolean = false;

  constructor(
    public api: ApiService,
    protected toasterService: FormToastService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }

  async load(): Promise<void> {
    this.inProgress = true;

    try {
      this.users = <any>(
        (
          await this.api
            .get(`api/v3/blockchain/liquidity-positions/users`)
            .toPromise()
        ).users
      );
    } catch (err) {
      console.log(err);
    }

    this.inProgress = false;

    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
