import { TestBed } from '@angular/core/testing';
import { BlogsEditService } from './blog-edit.service';
import { uploadMock } from '../../../../../tests/upload-mock.spec';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { composerMockService } from '../../../../mocks/modules/composer/services/composer.service.mock';
import { BehaviorSubject } from 'rxjs';
import { siteServiceMock } from '../../../../mocks/services/site-service-mock.spec';

let routerMock = new (function() {
  this.navigate = jasmine.createSpy('navigate');
})();

export let toasterServiceMock = new (function() {
  this.success = jasmine.createSpy('success').and.returnValue(this);
})();

const message$ = new BehaviorSubject<string>('');

export let preloadServiceMock = new (function() {
  this.getValue = jasmine.createSpy('getValue').and.returnValue('');
  this.message$ = message$;
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
      siteServiceMock,
      toasterServiceMock,
      preloadServiceMock,
      composerMockService
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
        access_id: '0',
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
    expect(service.bannerFile$.getValue()).toBe('');
    expect(service.canPost$.getValue()).toBe(true);
    expect(service.guid$.getValue()).toBe('1');
    expect(service.published$.getValue()).toBe(1);
    expect(service.accessId$.getValue()).toBe('0');
    expect(service.schedule$.getValue()).toBe(0);
    expect(service.savedContent$.getValue()).toBe('content');
    // expect(service.accessId$.getValue()).toBe(0);
    expect(service.tags$.getValue()).toEqual(['1', '2']);
    expect(service.metaDescription$.getValue()).toBe('meta-description');
    expect(service.metaTitle$.getValue()).toBe('meta-title');
    // expect(service.accessId$.getValue()).toBe(0);
    // expect(service.accessId$.getValue()).toBe(0);
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
    expect(service.error$.getValue()).toBe(null);
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
        access_id: 1,
        time_created: 0,
        tags: ['1', '2'],
        nsfw: [1, 2],
      },
    };

    await service.load('1');
    service.content$.next('123123');

    await service.save(true);
    expect(service.error$.getValue()).toBe(null);
    expect(uploadMock.post).toHaveBeenCalled();
    expect(service.savedContent$.getValue()).toBe('content');
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

  it('should check if content matches or does not match saved content', () => {
    service.content$.next('1');
    expect(service.isContentSaved()).toBe(false);

    service.savedContent$.next('1');
    service.content$.next('1');
    expect(service.isContentSaved()).toBe(true);
  });

  it('should set next published$ state to true if draft, false if not', () => {
    (service as any).setNextPublishState(true);
    expect(service.published$.getValue()).toBeFalsy();
    (service as any).setNextPublishState(false);
    expect(service.published$.getValue()).toBeTruthy();
  });

  it('should always set accessId to 0 when saving draft', () => {
    service.accessId$.next('0');
    (service as any).setNextPublishState(true);
    expect(service.accessId$.getValue()).toBe('0');

    service.accessId$.next('1');
    (service as any).setNextPublishState(true);
    expect(service.accessId$.getValue()).toBe('0');

    service.accessId$.next('2');
    (service as any).setNextPublishState(true);
    expect(service.accessId$.getValue()).toBe('0');
  });

  it('should override an accessId of 0 when publishing, unless specified as logged in', () => {
    service.accessId$.next('0');
    (service as any).setNextPublishState();
    expect(service.accessId$.getValue()).toBe('2');

    service.accessId$.next('2');
    (service as any).setNextPublishState();
    expect(service.accessId$.getValue()).toBe('2');

    service.accessId$.next('1');
    (service as any).setNextPublishState();
    expect(service.accessId$.getValue()).toBe('1');
  });
});
