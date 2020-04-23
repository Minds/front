import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from '../../../../utils/mock';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ComposerService } from '../../services/composer.service';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../../common/api/api.service';
import { AttachmentService } from '../../services/attachment.service';
import { AttachmentApiService } from '../../../../common/api/attachment-api.service';
import { RichEmbedService } from '../../services/rich-embed.service';
import { PreviewService } from '../../services/preview.service';
import { BannerComponent } from './banner.component';
import { ComposerBlogsService } from '../../services/blogs.service';

describe('Composer Attachment Preview', () => {
  let comp: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(done => {
    TestBed.configureTestingModule({
      declarations: [BannerComponent],
      providers: [
        {
          provide: ComposerBlogsService,
          useValue: MockService(ComposerBlogsService),
        },
        {
          provide: ComposerService,
          useValue: MockService(ComposerService),
        },
      ],
    }).compileComponents();

    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(BannerComponent);
    comp = fixture.componentInstance;
    // spyOn(comp.onPortraitOrientationEmitter, 'emit').and.stub();
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

  it('should instantiate banner', () => {
    expect(comp).toBeTruthy();
  });
});
