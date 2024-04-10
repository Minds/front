import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval, map, takeWhile } from 'rxjs';
import { MultiTenantDomainService } from '../../../services/domain.service';
import { ModalService } from '../../../../../services/ux/modal.service';
import { NetworkAdminConsoleEditDomainModalComponent } from './edit-domain-modal/edit-domain-modal.component';
import {
  MultiTenantDomainStatus,
  ReturnedMultiTenantDomain,
} from './domain.types';
import { DnsRecordEnum } from '../../../../../../graphql/generated.engine';
import { ToasterService } from '../../../../../common/services/toaster.service';

/**
 * Domain settings tab for network admin console.
 */
@Component({
  selector: 'm-networkAdminConsole__domain',
  templateUrl: './domain.component.html',
  styleUrls: [
    './domain.component.ng.scss',
    '../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleDomainComponent implements OnInit, OnDestroy {
  /**
   * Allows us to use enum in the template
   */
  public dnsRecordEnum: typeof DnsRecordEnum = DnsRecordEnum;

  // subscriptions.
  private subscriptions: Subscription[] = [];

  private pollingSubscription: Subscription;

  /**
   * Status when the page is loaded.
   */
  statusOnLoad: MultiTenantDomainStatus;

  /**
   * Current domain response
   */
  domain: ReturnedMultiTenantDomain;

  constructor(
    protected service: MultiTenantDomainService,
    private modalService: ModalService,
    private toaster: ToasterService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.service.fetchDomain();

    this.subscriptions.push(
      this.service.domain$.subscribe((domain) => {
        this.domain = domain;
      }),
      this.service.status$.subscribe((status) => {
        // If pending, start polling for change in status
        if (status === MultiTenantDomainStatus.PENDING) {
          if (!this.pollingSubscription) {
            this.startPolling();
          }
        } else {
          // If we're polling for changes and the status switches to active
          // let the user know
          if (
            this.pollingSubscription &&
            status === MultiTenantDomainStatus.ACTIVE
          ) {
            this.toaster.success('Custom domain successfully configured');
          }
          // Stop the poll if not pending anymore
          this.stopPolling();
        }
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * When status is pending, poll for status changes every 15sec
   */
  startPolling(): void {
    this.pollingSubscription = interval(15000).subscribe(() => {
      this.service.fetchDomain();
    });
  }

  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  /**
   * Open the modal to set the domain
   */
  async openSetupModal() {
    this.modalService.present(NetworkAdminConsoleEditDomainModalComponent, {
      data: {
        onDismissIntent: () => {
          this.dismissModal();
        },
      },
      injector: this.injector,
      windowClass: 'm-modalV2__mobileFullCover',
    });
  }

  /**
   * Dismisses the modal
   */
  dismissModal() {
    this.modalService.dismissAll();
  }
}
