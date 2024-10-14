import { TestBed } from '@angular/core/testing';
import { MetaService } from './meta.service';
import { Title, Meta, DomSanitizer } from '@angular/platform-browser';
import { SiteService } from './site.service';
import { Location } from '@angular/common';
import { ConfigsService } from './configs.service';
import { DOCUMENT } from '@angular/common';
import { MockService } from '../../utils/mock';
import { IS_TENANT_NETWORK } from '../injection-tokens/tenant-injection-tokens';

describe('MetaService', () => {
  let service: MetaService;
  let mockDocument: Document = document;
  const cdnAssetsUrl: string = 'https://example.minds.com/';
  const title: string = 'Site title';
  let isTenantNetwork: boolean = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MetaService,
        { provide: Title, useValue: MockService(Title) },
        { provide: Meta, useValue: MockService(Meta) },
        {
          provide: SiteService,
          useValue: jasmine.createSpyObj<SiteService>('SiteService', [], {
            title: title,
          }),
        },
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
        { provide: IS_TENANT_NETWORK, useValue: isTenantNetwork },
      ],
    });

    service = TestBed.inject(MetaService);

    (service as any).site.title = title;

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

  describe('defaultTitle', () => {
    it('should get default title when on a tenant network', () => {
      const siteName: string = 'Testnet';
      (service as any).isTenantNetwork = true;
      (service as any).configs.get.and.returnValue(siteName);

      expect(service.defaultTitle).toBe(siteName);
    });

    it('should get default title when not on a tenant network', () => {
      (service as any).isTenantNetwork = false;

      expect(service.defaultTitle).toBe('Minds');
    });
  });

  describe('defaultAuthor', () => {
    it('should get default author when on a tenant network', () => {
      const siteName: string = 'Testnet';
      (service as any).isTenantNetwork = true;
      (service as any).configs.get.and.returnValue(siteName);

      expect(service.defaultAuthor).toBe(siteName);
    });

    it('should get default author when not on a tenant network', () => {
      (service as any).isTenantNetwork = false;
      expect(service.defaultAuthor).toBe('Minds');
    });
  });

  describe('setDynamicFavicon', () => {
    afterEach(() => {
      const favicon = mockDocument.head.querySelector('#favicon');
      const dynamicFavicon = mockDocument.head.querySelector('#dynamicFavicon');

      if (favicon) {
        mockDocument.head.removeChild(favicon);
      }

      if (dynamicFavicon) {
        mockDocument.head.removeChild(dynamicFavicon);
      }
    });

    it('should set dynamic favicon and remove any existing favicon', () => {
      const href: string = '/dynamicFavicon.png';
      if (!mockDocument.head.querySelector('#favicon')) {
        const link: HTMLLinkElement = document.createElement('link');
        link.setAttribute('rel', 'icon');
        link.setAttribute('type', 'image/png');
        link.setAttribute('href', '/favicon.svg');
        link.setAttribute('id', 'favicon');
        mockDocument.head.appendChild(link);
      }

      service.setDynamicFavicon(href);

      expect(mockDocument.head.querySelector('#dynamicFavicon')).toBeTruthy();
      expect(mockDocument.head.querySelector('#favicon')).toBeNull();
    });
  });

  describe('resetDynamicFavicon', () => {
    afterEach(() => {
      const favicon = mockDocument.head.querySelector('#favicon');
      const dynamicFavicon = mockDocument.head.querySelector('#dynamicFavicon');

      if (favicon) {
        mockDocument.head.removeChild(favicon);
      }

      if (dynamicFavicon) {
        mockDocument.head.removeChild(dynamicFavicon);
      }
    });

    it('should set dynamic favicon and remove any existing favicon', () => {
      if (!mockDocument.head.querySelector('#dynamicFavicon')) {
        const link: HTMLLinkElement = document.createElement('link');
        link.setAttribute('rel', 'icon');
        link.setAttribute('type', 'image/png');
        link.setAttribute('href', '/dynamicFavicon.svg');
        link.setAttribute('id', 'favicon');
        mockDocument.head.appendChild(link);
      }

      service.resetDynamicFavicon();

      expect(mockDocument.head.querySelector('#favicon')).toBeTruthy();
      expect(mockDocument.head.querySelector('#dynamicFavicon')).toBeNull();
    });
  });
});
