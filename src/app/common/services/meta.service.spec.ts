import { TestBed } from '@angular/core/testing';
import { MetaService } from './meta.service';
import { Title, Meta, DomSanitizer } from '@angular/platform-browser';
import { SiteService } from './site.service';
import { Location } from '@angular/common';
import { ConfigsService } from './configs.service';
import { DOCUMENT } from '@angular/common';
import { MockService } from '../../utils/mock';

describe('MetaService', () => {
  let service: MetaService;
  let mockDocument: Document = document;
  const cdnAssetsUrl: string = 'https://example.minds.com/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MetaService,
        { provide: Title, useValue: MockService(Title) },
        { provide: Meta, useValue: MockService(Meta) },
        { provide: SiteService, useValue: MockService(SiteService) },
        { provide: Location, useValue: MockService(Location) },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: DOCUMENT, useValue: mockDocument },
        {
          provide: DomSanitizer,
          useValue: {
            sanitize: (ctx: any, val: string) => val,
            bypassSecurityTrustResourceUrl: (val: string) => val,
          },
        },
      ],
    });

    service = TestBed.inject(MetaService);

    (service as any).configs.get
      .withArgs('cdn_assets_url')
      .and.returnValue(cdnAssetsUrl);
    (service as any).titleService.setTitle.calls.reset();
    (service as any).metaService.updateTag.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should truncate title and og:title appropriately', () => {
    const title: string =
      '300 char string 300 char string 300 char string 300 char string 300 char string 300 char string 300 char string 300 char string 300 char string 300 char string 300 char string 300 char string 300 char string 300 char string 300 char string 300 char string 300 char string 300 char string 300 char str';
    service.setTitle(title, false);
    expect((service as any).titleService.setTitle).toHaveBeenCalledWith(
      title.substring(0, 57) + '...'
    );
    expect((service as any).metaService.updateTag).toHaveBeenCalledWith({
      property: 'og:title',
      content: title.substring(0, 247) + '...',
    });
  });

  describe('setThumbnail', () => {
    it('should set thumbnail to og:image default when a relative url is passed', () => {
      service.setThumbnail('/path/my-image.png');

      expect((service as any).metaService.updateTag).toHaveBeenCalledWith({
        name: 'thumbnail',
        content: cdnAssetsUrl + 'path/my-image.png',
      });
    });

    it('should set thumbnail to og:image default when an absolute url is passed', () => {
      service.setThumbnail('https://example.minds.com/path/my-image.png');

      expect((service as any).metaService.updateTag).toHaveBeenCalledWith({
        name: 'thumbnail',
        content: 'https://example.minds.com/path/my-image.png',
      });
    });

    it('should set thumbnail to og:image default when empty string is passed', () => {
      service.setThumbnail('');

      expect((service as any).metaService.updateTag).toHaveBeenCalledWith({
        name: 'thumbnail',
        content: cdnAssetsUrl + 'assets/og-images/default-v3.png',
      });
    });

    it('should set thumbnail to og:image default when null is passed', () => {
      service.setThumbnail(null);

      expect((service as any).metaService.updateTag).toHaveBeenCalledWith({
        name: 'thumbnail',
        content: cdnAssetsUrl + 'assets/og-images/default-v3.png',
      });
    });

    it('should set thumbnail to og:image default when no argument is passed', () => {
      service.setThumbnail();

      expect((service as any).metaService.updateTag).toHaveBeenCalledWith({
        name: 'thumbnail',
        content: cdnAssetsUrl + 'assets/og-images/default-v3.png',
      });
    });
  });
});
