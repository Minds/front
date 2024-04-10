import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BlogEditorMetaComponent } from './meta.component';
import { FormsModule } from '@angular/forms';
import { clientMock } from '../../../../../../../tests/client-mock.spec';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { MockService } from '../../../../../../utils/mock';
import { BlogsEditService } from '../../blog-edit.service';
import { SiteService } from '../../../../../../common/services/site.service';
import { Session } from '../../../../../../services/session';
import { By } from '@angular/platform-browser';

// ERROR: 'DEPRECATION: An asynchronous before/it/after function took a done callback but also returned a promise. This is not supported and will stop working in the future. Either remove the done callback (recommended) or change the function to not return a promise. (in spec: BlogEditorMetaComponent should show correct user slug when input empty)'

xdescribe('BlogEditorMetaComponent', () => {
  let comp: BlogEditorMetaComponent;
  let fixture: ComponentFixture<BlogEditorMetaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BlogEditorMetaComponent],
      imports: [RouterTestingModule, NgCommonModule, FormsModule],
      providers: [
        {
          provide: BlogsEditService,
          useValue: MockService(BlogsEditService),
        },
        {
          provide: SiteService,
          useValue: MockService(SiteService, {
            baseUrl: 'https://www.minds.com/',
          }),
        },
        {
          provide: Session,
          useValue: MockService(Session, {
            getLoggedInUser: () => {
              return {
                username: 'test',
              };
            },
          }),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(async (done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(BlogEditorMetaComponent);

    comp = fixture.componentInstance; // BlogEditorMetaComponent test instance

    clientMock.response = [];

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should show correct user slug when input empty', () => {
    const example = fixture.debugElement.query(
      By.css('.m-blogMeta__labelContainer span em')
    );
    expect(example).not.toBeNull();
    expect(example.nativeElement.textContent).toContain('falsetest/blog/-xxxx');
  });
});
