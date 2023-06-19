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
});
