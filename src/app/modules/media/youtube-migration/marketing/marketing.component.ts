import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';
import { LoginReferrerService } from '../../../../services/login-referrer.service';
import { ProductMarketingAttributes } from '../../../../common/services/strapi/marketing-page/marketing-page.types';
import { GraphQLError } from 'graphql';
import { Subscription } from 'rxjs';
import {
  YoutubeMigrationMarketingPageResponse,
  YoutubeMigrationMarketingService,
} from './marketing.service';
import { StrapiMetaService } from '../../../../common/services/strapi/strapi-meta.service';
import { STRAPI_URL } from '../../../../common/injection-tokens/url-injection-tokens';
import { ApolloQueryResult } from '@apollo/client/core';

@Component({
  selector: 'm-youtubeMigration__marketing',
  templateUrl: './marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../../../marketing/styles/markdown-style.ng.scss'],
})
export class YoutubeMigrationMarketingComponent implements OnInit, OnDestroy {
  public data: ProductMarketingAttributes;
  public loading: boolean = true;
  public errors: readonly GraphQLError[];

  readonly cdnAssetsUrl: string;
  readonly youtubeSettingsUrl: string = '/settings/other/youtube-migration';

  private copyDataSubscription: Subscription;

  constructor(
    protected router: Router,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected loginReferrer: LoginReferrerService,
    private service: YoutubeMigrationMarketingService,
    private strapiMeta: StrapiMetaService,
    @Inject(STRAPI_URL) public strapiUrl: string,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    this.copyDataSubscription = this.service.copyData.valueChanges.subscribe(
      (
        result: ApolloQueryResult<YoutubeMigrationMarketingPageResponse>
      ): void => {
        console.log('data', result.data);
        this.data = result.data.youtubeMigrationMarketingPage.data.attributes;
        console.log('this.data', this.data);
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

  action() {
    if (this.session.isLoggedIn()) {
      this.router.navigate([this.youtubeSettingsUrl]);
    } else {
      this.loginReferrer.register(this.youtubeSettingsUrl);
      this.router.navigate(['/login']);
      return;
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
