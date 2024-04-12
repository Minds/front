import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Client } from '../../../../services/api';
import { Boost } from '../../boost.types';
import { BoostConsoleService } from '../services/console.service';

@Component({
  selector: 'm-boostConsole__single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.ng.scss'],
})
export class BoostConsoleSingleComponent implements OnInit, OnDestroy {
  inProgress: boolean;
  boost: Boost;

  singleBoostGuidSubscription: Subscription;

  constructor(
    private service: BoostConsoleService,
    private client: Client,
    private router: Router,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.inProgress = true;

    this.singleBoostGuidSubscription = this.service.singleBoostGuid$.subscribe(
      (boostGuid) => {
        this.loadBoost(boostGuid);
      }
    );
  }

  ngOnDestroy(): void {
    this.singleBoostGuidSubscription?.unsubscribe();
  }

  async loadBoost(boostGuid: string) {
    try {
      const { boost } = <any>(
        await this.client.get(`api/v3/boosts/${boostGuid}`)
      );

      this.boost = boost;
    } catch (e) {
      console.error(e);
      this.toaster.error(e);
    } finally {
      this.inProgress = false;
    }
  }

  /**
   * On back button click.
   * @returns { void }
   */
  public onBackClick(): void {
    this.router.navigate(['/boost/boost-console']);
  }
}
