import { isFirefox } from './is-firefox';

describe('isFirefox', () => {
  it('should return true if the browser is firefox', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 etc Firefox/89.0',
    });
    expect(isFirefox()).toBeTrue();
  });

  it('should return false if the browser is NOT firefox', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 etc Chrome/126.0.0.0',
    });
    expect(isFirefox()).toBeFalse();
  });
});
