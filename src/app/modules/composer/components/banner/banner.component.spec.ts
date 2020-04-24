import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from '../../../../utils/mock';
import { ComposerService } from '../../services/composer.service';
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
