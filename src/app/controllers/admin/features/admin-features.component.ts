import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Client } from '../../../services/api/client';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

type ServicesEntityStruc = {
  [service: string]: boolean | null;
};

type ResponseFeaturesStruc = Array<{
  name: string;
  services: ServicesEntityStruc;
}>;

@Component({
  selector: 'm-admin--features',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'admin-features.component.html',
})
export class AdminFeaturesComponent implements OnInit, OnDestroy {
  isLoading: boolean;

  for: string;

  environment: string;

  services: Array<string>;

  features: ResponseFeaturesStruc;

  error: string;

  protected params$: Subscription;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.params$ = this.route.params.subscribe(params => {
      if (typeof params.for !== 'undefined') {
        this.for = params.for;
        this.load();
      }
    });

    this.load();
  }

  ngOnDestroy(): void {
    this.params$.unsubscribe();
  }

  async load(): Promise<void> {
    this.isLoading = true;
    this.error = '';
    this.detectChanges();

    try {
      const response: any = await this.client.get('api/v2/admin/features', {
        for: this.for || '',
      });

      this.environment = response.environment;
      this.for = response.for;
      this.services = response.services;
      this.features = response.features;
    } catch (e) {
      this.error = (e && e.message) || 'Internal server error';
    }

    this.isLoading = false;
    this.detectChanges();
  }

  get readableFor(): string {
    if (!this.for) {
      return 'Anonymous user';
    }

    return `@${this.for}`;
  }

  isBestService(
    currentService: string,
    services: ServicesEntityStruc
  ): boolean {
    let bestService = this.services[0];

    for (const service of this.services) {
      if (services[service] !== null) {
        bestService = service;
      }
    }

    return currentService == bestService;
  }

  labelForValue(value: any): string {
    if (value === false) {
      return 'OFF';
    } else if (value === null) {
      return '\xa0';
    } else if (!value) {
      return '???';
    }

    return 'ON';
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
