import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeDetectorRef } from '@angular/core';
import { StrapiMetaService } from '../../common/services/strapi/strapi-meta.service';
import { ConfigsService } from '../../common/services/configs.service';
import { MockComponent, MockService } from '../../utils/mock';
import { STRAPI_URL } from '../../common/injection-tokens/url-injection-tokens';
import { ApolloQueryResult } from '@apollo/client/core';
import { BehaviorSubject } from 'rxjs';
import { productMarketingMockData } from '../../mocks/modules/marketing/product-marketing.mock';
import { BoostMarketingComponent } from './marketing.component';
import {
  BoostMarketingPageResponse,
  BoostMarketingService,
} from './marketing.service';
import {
  StrapiAction,
  StrapiActionResolverService,
} from '../../common/services/strapi/strapi-action-resolver.service';

describe('BoostMarketingComponent', () => {
  let comp: BoostMarketingComponent;
  let fixture: ComponentFixture<BoostMarketingComponent>;

  const mockResponse: any = {
    loading: false,
    networkStatus: 7,
    data: {
      boostMarketingPage: {
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
        BoostMarketingComponent,
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
          selector: 'm-marketing__asFeaturedIn',
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
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        {
          provide: BoostMarketingService,
          useValue: MockService(BoostMarketingService, {
            has: ['copyData'],
            props: {
              copyData: {
                get: () => {
                  return {
                    valueChanges: new BehaviorSubject<
                      ApolloQueryResult<BoostMarketingPageResponse>
                    >(mockResponse),
                  };
                },
              },
            },
          }),
        },
        {
          provide: StrapiActionResolverService,
          useValue: MockService(StrapiActionResolverService),
        },
        {
          provide: StrapiMetaService,
          useValue: MockService(StrapiMetaService),
        },
        { provide: STRAPI_URL, useValue: 'https://www.minds.com/test-strapi/' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoostMarketingComponent);
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
      mockResponse.data.boostMarketingPage.data.attributes.metadata
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
