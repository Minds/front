import { ChangeDetectorRef } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { EmbedLinkWhitelistService } from '../../../services/embed-link-whitelist.service';
import { RichEmbedService } from '../../../services/rich-embed';
import { Session } from '../../../services/session';
import { ModalService } from '../../../services/ux/modal.service';
import { MockService } from '../../../utils/mock';
import { ClientMetaDirective } from '../../directives/client-meta.directive';
import { ClientMetaService } from '../../services/client-meta.service';
import { ConfigsService } from '../../services/configs.service';
import { MediaProxyService } from '../../services/media-proxy.service';
import { SiteService } from '../../services/site.service';
import { MindsRichEmbed } from './rich-embed';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LivestreamService } from '../../../modules/composer/services/livestream.service';

describe('MindsRichEmbed', () => {
  let comp: MindsRichEmbed;
  let fixture: ComponentFixture<MindsRichEmbed>;
  let service: LivestreamService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MindsRichEmbed],

        providers: [
          { provide: DomSanitizer, useValue: MockService(DomSanitizer) },
          { provide: Session, useValue: MockService(Session) },
          {
            provide: RichEmbedService,
            useValue: MockService(RichEmbedService),
          },
          {
            provide: ChangeDetectorRef,
            useValue: MockService(ChangeDetectorRef),
          },
          {
            provide: MediaProxyService,
            useValue: MockService(MediaProxyService),
          },
          { provide: ConfigsService, useValue: MockService(ConfigsService) },
          { provide: SiteService, useValue: MockService(SiteService) },
          { provide: ModalService, useValue: MockService(ModalService) },
          {
            provide: EmbedLinkWhitelistService,
            useValue: MockService(EmbedLinkWhitelistService),
          },
          {
            provide: ClientMetaService,
            useValue: MockService(ClientMetaService),
          },
          {
            provide: ClientMetaDirective,
            useValue: MockService(ClientMetaDirective),
          },
          LivestreamService,
        ],
      }).compileComponents();
      service = TestBed.inject(LivestreamService);
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MindsRichEmbed);
    comp = fixture.componentInstance;

    (comp as any).clickRecorded = false;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to record click on action for a boost', fakeAsync(() => {
    const guid: string = '123';
    const urn: string = 'urn:234:boost';
    const boostedGuid: string = '345';

    const mockEvent: Event = {
      stopPropagation: (e: any) => void 0,
      preventDefault: (e: any) => void 0,
    } as any;

    comp.src = {
      guid: guid,
      urn: urn,
      boosted_guid: boostedGuid,
    };

    comp.action(mockEvent);
    tick();

    expect((comp as any).clientMetaService.recordClick).toHaveBeenCalledWith(
      guid,
      (comp as any).parentClientMeta,
      {
        campaign: urn,
      }
    );
  }));

  it('should call to record click on action for a NON boost', fakeAsync(() => {
    const guid: string = '123';
    const mockEvent: Event = {
      stopPropagation: (e: any) => void 0,
      preventDefault: (e: any) => void 0,
    } as any;

    comp.src = {
      guid: guid,
    };

    comp.action(mockEvent);
    tick();

    expect((comp as any).clientMetaService.recordClick).toHaveBeenCalledWith(
      guid,
      (comp as any).parentClientMeta,
      {}
    );
  }));
});
