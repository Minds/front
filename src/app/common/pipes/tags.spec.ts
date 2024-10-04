import { TagsPipe } from './tags';
import { MockService } from '../../utils/mock';
import { SiteService } from '../services/site.service';
import { RegexService } from '../services/regex.service';
import { TextParserService } from '../services/text-parser.service';

describe('TagPipe', () => {
  const siteServiceMock: any = MockService(SiteService, {
    props: {
      pro: { get: () => false },
    },
  });

  const regexService: any = new RegexService();

  let pipe;

  beforeEach(() => {
    pipe = new TagsPipe(siteServiceMock, new TextParserService(), regexService);
  });

  it('should transform when # in the middle ', () => {
    const string = 'textstring#name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%23name'
    );
  });

  it('should transform when # preceded by space ', () => {
    const string = 'textstring #name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%23name'
    );
  });

  it('should transform when # preceded by [] ', () => {
    const string = 'textstring [#name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%23name'
    );
  });

  it('should transform when # preceded by () ', () => {
    const string = 'textstring (#name)';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%23name'
    );
  });

  it('should transform uppercase text following # to lower case ', () => {
    const string = 'textString #NaMe';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%23name'
    );
  });

  it('should correctly parse when duplicates substrings present', () => {
    const string = '#hash #hashlonger';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%23hash'
    );
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%23hashlonger'
    );
  });

  it('should transform accents', () => {
    const string = 'textString #CrèmeBrûlée';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('>#CrèmeBrûlée</a>');
  });

  it('should transform Thai words', () => {
    const string = 'textString #ไทย';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('>#ไทย</a>');
  });

  it('should transform Japanense words', () => {
    const string = 'textString #日本';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('>#日本</a>');
  });

  it('should transform when @ preceded by () ', () => {
    const string = 'textstring (@name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a class="tag"');
  });

  it('should transform when @ preceded by [] ', () => {
    const string = 'textstring [@name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a class="tag"');
  });

  it('should transform when @ preceded by space', () => {
    const string = 'textstring @name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a class="tag"');
  });

  it('should transform when @ followed by `.com`', () => {
    const string = 'textstring @name.com';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a class="tag"');
    expect(transformedString).toContain('@name.com');
  });

  it('should not transform when # preceded by by `&`', () => {
    const string = '&#243;';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('&#243;');
  });

  it('should transform two adjacent tags', () => {
    const string = '@test1 @test2';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toEqual(
      '<a class="tag" href="/test1" target="_blank">@test1</a> <a class="tag" href="/test2" target="_blank">@test2</a>'
    );
  });

  it('should transform many adjacent tags', () => {
    const string =
      '@test1 @test2 @test3 @test4 @test5 @test6 @test7 @test8 @test9 @test10 @test11 @test12 @test13 @test14 @test15';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toEqual(
      `<a class="tag" href="/test1" target="_blank">@test1</a> <a class="tag" href="/test2" target="_blank">@test2</a> ` +
        `<a class="tag" href="/test3" target="_blank">@test3</a> <a class="tag" href="/test4" target="_blank">@test4</a> ` +
        `<a class="tag" href="/test5" target="_blank">@test5</a> <a class="tag" href="/test6" target="_blank">@test6</a> ` +
        `<a class="tag" href="/test7" target="_blank">@test7</a> <a class="tag" href="/test8" target="_blank">@test8</a> ` +
        `<a class="tag" href="/test9" target="_blank">@test9</a> <a class="tag" href="/test10" target="_blank">@test10</a> ` +
        `<a class="tag" href="/test11" target="_blank">@test11</a> <a class="tag" href="/test12" target="_blank">@test12</a> ` +
        `<a class="tag" href="/test13" target="_blank">@test13</a> <a class="tag" href="/test14" target="_blank">@test14</a> ` +
        `<a class="tag" href="/test15" target="_blank">@test15</a>`
    );
  });

  xit('should transform to an email', () => {
    const string = 'textstring@name.com';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="mailto:textstring@name.com"');
  });

  it('should not transform when @ not present', () => {
    const string = 'textstring name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toEqual(string);
    expect(transformedString).not.toContain('<a class="tag"');
  });

  it('should transform url http', () => {
    const string = 'textstring http://minds.com/';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="http://minds.com/');
  });

  it('should transform url without protocol', () => {
    const string = 'textstring www.minds.com';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="//www.minds.com');
  });

  it('should transform url without protocol or subdomain', () => {
    const string = 'textstring minds.com';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="//minds.com');
  });

  it('should NOT detect ellipsis as part of URL', () => {
    const string = 'textstring minds.com...';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="//minds.com');
  });

  it('should NOT detect short acronyms as URLs', () => {
    const string = 'textstring i.e. things';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).not.toContain('<a href');
  });

  it('should NOT detect long acronyms as URLs', () => {
    const string = 'textstring A.C.R.O.N.Y.M things';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).not.toContain('<a href');
  });

  it('should NOT detect forward slash formatted dates as URLs', () => {
    const string = 'textstring 1/1/2022 things';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).not.toContain('<a href');
  });

  it('should NOT detect forward slash seperated comparisons as URLs', () => {
    const string = 'textstring thing1/thing2';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).not.toContain('<a href');
  });

  it('should NOT the end of a quote as a URL', () => {
    const string = 'textstring "not a url".';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).not.toContain('<a href');
  });

  it('should transform url with https', () => {
    const string = 'textstring https://minds.com/';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="https://minds.com/');
  });

  it('should transform url with a hashtag', () => {
    const string = 'text http://minds.com/#position';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      'text <a href="http://minds.com/#position"'
    );
  });

  it('should transform url with a hashtag and @', () => {
    const string = 'text http://minds.com/#position@some';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      'text <a href="http://minds.com/#position@some"'
    );
  });

  it('should transform url with a ? at the end, without the ?', () => {
    const string = 'text https://minds.com/test?';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      'text <a href="https://minds.com/test"'
    );
  });

  it("should transform url with multiple ?'s at the end, without the ?'s", () => {
    const string = 'text https://minds.com/test???????';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      'text <a href="https://minds.com/test"'
    );
  });

  it('should transform url with a ! at the end, without the !', () => {
    const string = 'text https://minds.com/test!';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      'text <a href="https://minds.com/test"'
    );
  });

  it("should transform url with a !'s at the end, without the !'s", () => {
    const string = 'text https://minds.com/test!!!!!!!!!!!!';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      'text <a href="https://minds.com/test"'
    );
  });

  it('should transform url with a !? at the end, without the !?', () => {
    const string = 'text https://minds.com/test!?';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      'text <a href="https://minds.com/test"'
    );
  });

  // reversed
  it('should transform url with a ?! at the end, without the ?!', () => {
    const string = 'text https://minds.com/test?!';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      'text <a href="https://minds.com/test"'
    );
  });

  it('should not transform ? when NOT in the last character position', () => {
    const string = 'text https://minds.com/test/test?url=!t#rue.asp';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      'text <a href="https://minds.com/test/test?url=!t#rue.asp"'
    );
  });

  it('should transform many tags', () => {
    const string = `text http://minds.com/#position@some @name
    @name1 #hash1#hash2 #hash3 http://s.com
    `;
    const transformedString = pipe.transform(<any>string);

    expect(transformedString).toContain(
      '<a href="http://minds.com/#position@some"'
    );
    expect(transformedString).toContain('<a class="tag" href="/name"');
    expect(transformedString).toContain('<a class="tag" href="/name1"');
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%23hash1'
    );
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%23hash2'
    );
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%23hash3'
    );
    expect(transformedString).toContain('<a href="http://s.com"');
  });

  it('should transform when $ in the middle ', () => {
    const string = 'textstring$MINDS';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%24MINDS'
    );
  });

  it('should transform when $ preceded by space ', () => {
    const string = 'textstring $MINDS';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%24MINDS'
    );
  });

  it('should transform when $ preceded by [] ', () => {
    const string = 'textstring [$MINDS';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%24MINDS'
    );
  });

  it('should transform when $ preceded by () ', () => {
    const string = 'textstring ($MINDS)';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%24MINDS'
    );
  });

  it('should transform uppercase text following $ to lower case ', () => {
    const string = 'textString $Minds';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%24MINDS'
    );
  });

  it("should correctly parse $'s when duplicates substrings present", () => {
    const string = '$MINDS $MINDSTOKEN';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%24MINDS'
    );
    expect(transformedString).toContain(
      '<a href="/discovery/search?f=top&t=all&q=%24MINDSTOKEN'
    );
  });
});
