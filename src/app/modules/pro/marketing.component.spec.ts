import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeDetectorRef } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { BehaviorSubject } from 'rxjs';
import { ProMarketingComponent } from './marketing.component';
import { ProMarketingService } from './marketing.service';
import { productMarketingMockData } from '../../mocks/modules/marketing/product-marketing.mock';
import { MockComponent, MockService } from '../../utils/mock';
import { ConfigsService } from '../../common/services/configs.service';
import { Session } from '../../services/session';
import { StrapiMetaService } from '../../common/services/strapi/strapi-meta.service';
import { STRAPI_URL } from '../../common/injection-tokens/url-injection-tokens';
import {
  StrapiAction,
  StrapiActionResolverService,
} from '../../common/services/strapi/strapi-action-resolver.service';
import { ProductMarketingResponse } from '../../common/services/strapi/marketing-page/marketing-page.types';

describe('ProMarketingComponent', () => {
  let comp: ProMarketingComponent;
  let fixture: ComponentFixture<ProMarketingComponent>;

  const mockResponse: any = {
    loading: false,
    networkStatus: 7,
    data: {
      productPages: {
        data: [
          {
            ...productMarketingMockData,
          },
        ],
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        ProMarketingComponent,
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
        MockComponent({
          selector: 'm-pro--subscription',
          outputs: ['onEnable'],
        }),
      ],
      providers: [
        ChangeDetectorRef,
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: Session, useValue: MockService(Session) },
        {
          provide: ProMarketingService,
          useValue: MockService(ProMarketingService, {
            has: ['copyData'],
            props: {
              copyData: {
                get: () => {
                  return {
                    valueChanges: new BehaviorSubject<
                      ApolloQueryResult<ProductMarketingResponse>
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

    fixture = TestBed.createComponent(ProMarketingComponent);
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
      mockResponse.data.productPages.data[0].attributes.metadata
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
