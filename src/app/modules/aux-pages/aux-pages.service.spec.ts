import { TestBed } from '@angular/core/testing';
import {
  AUX_PAGE_QUERY,
  AuxPageData,
  AuxPagesService,
} from './aux-pages.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { Apollo } from 'apollo-angular';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('AuxPagesService', () => {
  let service: AuxPagesService;
  let controller: ApolloTestingController;

  const mockAttributes: AuxPageData = {
    h1: 'h1',
    body: 'body',
    slug: 'slug',
    updatedAt: 1684753308000,
    metadata: {
      title: 'ogTitle',
      description: 'ogDescription',
      canonicalUrl: 'https://0.0.0.0/canonicalUrl',
      robots: 'all',
      author: 'Minds',
      ogAuthor: 'ogMinds',
      ogUrl: 'https://0.0.0.0/ogUrl',
      ogType: 'ogType',
      ogImage: {
        data: {
          attributes: {
            url: 'ogImage.png',
            height: 1200,
            width: 1200,
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
      imports: [ApolloTestingModule.withClients(['strapi'])],
      providers: [
        AuxPagesService,
        Apollo,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
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

    (service as any).headerCopy$.subscribe((headerCopy) => {
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

    (service as any).bodyCopy$.subscribe((bodyCopy) => {
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

    (service as any).updatedAtDateString$.subscribe((updatedAtDateString) => {
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

  it('should get metadata on fetchContent', (done: DoneFn) => {
    service.path$.next('privacy');

    (service as any).metadata$.subscribe((metadata) => {
      expect(metadata).toEqual(mockAttributes.metadata);
      controller.verify();
      done();
    });

    const op = controller.expectOne(AUX_PAGE_QUERY);
    expect(op.operation.variables.path).toEqual('privacy');
    op.flush(mockResponse);
  });
});
