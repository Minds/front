import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Discovery "Trending" feed component (formerly top)
 * Presents a default recommendations feed with discovery/explore tabs.
 */
@Component({
  selector: 'm-discovery__top',
  styleUrls: ['top.component.ng.scss'],
  templateUrl: './top.component.html',
})
export class DiscoveryTopComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // The trending feed is actually a search result page
    this.router.navigate(['/discovery/search'], {
      queryParams: { t: 'all', f: 'top', explore: true },
    });
  }
}
