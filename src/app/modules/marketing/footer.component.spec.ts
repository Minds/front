import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MarketingFooterComponent } from './footer.component';
import {
  Footer,
  GetFooterGQL,
  GetFooterQuery,
} from '../../../graphql/generated.strapi';
import { STRAPI_URL } from '../../common/injection-tokens/url-injection-tokens';
import { MockComponent } from '../../utils/mock';
import { of } from 'rxjs';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client';

describe('MarketingFooterComponent', () => {
  let comp: MarketingFooterComponent;
  let fixture: ComponentFixture<MarketingFooterComponent>;
  let strapiUrl = 'http://example.minds.com/';

  const mockFooter: GetFooterQuery = {
    footer: {
      data: {
        attributes: {
          __typename: 'Footer',
          columns: [],
          copyrightText: 'copyrightText',
          logo: {},
          showLanguageBar: true,
          slogan: 'slogan',
          bottomLinks: [],
        },
      },
    },
  };

  const mockFooterResponse: ApolloQueryResult<GetFooterQuery> = {
    loading: false,
    networkStatus: NetworkStatus.ready,
    data: mockFooter,
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MarketingFooterComponent,
          MockComponent({
            selector: 'm-language__bar',
          }),
        ],
        providers: [
          {
            provide: GetFooterGQL,
            useValue: jasmine.createSpyObj<GetFooterGQL>(['fetch']),
          },
          { provide: STRAPI_URL, useValue: strapiUrl },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(MarketingFooterComponent);
    comp = fixture.componentInstance;

    (comp as any).getFooterGql.fetch.calls.reset();
    (comp as any).getFooterGql.fetch.and.returnValue(of(mockFooterResponse));

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should init without input passed data', () => {
    expect(comp).toBeTruthy();
    expect((comp as any).getFooterGql.fetch).toHaveBeenCalled();
    expect(comp.data).toEqual(mockFooter.footer.data.attributes as Footer);
  });

  it('should init with input passed data', () => {
    (comp as any).getFooterGql.fetch.calls.reset();
    comp.data = mockFooter.footer.data.attributes as Footer;

    comp.ngOnInit();

    expect((comp as any).getFooterGql.fetch).not.toHaveBeenCalled();
    expect(comp.data).toEqual(mockFooter.footer.data.attributes as Footer);
  });
});
