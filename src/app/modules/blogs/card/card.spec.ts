import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RouterTestingModule } from '@angular/router/testing';
import { BlogCard } from './card';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { AttachmentService } from '../../../services/attachment';
import { attachmentServiceMock } from '../../../../tests/attachment-service-mock.spec';
import { ExcerptPipe } from '../../../common/pipes/excerpt';
import { Component, Input } from '@angular/core';
import { ExperimentsService } from '../../experiments/experiments.service';
import { MockService } from '../../../utils/mock';
import { TruncatePipe } from '../../../common/pipes/truncate.pipe';

@Component({
  selector: 'minds-button-thumbs-up',
  template: '',
})
class ThumbsUpMock {
  @Input() object: any;
}

@Component({
  selector: 'minds-button-thumbs-down',
  template: '',
})
class ThumbsDownMock {
  @Input() object: any;
}

@Component({
  selector: 'minds-button-comment',
  template: '',
})
class CommentsMock {
  @Input() object: any;
}

describe('BlogCard', () => {
  let comp: BlogCard;
  let fixture: ComponentFixture<BlogCard>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ExcerptPipe,
          ThumbsUpMock,
          ThumbsDownMock,
          CommentsMock,
          BlogCard,
          TruncatePipe,
        ],
        imports: [
          RouterTestingModule,
          ReactiveFormsModule,
          CommonModule,
          FormsModule,
        ],
        providers: [
          { provide: Session, useValue: sessionMock },
          { provide: AttachmentService, useValue: attachmentServiceMock },
          {
            provide: ExperimentsService,
            useValue: MockService(ExperimentsService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(BlogCard);

    comp = fixture.componentInstance;

    comp._blog = {
      guid: '1',
      title: 'title',
      time_created: 1525865293,
      thumbnail_src: 'link/to/thumbnail',
      excerpt: 'this is an excerpt',
      ownerObj: {
        guid: '2',
        username: 'testowner',
        name: 'Test owner',
        icontime: 1525865293,
      },
    };

    sessionMock.user.admin = false;

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

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have a permalink that links to the blog', () => {
    const a = fixture.debugElement.query(
      By.css('a.m-blogCardOwnerBlock__permalink')
    );
    expect(a).not.toBeNull();

    expect(
      a.nativeElement.getAttributeNode('ng-reflect-router-link').textContent
    ).toBe('/blog/view,1');

    expect(a.nativeElement.textContent).toBe('May 9, 2018');
  });

  it('should have a title that links to the blog', () => {
    const title = fixture.debugElement.query(By.css('div.m-blogCard__title a'));
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain('title');

    expect(
      title.nativeElement.getAttributeNode('ng-reflect-router-link').textContent
    ).toBe('/blog/view,1');
  });

  it('should have a mature overlay', () => {
    attachmentServiceMock.blur = true;

    fixture.detectChanges();

    const a = fixture.debugElement.query(By.css('a.minds-blog-thumbnail'));
    expect(a.nativeElement.classList).toContain('m-mature-thumbnail');

    const matureOverlay = fixture.debugElement.query(
      By.css('.m-mature-thumbnail-overlay')
    );
    expect(matureOverlay).not.toBeNull();
  });

  it('should have an owner block', () => {
    const block = fixture.debugElement.query(
      By.css('div.m-blogCard__OwnerBlock')
    );
    expect(block).not.toBeNull();
  });

  it('should have the owners display name that links to their channel', () => {
    const displayName = fixture.debugElement.query(
      By.css('a.m-blogCardOwnerBlock__displayName')
    );
    expect(displayName).not.toBeNull();
    expect(displayName.nativeElement.textContent).toContain('Test owner');
    expect(
      displayName.nativeElement.getAttributeNode('ng-reflect-router-link')
        .textContent
    ).toBe('/,testowner');
  });

  it('should have an avatar', () => {
    const avatar = fixture.debugElement.query(
      By.css('.m-blogCardOwnerBlock__avatar > m-hovercard > a > img')
    );
    expect(avatar).not.toBeNull();
    expect(avatar.nativeElement.src).toContain('/icon/2/small/1525865293');
  });
});
