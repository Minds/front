import { TestBed } from '@angular/core/testing';
import { RegexService } from './regex.service';

describe('RegexService', () => {
  let service: RegexService;

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    TestBed.configureTestingModule({
      providers: [],
    });

    service = new RegexService();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  // Email

  it('should validate email with just alphabetic characters', () => {
    expect(service.getRegex('mail').test('test@minds.com')).toBeTruthy();
  });

  it('should validate email with numbers', () => {
    expect(service.getRegex('mail').test('9911@9.com')).toBeTruthy();
  });

  it('should validate email with multiple numbers in domain', () => {
    expect(service.getRegex('mail').test('9911@9.99')).toBeTruthy();
  });

  it('should validate email with a mix of numbers and and alphabetic chars', () => {
    expect(service.getRegex('mail').test('test19@minds.com')).toBeTruthy();
  });

  it('should validate email with a mix of numbers and valid alphabetic chars', () => {
    expect(service.getRegex('mail').test('test19@minds.com')).toBeTruthy();
  });

  it('should validate email with a mix of special chars in username', () => {
    expect(
      service.getRegex('mail').test('t#e!s$t%1.&9+@minds.com')
    ).toBeTruthy();
  });

  it('should NOT validate an email without a domain name', () => {
    expect(service.getRegex('mail').test('test@.com')).toBeFalsy();
  });

  it('should NOT validate an email without a domain name OR TDL', () => {
    expect(service.getRegex('mail').test('test@')).toBeFalsy();
  });

  it('should NOT validate an email without a username', () => {
    expect(service.getRegex('mail').test('@minds.com')).toBeFalsy();
  });

  it('should NOT validate an email without a TLD', () => {
    expect(service.getRegex('mail').test('test@minds')).toBeFalsy();
  });

  it('should NOT validate @ as an email', () => {
    expect(service.getRegex('mail').test('@')).toBeFalsy();
  });
});
