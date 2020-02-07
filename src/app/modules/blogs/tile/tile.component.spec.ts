import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ExcerptPipe } from '../../../common/pipes/excerpt';
import { SafeToggleComponentMock } from '../../legacy/components/cards/activity/activity.component.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { BlogTileComponent } from './tile.component';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { AttachmentService } from '../../../services/attachment';
import { attachmentServiceMock } from '../../../../tests/attachment-service-mock.spec';
import { ConfigsService } from '../../../common/services/configs.service';
import { MockService } from '../../../utils/mock';

describe('BlogTileComponent', () => {
  let comp: BlogTileComponent;
  let fixture: ComponentFixture<BlogTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExcerptPipe, SafeToggleComponentMock, BlogTileComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
      ],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: AttachmentService, useValue: attachmentServiceMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    jasmine.clock().install();

    fixture = TestBed.createComponent(BlogTileComponent);

    comp = fixture.componentInstance;

    comp.setEntity = {
      guid: '1',
      title: 'title',
      time_created: 1525865293,
      thumbnail_src: 'link/to/thumbnail',
      excerpt: 'this is an excerpt',
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

  it('should link to the blog url', () => {
    const tile = fixture.debugElement.query(By.css('.m-blog--tile'));
    expect(tile).not.toBeNull();
    expect(
      tile.nativeElement.getAttributeNode('ng-reflect-router-link').textContent
    ).toBe('/blog/view,1');
  });

  it('should have a mature content wrapper', () => {
    attachmentServiceMock.blur = true;
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.m-blog--tile-thumbnail-wrapper'))
    ).not.toBeNull();
    expect(
      fixture.debugElement.query(
        By.css('.m-blog--tile-thumbnail-wrapper.m-blog--tile--mature-thumbnail')
      )
    ).not.toBeNull();
  });

  it('should have a thumbnail', () => {
    const a = fixture.debugElement.query(By.css('a.m-blog--tile-thumbnail'));
    expect(a).not.toBeNull();

    expect(
      a.nativeElement.getAttributeNode('ng-reflect-router-link').textContent
    ).toContain('/blog/view,1');
  });

  it('should have a title and excerpt', () => {
    const label = fixture.debugElement.query(
      By.css('.m-blog--tile-title > label')
    );
    const excerpt = fixture.debugElement.query(
      By.css('.m-blog--tile-title > p')
    );

    expect(label).not.toBeNull();
    expect(label.nativeElement.textContent).toContain('title');

    expect(excerpt).not.toBeNull();
    expect(excerpt.nativeElement.textContent).toContain('this is an excerpt');
  });

  it('should have an owner block', () => {
    const block = fixture.debugElement.query(By.css('.m-inline-owner-block'));
    expect(block).not.toBeNull();

    const owner = fixture.debugElement.query(
      By.css('.m-inline-owner-block > a')
    );
    expect(owner).not.toBeNull();
    expect(
      owner.nativeElement.getAttributeNode('ng-reflect-router-link').textContent
    ).toBe('/,testowner');
    expect(owner.nativeElement.textContent).toContain('testowner');

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

    const toggle = fixture.debugElement.query(
      By.css('.m-blog--tile-title > m-safe-toggle')
    );
    expect(toggle).toBeNull();
  });

  it('should have a safe toggle if the user is an admin', () => {
    sessionMock.user.admin = true;
    fixture.detectChanges();
    const toggle = fixture.debugElement.query(
      By.css('.m-blog--tile-title > m-safe-toggle')
    );
    expect(toggle).not.toBeNull();
  });
});
