import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DiscoveryTrend } from './trends.service';
import { DiscoveryService } from '../discovery.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'm-discoveryTrends__listItem',
  templateUrl: './list-item.component.html',
})
export class DiscoveryTrendsListItemComponent implements OnInit, OnDestroy {
  parentPathSubscription: Subscription;
  parentPath: string = '';

  @Input() trend: DiscoveryTrend;

  constructor(private discoveryService: DiscoveryService) {}

  ngOnInit(): void {
    this.parentPathSubscription = this.discoveryService.parentPath$.subscribe(
      (parentPath) => {
        this.parentPath = parentPath;
      }
    );
  }

  ngOnDestroy() {
    this.parentPathSubscription.unsubscribe();
  }
}
