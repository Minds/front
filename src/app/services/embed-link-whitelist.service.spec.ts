import { TestBed } from '@angular/core/testing';
import { EmbedLinkWhitelistService } from './embed-link-whitelist.service';

describe('EmbedLinkWhitelistService', () => {
  let service: EmbedLinkWhitelistService;

  beforeEach(() => {
    service = TestBed.inject(EmbedLinkWhitelistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should determine an Odysee video embed link is whitelisted', () => {
    expect(
      service.isWhitelisted(
        'https://odysee.com/$/embed/odyseeplaylists/dbd9a2dcca07d8fdd78e8281b764dedc839c2d3a'
      )
    ).toBeTruthy();
  });

  it('should NOT determine a direct Odysee video link is whitelisted', () => {
    expect(
      service.isWhitelisted(
        'https://odysee.com/odyseeplaylists:dbd9a2dcca07d8fdd78e8281b764dedc839c2d3a'
      )
    ).toBeFalsy();
  });

  it('should determine a Rumble video embed link is whitelisted', () => {
    expect(
      service.isWhitelisted('https://rumble.com/embed/v7z2oy/?pub=4')
    ).toBeTruthy();
  });

  it('should NOT determine a direct Rumble video link is whitelisted', () => {
    expect(
      service.isWhitelisted('https://rumble.com/val8vm-how-to-use-rumble.html')
    ).toBeFalsy();
  });

  it('should identify a link is not whitelisted', () => {
    expect(
      service.isWhitelisted('https://www.youtube.com/watch?v=jNQXAC9IVRw')
    ).toBeFalsy();
  });

  describe('Scribd', () => {
    it('should determine a Scribd document embed link is whitelisted', () => {
      expect(
        service.isWhitelisted('https://www.scribd.com/document/123456789')
      ).toBeTruthy();
    });

    it('should determine a Scribd document embed link without www is whitelisted', () => {
      expect(
        service.isWhitelisted('https://scribd.com/document/987654321')
      ).toBeTruthy();
    });

    it('should NOT determine a non document Scribd link is whitelisted', () => {
      expect(
        service.isWhitelisted('https://www.scribd.com/search')
      ).toBeFalsy();
    });
  });
});
