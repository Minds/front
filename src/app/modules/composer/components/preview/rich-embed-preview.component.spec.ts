import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockService } from '../../../../utils/mock';
import { RichEmbedPreviewComponent } from './rich-embed-preview.component';
import { MediaProxyService } from '../../../../common/services/media-proxy.service';

describe('Composer Rich Embed Preview', () => {
  let comp: RichEmbedPreviewComponent;
  let fixture: ComponentFixture<RichEmbedPreviewComponent>;

  let mediaProxyMock;

  beforeEach(waitForAsync(() => {
    mediaProxyMock = MockService(MediaProxyService);

    TestBed.configureTestingModule({
      declarations: [RichEmbedPreviewComponent],
      providers: [
        {
          provide: MediaProxyService,
          useValue: mediaProxyMock,
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(RichEmbedPreviewComponent);
    comp = fixture.componentInstance;
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

  it('should get an empty thumbnail', () => {
    comp.richEmbed = {
      entityGuid: null,
      url: 'http://example.com/',
      thumbnail: '',
    };
    fixture.detectChanges();

    expect(comp.getProxiedThumbnail()).toContain('data:image/');
  });

  it('should get a proxied thumbnail', () => {
    comp.richEmbed = {
      entityGuid: null,
      url: 'http://example.com/',
      thumbnail: 'http://example.com/image.png',
    };
    mediaProxyMock.proxy.and.returnValue('http://mindstest.com/proxiedurl');
    fixture.detectChanges();

    expect(comp.getProxiedThumbnail()).toBe('http://mindstest.com/proxiedurl');
  });

  it('should extract domain', () => {
    comp.richEmbed = {
      entityGuid: null,
      url: 'http://example.com/test',
      thumbnail: '',
    };
    fixture.detectChanges();

    expect(comp.extractDomain()).toBe('example.com');
  });
});
