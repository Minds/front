import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ProductPageService } from '../../services/product-page.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { V2ProductPage } from '../../../../../../graphql/generated.strapi';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductPageDynamicComponent } from '../../product-pages.types';
import { SidebarNavigationService } from '../../../../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../../../../common/layout/page-layout.service';
import { StrapiMetaService } from '../../../../../common/services/strapi-meta.service';

@Component({
  selector: 'm-productPage__base',
  templateUrl: 'base.component.html',
  styleUrls: ['base.component.ng.scss'],
})
export class ProductPageBaseComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  get classes(): Record<string, boolean> {
    return {
      'm-theme--wrapper': true,
      'm-theme--wrapper__light': true,
    };
  }

  public readonly components$: BehaviorSubject<
    ProductPageDynamicComponent[]
  > = new BehaviorSubject<ProductPageDynamicComponent[]>([]);

  private dataGetSubscription: Subscription;

  constructor(
    private service: ProductPageService,
    private navigationService: SidebarNavigationService,
    private pageLayoutService: PageLayoutService,
    private strapiMetaService: StrapiMetaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.navigationService.setVisible(false);
    this.pageLayoutService.useFullWidth();

    const slug: string = this.route.snapshot.paramMap.get('slug') ?? null;

    if (!slug) {
      return this.handleLoadFailure(slug);
    }

    this.dataGetSubscription = this.service
      .getProductPageBySlug(slug)
      .subscribe((result: V2ProductPage): void => {
        if (!result || !result.productPage || !result.productPage.length) {
          return this.handleLoadFailure(slug);
        }
        this.components$.next(
          result.productPage as ProductPageDynamicComponent[]
        );

        if (result.metadata) {
          this.strapiMetaService.apply(result.metadata);
        }
      });
  }

  ngOnDestroy(): void {
    this.navigationService.setVisible(true);
    this.pageLayoutService.cancelFullWidth();
    this.dataGetSubscription?.unsubscribe();
  }

  public trackByFn(component: ProductPageDynamicComponent): string {
    return component.__typename + (component?.id ?? '');
  }

  private handleLoadFailure(slug: string = null): void {
    if (slug) {
      console.error(`Unable to load product page for slug: ${slug}`);
    }
    this.router.navigate(['/']);
  }
}
