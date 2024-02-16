import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockService } from '../../../../utils/mock';
import { ConfigsService } from '../../../../common/services/configs.service';
import { AttachmentPreviewComponent } from './attachment-preview.component';
import {
  ComposerService,
  PaywallThumbnail,
} from '../../services/composer.service';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../../common/api/api.service';
import { AttachmentService } from '../../services/attachment.service';
import { AttachmentApiService } from '../../../../common/api/attachment-api.service';
import { RichEmbedService } from '../../services/rich-embed.service';
import { PreviewService } from '../../services/preview.service';
import { FeedsUpdateService } from '../../../../common/services/feeds-update.service';
import { RegexService } from '../../../../common/services/regex.service';
import { Session } from '../../../../services/session';
import { Storage } from '../../../../services/storage';
import { Client } from '../../../../services/api';
import { ToasterService } from '../../../../common/services/toaster.service';
import { FeedNoticeService } from '../../../notices/services/feed-notice.service';
import { DiscoveryTagsService } from '../../../discovery/tags/tags.service';
import { VideoPoster } from '../../services/video-poster.service';

describe('Composer Attachment Preview', () => {
  let comp: AttachmentPreviewComponent;
  let fixture: ComponentFixture<AttachmentPreviewComponent>;

  beforeEach(done => {
    TestBed.configureTestingModule({
      declarations: [AttachmentPreviewComponent],
      providers: [
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
        Session,
        Storage,
        RegexService,
        AttachmentService,
        RichEmbedService,
        PreviewService,
        FeedsUpdateService,
        {
          provide: ApiService,
          useValue: MockService(ApiService, {}),
        },
        {
          provide: AttachmentApiService,
          useValue: MockService(ApiService, {}),
        },
        {
          provide: Client,
          useValue: MockService(Client, {}),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService, {}),
        },
        {
          provide: FeedNoticeService,
          useValue: MockService(FeedNoticeService, {}),
        },
        {
          provide: DiscoveryTagsService,
          useValue: MockService(DiscoveryTagsService, {}),
        },
        {
          provide: ComposerService,
          useValue: MockService(ComposerService, {}),
        },
      ],
    }).compileComponents();

    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(AttachmentPreviewComponent);
    comp = fixture.componentInstance;
    spyOn(comp.onPortraitOrientationEmitter, 'emit').and.stub();
    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should set portrait for an image', () => {
    const img = document.createElement('img');
    spyOnProperty(img, 'naturalWidth').and.returnValue(1000);
    spyOnProperty(img, 'naturalHeight').and.returnValue(2000);
    fixture.detectChanges();

    comp.fitForImage(img);
    expect(comp.onPortraitOrientationEmitter.emit).toHaveBeenCalledWith(true);
  });

  it('should set landscape for an image', () => {
    const img = document.createElement('img');
    spyOnProperty(img, 'naturalWidth').and.returnValue(2000);
    spyOnProperty(img, 'naturalHeight').and.returnValue(1000);
    fixture.detectChanges();

    comp.fitForImage(img);
    expect(comp.onPortraitOrientationEmitter.emit).toHaveBeenCalledWith(false);
  });

  it('should set portrait for an video', () => {
    const video = document.createElement('video');
    spyOnProperty(video, 'videoWidth').and.returnValue(1000);
    spyOnProperty(video, 'videoHeight').and.returnValue(2000);
    fixture.detectChanges();

    comp.fitForVideo(video);
    expect(comp.onPortraitOrientationEmitter.emit).toHaveBeenCalledWith(true);
  });

  it('should set landscape for an video', () => {
    const video = document.createElement('video');
    spyOnProperty(video, 'videoWidth').and.returnValue(2000);
    spyOnProperty(video, 'videoHeight').and.returnValue(1000);
    fixture.detectChanges();

    comp.fitForVideo(video);
    expect(comp.onPortraitOrientationEmitter.emit).toHaveBeenCalledWith(false);
  });
});
