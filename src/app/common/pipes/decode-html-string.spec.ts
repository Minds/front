import { TestBed } from '@angular/core/testing';
import { DecodeHtmlStringPipe } from './decode-html-string';

describe('DecodeHtmlStringPipe', () => {
  let pipe: DecodeHtmlStringPipe;

  beforeAll(() => {
    TestBed.configureTestingModule({
      declarations: [DecodeHtmlStringPipe],
    });

    pipe = new DecodeHtmlStringPipe();
  });

  it('it to initialize', () => {
    expect(true).toBeTruthy();
  });

  it('should transform html entity quotes into raw quotes', () => {
    expect(pipe.transform('&quot;hello&quot;')).toEqual('"hello"');
  });

  it('should transform html entity ampersand into its symbol', () => {
    expect(pipe.transform('&amp;hello')).toEqual('&hello');
  });

  it('should transform html entity less than into its symbol', () => {
    expect(pipe.transform('&lt;hello')).toEqual('<hello');
  });

  it('should transform html entity greater than into its symbol', () => {
    expect(pipe.transform('&gt;hello')).toEqual('>hello');
  });

  it('should remove HTML tags', () => {
    expect(pipe.transform('<img><div>')).toEqual('');
    expect(pipe.transform('<IMG SRC="javascript:alert(\'XSS\');">')).toEqual(
      ''
    );
  });

  it('should transform many html entities into raw quotes', () => {
    expect(pipe.transform('&amp;hello&gt;&lt;this&quot;')).toEqual(
      '&hello><this"'
    );
  });

  it('should not transform text with no html entities', () => {
    const str = '& this is "text"';
    expect(pipe.transform(str)).toEqual(str);
  });
});
