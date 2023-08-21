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

  // Email.

  describe('email', () => {
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

  // At tag.

  describe('at tag, no domain', () => {
    it('should validate an at tag with no domain', () => {
      const testString: string = '@test';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@test');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('test');
    });

    it('should validate an upper-case at tag with no domain', () => {
      const testString: string = '@TEST';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@TEST');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('TEST');
    });

    it('should validate a mixed-case at tag with no domain', () => {
      const testString: string = '@TeSt';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@TeSt');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('TeSt');
    });

    it('should validate an at tag with numbers and no domain', () => {
      const testString: string = '@test1';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@test1');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('test1');
    });

    it('should validate an at tag with hyphen and no domain', () => {
      const testString: string = '@test1-hyphen';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@test1-hyphen');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('test1-hyphen');
    });

    it('should validate an at tag with underscores and no domain', () => {
      const testString: string = '@test_1_underscore';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@test_1_underscore');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('test_1_underscore');
    });

    it('should validate an at tag with an underscore at the end and no domain', () => {
      const testString: string = '@test_1_underscore_';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@test_1_underscore_');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('test_1_underscore_');
    });

    it('should validate an at tag with periods and no domain', () => {
      const testString: string = '@test.1.period';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@test.1.period');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('test.1.period');
    });

    it('should validate an at tag surrounded by other terms and no domain', () => {
      const testString: string = 'otherTerm1 @test otherTerm2';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe(' @test');
      expect(results[1]).toBe(' ');
      expect(results[2]).toBe('test');
    });

    it('should the first of many at tags with no domain', () => {
      const testString: string =
        'otherTerm1 @test1 otherTerm2 @test2 1 @test3 @test4@test5';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe(' @test1');
      expect(results[1]).toBe(' ');
      expect(results[2]).toBe('test1');
    });

    it('should ignore any hyphen at the end of an at tag with no domain', () => {
      const testString: string = '@test-';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@test');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('test');
    });

    it('should ignore any period at the end of an at tag with no domain', () => {
      const testString: string = '@test.';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@test');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('test');
    });

    it('should NOT validate an at tag mid-word with no domain', () => {
      const testString: string = 'hello@test';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results).toBe(null);
    });
  });

  describe('at tag, with domain', () => {
    it('should validate an at tag with domain', () => {
      const testString: string = '@test@minds.com';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@test@minds.com');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('test@minds.com');
      expect(results[3]).toBe('minds.com');
    });

    it('should validate an upper-case at tag with lowercase domain', () => {
      const testString: string = '@TEST@minds.com';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@TEST@minds.com');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('TEST@minds.com');
      expect(results[3]).toBe('minds.com');
    });

    it('should validate an upper-case at tag with uppercase domain', () => {
      const testString: string = '@TEST@MINDS.COM';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@TEST@MINDS.COM');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('TEST@MINDS.COM');
      expect(results[3]).toBe('MINDS.COM');
    });

    it('should validate a mixed-case at tag with domain', () => {
      const testString: string = '@TeSt@mInDs.cOm';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@TeSt@mInDs.cOm');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('TeSt@mInDs.cOm');
      expect(results[3]).toBe('mInDs.cOm');
    });

    it('should validate an at tag with numbers and domain', () => {
      const testString: string = '@test1@minds1.com';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@test1@minds1.com');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('test1@minds1.com');
      expect(results[3]).toBe('minds1.com');
    });

    it('should validate an at tag with hyphen in prefix and domain', () => {
      const testString: string = '@test1-hyphen@minds-test.com';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@test1-hyphen@minds-test.com');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('test1-hyphen@minds-test.com');
      expect(results[3]).toBe('minds-test.com');
    });

    it('should validate an at tag with underscores and domain', () => {
      const testString: string = '@test_1_underscore@minds_test.com';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@test_1_underscore@minds_test.com');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('test_1_underscore@minds_test.com');
      expect(results[3]).toBe('minds_test.com');
    });

    it('should validate an at tag with an underscore at the end and domain', () => {
      const testString: string = '@test_1_underscore_@minds.com';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@test_1_underscore_@minds.com');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('test_1_underscore_@minds.com');
      expect(results[3]).toBe('minds.com');
    });

    it('should validate an at tag with periods and domain', () => {
      const testString: string = '@test.1.period@minds.com';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@test.1.period@minds.com');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('test.1.period@minds.com');
      expect(results[3]).toBe('minds.com');
    });

    it('should validate an at tag surrounded by other terms and domain', () => {
      const testString: string = 'otherTerm1 @test@minds.com otherTerm2';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe(' @test@minds.com');
      expect(results[1]).toBe(' ');
      expect(results[2]).toBe('test@minds.com');
      expect(results[3]).toBe('minds.com');
    });

    it('should the first of many at tags with domain', () => {
      const testString: string =
        'otherTerm1 @test1@minds.com otherTerm2 @test2 1 @test3 @test4@test5';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe(' @test1@minds.com');
      expect(results[1]).toBe(' ');
      expect(results[2]).toBe('test1@minds.com');
      expect(results[3]).toBe('minds.com');
    });

    it('should ignore any hyphen at the end of an at tag with domain', () => {
      const testString: string = '@test-@minds.com';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@test');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('test');
    });

    it('should ignore any period at the end of an at tag with domain', () => {
      const testString: string = '@test.@minds.com';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results[0]).toBe('@test');
      expect(results[1]).toBe('');
      expect(results[2]).toBe('test');
    });

    it('should NOT validate an at tag mid-word with domain', () => {
      const testString: string = 'hello@test@minds.com';
      const regex: RegExp = service.getRegex('at');
      const results: string[] = regex.exec(testString);

      expect(results).toBe(null);
    });
  });
});
