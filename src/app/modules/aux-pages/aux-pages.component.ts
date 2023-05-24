import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuxPagesService } from './aux-pages.service';
import { Observable, Subscription, filter, take } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  StrapiMetaService,
  StrapiMetadata,
} from '../../common/services/strapi/strapi-meta.service';

/**
 * Container for auxiliary pages (/p/ pages).
 * Relevant content is fetched from CMS based on the path parameter
 * in the URL. Will default to privacy page if no data is found in CMS.
 */
@Component({
  selector: 'm-aux',
  templateUrl: './aux-pages.component.html',
  styleUrls: ['./aux-pages.component.ng.scss'],
})
export class AuxComponent implements OnInit, OnDestroy {
  // copy for the header.
  public readonly headerCopy$: Observable<string> = this.service.headerCopy$;

  // copy for the body.
  public readonly bodyCopy$: Observable<string> = this.service.bodyCopy$;

  // updated at date string.
  public readonly updatedAtDateString$: Observable<string> = this.service
    .updatedAtDateString$;

  // whether request to load from CMS is in flight.
  public readonly loading$: Observable<boolean> = this.service.loading$;

  // subscription to metadata set by CMS
  private metadataSubscription: Subscription;

  // subscription not found state when data is not found in CMS for url path.
  private notFoundSubscription: Subscription;

  // subscription to route params.
  private routeParamSubscription: Subscription;

  constructor(
    private service: AuxPagesService,
    private route: ActivatedRoute,
    private router: Router,
    private strapiMeta: StrapiMetaService
  ) {}

  ngOnInit(): void {
    /**
     * On route param change, reload. Angular does not reload the component
     * automatically on param change. (without this the redirect does not
     * work when the page is not found).
     */
    this.routeParamSubscription = this.route.params.subscribe(
      (params: Params): void => {
        this.metadataSubscription?.unsubscribe();
        this.notFoundSubscription?.unsubscribe();
        this.load(params.path);
      }
    );
  }

  ngOnDestroy(): void {
    this.metadataSubscription?.unsubscribe();
    this.notFoundSubscription?.unsubscribe();
    this.routeParamSubscription?.unsubscribe();
  }

  /**
   * Load by page path.
   * @param { string } path - aux page path to try to load.
   * @returns { void }
   */
  private load(path: string): void {
    this.service.path$.next(path);

    this.notFoundSubscription = this.service.notFound$
      .pipe(filter(Boolean))
      .subscribe((notFound: boolean): void => {
        this.router.navigate(['/p/privacy']);
      });

    this.setMetadata();
  }

  /**
   * Set Metadata for page from CMS data held by service.
   * @returns { void }
   */
  private setMetadata(): void {
    this.metadataSubscription = this.service.metadata$
      .pipe(take(1))
      .subscribe((metadata: StrapiMetadata): void => {
        this.strapiMeta.apply(metadata);
      });
  }
}
