import { TestBed } from '@angular/core/testing';
import {
  AUX_PAGE_QUERY,
  AuxPageInput,
  AuxPagesService,
} from './aux-pages.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { Apollo } from 'apollo-angular';
import { STRAPI_URL } from '../../common/injection-tokens/url-injection-tokens';

describe('AuxPagesService', () => {
  let service: AuxPagesService;
  let controller: ApolloTestingController;

  const mockAttributes: AuxPageInput = {
    h1: 'h1',
    body: 'body',
    slug: 'slug',
    updatedAt: 1684753308000,
    metadata: {
      title: 'ogTitle',
      description: 'ogDescription',
      ogImage: {
        data: {
          attributes: {
            url: 'ogImage.png',
          },
        },
      },
    },
  };

  const mockResponse = {
    data: {
      auxPages: {
        data: [{ attributes: mockAttributes }],
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ApolloTestingModule],
      providers: [
        AuxPagesService,
        Apollo,
        { provide: STRAPI_URL, useValue: 'https://www.minds.com/' },
      ],
    });

    service = TestBed.inject(AuxPagesService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get headerCopy on fetchContent', (done: DoneFn) => {
    service.path$.next('privacy');

    (service as any).headerCopy$.subscribe(headerCopy => {
      expect(headerCopy).toBe(mockAttributes.h1);
      controller.verify();
      done();
    });

    const op = controller.expectOne(AUX_PAGE_QUERY);
    expect(op.operation.variables.path).toEqual('privacy');
    op.flush(mockResponse);
  });

  it('should get bodyCopy on fetchContent', (done: DoneFn) => {
    service.path$.next('privacy');

    (service as any).bodyCopy$.subscribe(bodyCopy => {
      expect(bodyCopy).toBe(mockAttributes.body);
      controller.verify();
      done();
    });

    const op = controller.expectOne(AUX_PAGE_QUERY);
    expect(op.operation.variables.path).toEqual('privacy');
    op.flush(mockResponse);
  });

  it('should get updatedAtDateString on fetchContent', (done: DoneFn) => {
    service.path$.next('privacy');

    (service as any).updatedAtDateString$.subscribe(updatedAtDateString => {
      expect(updatedAtDateString).toBe(
        new Date(mockAttributes.updatedAt).toLocaleDateString()
      );
      controller.verify();
      done();
    });

    const op = controller.expectOne(AUX_PAGE_QUERY);
    expect(op.operation.variables.path).toEqual('privacy');
    op.flush(mockResponse);
  });

  it('should get metadataTitle on fetchContent', (done: DoneFn) => {
    service.path$.next('privacy');

    (service as any).metadataTitle$.subscribe(metadataTitle => {
      expect(metadataTitle).toBe(mockAttributes.metadata.title);
      controller.verify();
      done();
    });

    const op = controller.expectOne(AUX_PAGE_QUERY);
    expect(op.operation.variables.path).toEqual('privacy');
    op.flush(mockResponse);
  });

  it('should get metadataDescription on fetchContent', (done: DoneFn) => {
    service.path$.next('privacy');

    (service as any).metadataDescription$.subscribe(metadataDescription => {
      expect(metadataDescription).toBe(mockAttributes.metadata.description);
      controller.verify();
      done();
    });

    const op = controller.expectOne(AUX_PAGE_QUERY);
    expect(op.operation.variables.path).toEqual('privacy');
    op.flush(mockResponse);
  });

  it('should get ogImage on fetchContent', (done: DoneFn) => {
    service.path$.next('privacy');

    (service as any).ogImage$.subscribe(ogImage => {
      expect(ogImage).toBe(
        'https://www.minds.com/' +
          mockAttributes.metadata.ogImage.data.attributes.url
      );
      controller.verify();
      done();
    });

    const op = controller.expectOne(AUX_PAGE_QUERY);
    expect(op.operation.variables.path).toEqual('privacy');
    op.flush(mockResponse);
  });
});
