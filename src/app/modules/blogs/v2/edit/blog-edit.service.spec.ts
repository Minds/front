import { TestBed } from '@angular/core/testing';
import { BlogEditorDropdownComponent } from './edit/dropdown/dropdown.component';
import { BlogsEditService } from './blog-edit.service';
import { uploadMock } from '../../../../tests/upload-mock.spec';
import { clientMock } from '../../../../tests/client-mock.spec';
import { siteServiceMock } from '../../notifications/notification.service.spec';

let routerMock = new (function() {
  this.navigate = jasmine.createSpy('navigate');
})();

describe('BlogsEditService', () => {
  let service: BlogsEditService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    TestBed.configureTestingModule({
      providers: [],
    });

    clientMock.response = {};

    service = new BlogsEditService(
      uploadMock,
      routerMock,
      clientMock,
      siteServiceMock
    );
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should set canPost to true when there is content', () => {
    expect(service.canPost$.getValue()).toBeFalsy();
    service.content$.next('test');
    expect(service.canPost$.getValue()).toBeTruthy();
  });

  it('should load an existing blog', async () => {
    clientMock.response['api/v1/blog/1'] = {
      blog: {
        title: 'title',
        description: 'content',
        slug: 'slug',
        custom_meta: {
          author: 'author',
          description: 'meta-description',
          title: 'meta-title',
        },
        time_updated: 0,
        published: 1,
        access_id: 0,
        time_created: 0,
        tags: ['1', '2'],
        nsfw: [1, 2],
      },
    };

    await service.load('1');

    expect(service.urlSlug$.getValue()).toBe('slug');
    expect(service.title$.getValue()).toBe('title');
    expect(service.content$.getValue()).toBe('content');
    expect(service.author$.getValue()).toBe('author');
    expect(service.nsfw$.getValue()).toEqual([1, 2]);
    expect(service.error$.getValue()).toBe('');
    expect(service.banner$.getValue()).toBe(
      'https://www.minds.com/fs/v1/banners/1/0'
    );
    expect(service.bannerFile$.getValue()).toBe('');
    expect(service.canPost$.getValue()).toBe(true);
    expect(service.guid$.getValue()).toBe('1');
    expect(service.published$.getValue()).toBe(1);
    expect(service.accessId$.getValue()).toBe(0);
    expect(service.schedule$.getValue()).toBe(0);
    expect(service.savedContent$.getValue()).toBe('content');
    expect(service.accessId$.getValue()).toBe(0);
    expect(service.tags$.getValue()).toEqual(['1', '2']);
    expect(service.metaDescription$.getValue()).toBe('meta-description');
    expect(service.metaTitle$.getValue()).toBe('meta-title');
    expect(service.accessId$.getValue()).toBe(0);
    expect(service.accessId$.getValue()).toBe(0);
  });

  it('should save a blog', async () => {
    clientMock.response['api/v1/blog/1'] = {
      status: 'success',
      blog: {
        title: 'title',
        description: 'content',
        slug: 'slug',
        custom_meta: {
          author: 'author',
          description: 'meta-description',
          title: 'meta-title',
        },
        time_updated: 0,
        published: 1,
        access_id: 0,
        time_created: 0,
        tags: ['1', '2'],
        nsfw: [1, 2],
      },
    };

    await service.load('1');
    service.content$.next('123123');

    await service.save();
    expect(service.error$.getValue()).toBe('');
    expect(uploadMock.post).toHaveBeenCalled();
  });

  it('should save a draft', async () => {
    clientMock.response['api/v1/blog/1'] = {
      status: 'success',
      blog: {
        title: 'title',
        description: 'content',
        slug: 'slug',
        custom_meta: {
          author: 'author',
          description: 'meta-description',
          title: 'meta-title',
        },
        time_updated: 0,
        published: 1,
        access_id: 0,
        time_created: 0,
        tags: ['1', '2'],
        nsfw: [1, 2],
      },
    };

    await service.load('1');
    service.content$.next('123123');

    await service.save(true);
    expect(service.error$.getValue()).toBe('');
    expect(uploadMock.post).toHaveBeenCalled();
    expect(service.draftSaved$.getValue).toBeTruthy();
  });

  it('should set a banner', () => {
    service.addBanner({ type: 'image/493223' });
    expect(service.bannerFile$.getValue()).toBeTruthy();
  });

  it('should return true if editor has new content', () => {
    service.savedContent$.next('233');
    service.content$.next('123');
    expect(service.hasContent()).toBeTruthy();
  });

  it('should return false if editor has no new content', () => {
    service.savedContent$.next('123');
    service.content$.next('123');
    expect(service.hasContent()).toBeFalsy();
  });

  it('should push and remove tags', () => {
    service.tags$.next([]);
    service.pushTag('tag1');
    service.pushTag('tag2');
    expect(service.tags$.getValue()).toEqual(['tag1', 'tag2']);

    service.removeTag('tag1');
    expect(service.tags$.getValue()).toEqual(['tag2']);
  });

  it('should toggle nsfw', () => {
    service.nsfw$.next([]);
    service.toggleNSFW(1);
    service.toggleNSFW(2);
    expect(service.nsfw$.getValue()).toEqual([1, 2]);
    service.toggleNSFW(1);
    expect(service.nsfw$.getValue()).toEqual([2]);
  });
});
