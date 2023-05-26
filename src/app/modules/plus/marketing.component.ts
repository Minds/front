import { ModalService } from './../../services/ux/modal.service';
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  OnInit,
  Inject,
  OnDestroy,
} from '@angular/core';
import { ConfigsService } from '../../common/services/configs.service';
import { Session } from '../../services/session';
import { PlusVerifyComponent } from './verify/verify.component';
import { PlusMarketingService } from './marketing.service';
import { ApolloQueryResult } from '@apollo/client/core';
import { GraphQLError } from 'graphql';
import { STRAPI_URL } from '../../common/injection-tokens/url-injection-tokens';
import { Subscription } from 'rxjs';
import { StrapiMetaService } from '../../common/services/strapi/strapi-meta.service';
import {
  ProductMarketingAttributes,
  ProductMarketingResponse,
} from '../../common/services/strapi/marketing-page/marketing-page.types';
import {
  StrapiAction,
  StrapiActionResolverService,
} from '../../common/services/strapi/strapi-action-resolver.service';

/**
 * Marketing page for Minds+
 * See it at /plus
 */
@Component({
  selector: 'm-plus__marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    'marketing.component.ng.scss',
    '../marketing/styles/markdown-style.ng.scss',
  ],
})
export class PlusMarketingComponent implements OnInit, OnDestroy {
  public data: ProductMarketingAttributes;
  public loading: boolean = true;
  public errors: readonly GraphQLError[];

  readonly cdnAssetsUrl: string;

  @ViewChild('topAnchor')
  readonly topAnchor: ElementRef;

  private copyDataSubscription: Subscription;

  constructor(
    protected cd: ChangeDetectorRef,
    configs: ConfigsService,
    private session: Session,
    private modalService: ModalService,
    private service: PlusMarketingService,
    private strapiMeta: StrapiMetaService,
    private strapiActionResolver: StrapiActionResolverService,
    @Inject(STRAPI_URL) public strapiUrl: string
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    this.copyDataSubscription = this.service.copyData.valueChanges.subscribe(
      (result: ApolloQueryResult<ProductMarketingResponse>): void => {
        this.data = result.data.productPages.data[0].attributes;
        this.loading = result.loading;
        this.errors = result.errors;
        if (this.data.metadata) {
          this.strapiMeta.apply(this.data.metadata);
        }
        this.detectChanges();
      }
    );
  }

  ngOnDestroy(): void {
    this.copyDataSubscription?.unsubscribe();
  }

  /**
   * Resolve an action from a Strapi action button.
   * @param { StrapiAction } action - action to resolve.
   * @returns { void }
   */
  public resolveAction(action: StrapiAction): void {
    this.strapiActionResolver.resolve(action);
  }

  openVerifyModal() {
    this.modalService.present(PlusVerifyComponent);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get isPlus() {
    return (
      this.session.getLoggedInUser() && this.session.getLoggedInUser().plus
    );
  }

  get isVerified() {
    return (
      this.session.getLoggedInUser() && this.session.getLoggedInUser().verified
    );
  }
}
