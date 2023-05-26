import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeDetectorRef } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { BehaviorSubject } from 'rxjs';
import { NodesMarketingComponent } from './marketing.component';
import { productMarketingMockData } from '../../../mocks/modules/marketing/product-marketing.mock';
import { MockComponent, MockService } from '../../../utils/mock';
import { ConfigsService } from '../../../common/services/configs.service';
import {
  NodesMarketingPageResponse,
  NodesMarketingService,
} from './marketing.service';
import { StrapiMetaService } from '../../../common/services/strapi/strapi-meta.service';
import { STRAPI_URL } from '../../../common/injection-tokens/url-injection-tokens';
import {
  StrapiAction,
  StrapiActionResolverService,
} from '../../../common/services/strapi/strapi-action-resolver.service';

describe('NodesMarketingComponent', () => {
  let comp: NodesMarketingComponent;
  let fixture: ComponentFixture<NodesMarketingComponent>;

  const mockResponse: any = {
    loading: false,
    networkStatus: 7,
    data: {
      nodesMarketingPage: {
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
        NodesMarketingComponent,
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
          provide: NodesMarketingService,
          useValue: MockService(NodesMarketingService, {
            has: ['copyData'],
            props: {
              copyData: {
                get: () => {
                  return {
                    valueChanges: new BehaviorSubject<
                      ApolloQueryResult<NodesMarketingPageResponse>
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NodesMarketingComponent);
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
      mockResponse.data.nodesMarketingPage.data.attributes.metadata
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
