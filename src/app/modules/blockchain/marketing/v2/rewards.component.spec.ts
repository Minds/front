import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeDetectorRef } from '@angular/core';
import { BlockchainMarketingLinksService } from './blockchain-marketing-links.service';
import {
  RewardsMarketingPageResponse,
  RewardsMarketingService,
} from './rewards.service';
import { StrapiMetaService } from '../../../../common/services/strapi/strapi-meta.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { BlockchainMarketingRewardsV2Component } from './rewards.component';
import { STRAPI_URL } from '../../../../common/injection-tokens/url-injection-tokens';
import { ApolloQueryResult } from '@apollo/client/core';
import { BehaviorSubject } from 'rxjs';
import { productMarketingMockData } from '../../../../mocks/modules/marketing/product-marketing.mock';
import {
  StrapiAction,
  StrapiActionResolverService,
} from '../../../../common/services/strapi/strapi-action-resolver.service';

describe('BlockchainMarketingRewardsV2Component', () => {
  let comp: BlockchainMarketingRewardsV2Component;
  let fixture: ComponentFixture<BlockchainMarketingRewardsV2Component>;

  const mockResponse: any = {
    loading: false,
    networkStatus: 7,
    data: {
      rewardsMarketingPage: {
        data: {
          ...productMarketingMockData,
        },
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        BlockchainMarketingRewardsV2Component,
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
        MockComponent({
          selector: 'm-marketing',
        }),
        MockComponent({
          selector: 'markdown',
          inputs: ['ngPreserveWhitespaces'],
        }),
        MockComponent({
          selector: 'm-marketing__asFeaturedInBlockchain',
        }),
        MockComponent({
          selector: 'm-marketing__generalSection',
          inputs: [
            'leftAligned',
            'title',
            'body',
            'imageUrl',
            'imageOverlayUrl',
            'actionButtons',
            'showBodyBackground',
            'showBackgroundEffects',
          ],
        }),
        MockComponent({
          selector: 'm-marketing__otherFeaturesSection',
          inputs: [
            'title',
            'column1Title',
            'column1Body',
            'column2Title',
            'column2Body',
            'column3Title',
            'column3Body',
          ],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['color'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        ChangeDetectorRef,
        {
          provide: BlockchainMarketingLinksService,
          useValue: MockService(BlockchainMarketingLinksService),
        },
        {
          provide: RewardsMarketingService,
          useValue: MockService(RewardsMarketingService, {
            has: ['copyData'],
            props: {
              copyData: {
                get: () => {
                  return {
                    valueChanges: new BehaviorSubject<
                      ApolloQueryResult<RewardsMarketingPageResponse>
                    >(mockResponse),
                  };
                },
              },
            },
          }),
        },
        {
          provide: StrapiMetaService,
          useValue: MockService(StrapiMetaService),
        },
        {
          provide: StrapiActionResolverService,
          useValue: MockService(StrapiActionResolverService),
        },
        { provide: STRAPI_URL, useValue: 'https://www.minds.com/test-strapi/' },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockchainMarketingRewardsV2Component);
    comp = fixture.componentInstance;

    (comp as any).service.copyData.valueChanges.next(mockResponse);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(comp).toBeTruthy();
  });

  it('should init fully when CMS data is returned', () => {
    comp.loading = true;

    (comp as any).service.copyData.valueChanges.next(mockResponse);

    expect(comp.loading).toBe(false);
    expect((comp as any).strapiMeta.apply).toHaveBeenCalledWith(
      mockResponse.data.rewardsMarketingPage.data.attributes.metadata
    );
  });

  it('should pass call to resolve action to service', () => {
    const action: StrapiAction = 'open_composer';
    comp.resolveAction(action);
    expect((comp as any).strapiActionResolver.resolve).toHaveBeenCalledOnceWith(
      action
    );
  });
});
