import { TestBed } from '@angular/core/testing';
import { PagesService } from './pages.service';

describe('PagesService', () => {
  let service: PagesService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    TestBed.configureTestingModule({
      providers: [],
    });

    service = new PagesService();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should discern the difference between internal and external URLs', () => {
    expect(
      service.isInternalLink(
        'itunes.apple.com/us/app/minds-com/id961771928%3Fmt%3D8'
      )
    ).toBeFalsy();

    // testing for RegExp collision issues.
    expect(
      !service.isInternalLink(
        'itunes.apple.com/us/app/minds-com/id961771928%3Fmt%3D8'
      )
    ).toBeTruthy();
  });

  it('should still find external links starting https:// or http://', () => {
    expect(
      service.isInternalLink(
        'http://itunes.apple.com/us/app/minds-com/id961771928%3Fmt%3D8'
      )
    ).toBeFalsy();
    expect(
      !service.isInternalLink(
        'http://itunes.apple.com/us/app/minds-com/id961771928%3Fmt%3D8'
      )
    ).toBeTruthy();
    expect(
      service.isInternalLink(
        'https://itunes.apple.com/us/app/minds-com/id961771928%3Fmt%3D8'
      )
    ).toBeFalsy();
    expect(
      !service.isInternalLink(
        'https://itunes.apple.com/us/app/minds-com/id961771928%3Fmt%3D8'
      )
    ).toBeTruthy();
  });

  it('should discern a URL is not internal', () => {
    expect(
      service.isInternalLink('https://www.testlinkdonotclick.com/test/')
    ).toBeFalsy();
    expect(
      !service.isInternalLink('https://www.testlinkdonotclick.com/test/')
    ).toBeTruthy();
  });

  it('should discern an internal URL', () => {
    expect(service.isInternalLink('p/terms-of-service')).toBeTruthy();
    expect(service.isInternalLink('p/terms-of-service')).not.toBeFalsy();
  });

  it('should not flag a URL as internal when p/ not in first position', () => {
    expect(service.isInternalLink('app/terms-of-service')).toBeFalsy();
    expect(service.isInternalLink('app/terms-of-service')).not.toBeTruthy();
  });
});
