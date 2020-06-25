import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DiscoveryService } from './discovery.service';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'm-discovery',
  templateUrl: './discovery.component.html',
})
export class DiscoveryComponent implements OnInit, OnDestroy {
  isPlusPageSubscription: Subscription;
  isPlusPage: boolean = false;

  constructor(private router: Router, private service: DiscoveryService) {}

  ngOnInit() {
    /**
     * Determine if on Minds+ page
     */
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(e => {
        this.service.setRoute();
      });

    this.service.setRoute();

    this.isPlusPageSubscription = this.service.isPlusPage$.subscribe(
      isPlusPage => {
        this.isPlusPage = isPlusPage;
      }
    );
  }

  ngOnDestroy(): void {
    this.isPlusPageSubscription.unsubscribe();
  }
}
