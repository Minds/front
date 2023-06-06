import { TestBed } from '@angular/core/testing';
import { MetaService } from './meta.service';
import { STRAPI_URL } from '../injection-tokens/url-injection-tokens';
import { StrapiMetaService, StrapiMetadata } from './strapi-meta.service';
import { MockService } from '../../utils/mock';

describe('StrapiMetaService', () => {
  let service: StrapiMetaService;
  let metaService: MetaService;
  let strapiUrl = 'http://www.minds.com/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StrapiMetaService,
        { provide: MetaService, useValue: MockService(MetaService) },
        { provide: STRAPI_URL, useValue: strapiUrl },
      ],
    });

    service = TestBed.get(StrapiMetaService);
    metaService = TestBed.get(MetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should apply metadata', () => {
    const metadata: StrapiMetadata = {
      title: 'title',
      description: 'description',
      canonicalUrl: 'canonicalUrl',
      robots: 'robots',
      author: 'author',
      ogAuthor: 'ogAuthor',
      ogUrl: 'ogUrl',
      ogType: 'ogType',
      ogImage: {
        data: {
          attributes: {
            url: '/test.png',
            height: 800,
            width: 800,
          },
        },
      },
    };

    service.apply(metadata);

    expect(metaService.setTitle).toHaveBeenCalledWith(metadata.title);
    expect(metaService.setDescription).toHaveBeenCalledWith(
      metadata.description
    );
    expect(metaService.setCanonicalUrl).toHaveBeenCalledWith(
      metadata.canonicalUrl
    );
    expect(metaService.setRobots).toHaveBeenCalledWith(metadata.robots);
    expect(metaService.setAuthor).toHaveBeenCalledWith(metadata.author);
    expect(metaService.setOgAuthor).toHaveBeenCalledWith(metadata.ogAuthor);
    expect(metaService.setOgUrl).toHaveBeenCalledWith(metadata.ogUrl);
    expect(metaService.setOgType).toHaveBeenCalledWith(metadata.ogType);
    const expectedImageUrl = strapiUrl + metadata.ogImage.data.attributes.url;
    expect(metaService.setOgImage).toHaveBeenCalledWith(expectedImageUrl, {
      height: metadata.ogImage.data.attributes.height,
      width: metadata.ogImage.data.attributes.width,
    });
  });
});
