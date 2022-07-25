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

xdescribe('BlogCard', () => {
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
      published: false,
      ownerObj: {
        guid: '2',
        username: 'testowner',
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

  it('should link to the blog', () => {
    const a = fixture.debugElement.query(By.css('a'));
    expect(a).not.toBeNull();
    expect(
      a.nativeElement.getAttributeNode('ng-reflect-router-link').textContent
    ).toBe('/blog/view,1');
  });

  it('should have a mature overlay', () => {
    attachmentServiceMock.blur = true;

    fixture.detectChanges();

    const a = fixture.debugElement.query(By.css('a'));
    expect(a.nativeElement.classList).toContain('m-mature-thumbnail');

    const matureOverlay = fixture.debugElement.query(
      By.css('span.m-mature-thumbnail-overlay')
    );
    expect(matureOverlay).not.toBeNull();
  });

  it('should have an owner block', () => {
    const block = fixture.debugElement.query(By.css('div.m-title-block'));
    expect(block).not.toBeNull();

    const a = fixture.debugElement.query(By.css('div.m-title-block a'));
    expect(a).not.toBeNull();
    expect(
      a.nativeElement.getAttributeNode('ng-reflect-router-link').textContent
    ).toBe('/blog/view,1');

    const title = fixture.debugElement.query(
      By.css('div.m-title-block a strong')
    );
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain('title');

    const ownerBlock = fixture.debugElement.query(
      By.css('.m-inline-owner-block')
    );
    expect(ownerBlock).not.toBeNull();

    const username = fixture.debugElement.query(
      By.css('.m-inline-owner-block a')
    );
    expect(username).not.toBeNull();
    expect(username.nativeElement.textContent).toContain('testowner');
    expect(
      username.nativeElement.getAttributeNode('ng-reflect-router-link')
        .textContent
    ).toBe('/,testowner');

    const avatar = fixture.debugElement.query(
      By.css('.m-inline-owner-block > a > img')
    );
    expect(avatar).not.toBeNull();
    expect(avatar.nativeElement.src).toContain('/icon/2/small/1525865293');

    const time = fixture.debugElement.query(
      By.css('.m-inline-owner-block > span')
    );
    expect(time).not.toBeNull();
    expect(time.nativeElement.textContent).toBe('May 9, 2018');
  });

  it('should have a draft indicator if the blog was not published and the logged in user is the blog owner', () => {
    comp._blog = {};

    fixture.detectChanges();

    comp._blog = {
      guid: '1',
      title: 'title',
      time_created: 1525865293,
      thumbnail_src: 'link/to/thumbnail',
      excerpt: 'this is an excerpt',
      published: false,
      owner_guid: '1000',
      ownerObj: {
        guid: '1000',
        username: 'test',
        icontime: 1525865293,
      },
    };

    fixture.detectChanges();

    const draft = fixture.debugElement.query(
      By.css('.m-inline-owner-block > span:last-child')
    );
    expect(draft).not.toBeNull();
    expect(draft.nativeElement.textContent).toBe('Draft');
  });

  it('should have an action bar with buttons', () => {
    expect(fixture.debugElement.query(By.css('.m-action-tabs'))).not.toBeNull();

    expect(
      fixture.debugElement.query(
        By.css('.m-action-tabs minds-button-thumbs-up')
      )
    ).not.toBeNull();
    expect(
      fixture.debugElement.query(
        By.css('.m-action-tabs minds-button-thumbs-down')
      )
    ).not.toBeNull();
  });
});
