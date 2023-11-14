import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ProductPageService } from '../../services/product-page.service';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import {
  Footer,
  GetV2ProductPageBySlugQuery,
  V2ProductPage,
} from '../../../../../../graphql/generated.strapi';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductPageDynamicComponent } from '../../product-pages.types';
import { SidebarNavigationService } from '../../../../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../../../../common/layout/page-layout.service';
import { StrapiMetaService } from '../../../../../common/services/strapi-meta.service';
import { TopbarService } from '../../../../../common/layout/topbar.service';

/**
 * Base component for dynamic product pages. Central switch that determines
 * the order in which different sub-components should be shown.
 */
@Component({
  selector: 'm-productPage__base',
  templateUrl: 'base.component.html',
  styleUrls: ['base.component.ng.scss'],
})
export class ProductPageBaseComponent implements OnInit, OnDestroy {
  /** Host classes  - force light mode. */
  @HostBinding('class')
  get classes(): Record<string, boolean> {
    return {
      'm-theme--wrapper': true,
      'm-theme--wrapper__light': true,
    };
  }

  /** True when components have loaded. */
  public loaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /** Components to be rendered by template. */
  public readonly components$: BehaviorSubject<
    ProductPageDynamicComponent[]
  > = new BehaviorSubject<ProductPageDynamicComponent[]>([]);

  /** True when component has loaded. */
  public readonly footer$: BehaviorSubject<Footer> = new BehaviorSubject<
    Footer
  >(null);

  // Subscriptions.
  private dataGetSubscription: Subscription;

  constructor(
    private service: ProductPageService,
    private navigationService: SidebarNavigationService,
    private pageLayoutService: PageLayoutService,
    private topbarService: TopbarService,
    private strapiMetaService: StrapiMetaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // force scroll to top for when the component reloads with a different slug.
    window.scroll(0, 0);

    this.navigationService.setVisible(false);
    this.pageLayoutService.useFullWidth();
    this.topbarService.isMinimalLightMode$.next(true);

    const slug: string = this.route.snapshot.paramMap.get('slug') ?? null;

    if (!slug) {
      return this.handleLoadFailure(slug);
    }

    this.dataGetSubscription = this.service
      .getProductPageBySlug(slug)
      .pipe(take(1))
      .subscribe((result: GetV2ProductPageBySlugQuery): void => {
        const data: V2ProductPage = result?.v2ProductPages?.data?.[0]
          ?.attributes as V2ProductPage;
        const components: ProductPageDynamicComponent[] = data?.productPage as ProductPageDynamicComponent[];

        if (!components?.length) {
          return this.handleLoadFailure(slug);
        }

        this.components$.next(components);

        if (data?.metadata) {
          this.strapiMetaService.apply(data.metadata);
        }

        if (result?.footer?.data?.attributes) {
          this.footer$.next(result.footer.data.attributes as Footer);
        }

        this.loaded$.next(true);
      });
  }

  ngOnDestroy(): void {
    this.topbarService.isMinimalLightMode$.next(false);
    this.navigationService.setVisible(true);
    this.pageLayoutService.cancelFullWidth();
    this.dataGetSubscription?.unsubscribe();
  }

  /**
   * Track by function for ngFor.
   * @param { ProductPageDynamicComponent } component - component to get track by key for.
   * @returns { string } track by key.
   */
  public trackByFn(component: ProductPageDynamicComponent): string {
    return component.__typename + (component?.id ?? '');
  }

  /**
   * Handle load failures.
   * @param { string } slug - slug that failed to load.
   * @returns { void }
   */
  private handleLoadFailure(slug: string = null): void {
    if (slug) {
      console.error(`Unable to load product page for slug: ${slug}`);
    }
    this.router.navigate(['/']);
  }
}
