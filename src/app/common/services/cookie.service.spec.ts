import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CookieService } from './cookie.service';

describe('CookieService', () => {
  let service: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CookieService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: DOCUMENT, useValue: document },
      ],
    });
    service = TestBed.inject(CookieService);
  });

  afterEach(() => {
    let cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      document.cookie =
        cookie.split('=')[0] + '=;expires=Thu, 21 Sep 1979 00:00:01 UTC;';
    }

    // Tick so that cookies actually expire.
    jasmine.clock().install();
    jasmine.clock().tick(100);
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should return null if platform is server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          CookieService,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: DOCUMENT, useValue: { cookie: 'test=value' } },
        ],
      });
      service = TestBed.inject(CookieService);
      expect(service.get('test')).toBeNull();
    });

    it('should return cookie value if exists', () => {
      document.cookie = 'test=value';
      expect(service.get('test')).toBe('value');
    });

    it('should return null if cookie does not exist', () => {
      expect(service.get('test')).toBeNull();
    });
  });

  describe('set', () => {
    it('should not set cookie if platform is server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          CookieService,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: DOCUMENT, useValue: { cookie: '' } },
        ],
      });
      service = TestBed.inject(CookieService);
      service.set('test', 'value');
      expect(service.get('test')).toBeNull();
    });

    it('should set cookie with name and value', () => {
      service.set('test', 'value');
      expect(document.cookie).toContain('test=value');
    });

    it('should set multiple cookies', () => {
      service.set('test1', 'value1');
      service.set('test2', 'value2');
      expect(document.cookie).toBe('test1=value1; test2=value2');
    });
  });

  describe('check', () => {
    it('should return false if platform is server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          CookieService,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: DOCUMENT, useValue: { cookie: 'test=value' } },
        ],
      });
      service = TestBed.inject(CookieService);
      expect(service.get('test')).toBeNull();
    });

    it('should return true if cookie exists', () => {
      document.cookie = 'test=value';
      expect(service.check('test')).toBeTrue();
    });

    it('should return false if cookie does not exist', () => {
      expect(service.check('test')).toBeFalse();
    });
  });

  describe('delete', () => {
    it('should not delete cookie if platform is server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          CookieService,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: DOCUMENT, useValue: { cookie: 'test=value' } },
        ],
      });
      service = TestBed.inject(CookieService);
      document.cookie = 'test=value';
      service.delete('test');
      expect(service.get('test')).toBeNull();
    });

    it('should delete cookie', () => {
      document.cookie = 'test=value';
      service.delete('test');
      expect(service.get('test')).toBeNull();
    });
  });

  describe('deleteAll', () => {
    it('should not delete cookies if platform is server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          CookieService,
          { provide: PLATFORM_ID, useValue: 'server' },
          {
            provide: DOCUMENT,
            useValue: { cookie: 'test1=value1; test2=value2' },
          },
        ],
      });
      service = TestBed.inject(CookieService);
      document.cookie = 'test1=value1';
      document.cookie = 'test2=value2';

      service.deleteAll();
      expect(service.get('test1')).toBeNull();
      expect(service.get('test2')).toBeNull();
    });

    it('should delete all cookies', () => {
      document.cookie = 'test1=value1; test2=value2';
      service.deleteAll();
      expect(service.get('test1')).toBeNull();
      expect(service.get('test2')).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return empty object if platform is server', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          CookieService,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: DOCUMENT, useValue: { cookie: 'test=value' } },
        ],
      });
      service = TestBed.inject(CookieService);
      expect(service.getAll()).toEqual([]);
    });

    it('should return all cookies', () => {
      document.cookie = 'test1=value1';
      document.cookie = 'test2=value2';

      expect(service.getAll()).toEqual([
        { name: 'test1', value: 'value1' },
        { name: 'test2', value: 'value2' },
      ]);
    });

    it('should return empty object if no cookies exist', () => {
      document.cookie = '';
      expect(service.getAll()).toEqual([]);
    });
  });
});
