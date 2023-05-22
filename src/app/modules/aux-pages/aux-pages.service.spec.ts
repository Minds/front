import { TestBed } from '@angular/core/testing';
import { AUX_PAGE_QUERY, AuxPagesService } from './aux-pages.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { Apollo } from 'apollo-angular';

describe('AuxPagesService', () => {
  let service: AuxPagesService;
  let controller: ApolloTestingController;

  const mockAttributes = {
    h1: 'h1',
    body: 'body',
    slug: 'slug',
    updatedAt: 1684753308000,
    ogTitle: 'ogTitle',
    ogDescription: 'ogDescription',
    ogImagePath: 'ogImagePath',
  };

  const mockResponse = {
    data: {
      auxPages: {
        data: [
          {
            attributes: mockAttributes,
          },
        ],
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ApolloTestingModule],
      providers: [AuxPagesService, Apollo],
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

  it('should get ogTitle on fetchContent', (done: DoneFn) => {
    service.path$.next('privacy');

    (service as any).ogTitle$.subscribe(ogTitle => {
      expect(ogTitle).toBe(mockAttributes.ogTitle);
      controller.verify();
      done();
    });

    const op = controller.expectOne(AUX_PAGE_QUERY);
    expect(op.operation.variables.path).toEqual('privacy');
    op.flush(mockResponse);
  });

  it('should get ogDescription on fetchContent', (done: DoneFn) => {
    service.path$.next('privacy');

    (service as any).ogDescription$.subscribe(ogDescription => {
      expect(ogDescription).toBe(mockAttributes.ogDescription);
      controller.verify();
      done();
    });

    const op = controller.expectOne(AUX_PAGE_QUERY);
    expect(op.operation.variables.path).toEqual('privacy');
    op.flush(mockResponse);
  });

  it('should get ogImagePath on fetchContent', (done: DoneFn) => {
    service.path$.next('privacy');

    (service as any).ogImagePath$.subscribe(ogImagePath => {
      expect(ogImagePath).toBe(mockAttributes.ogImagePath);
      controller.verify();
      done();
    });

    const op = controller.expectOne(AUX_PAGE_QUERY);
    expect(op.operation.variables.path).toEqual('privacy');
    op.flush(mockResponse);
  });
});
