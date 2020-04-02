import { TagsPipe } from './tags';
import { FeaturesService } from '../../services/features.service';
import { MockService } from '../../utils/mock';
import { SiteService } from '../services/site.service';
import { TagsService } from '../services/tags.service';

describe('TagPipe', () => {
  const featuresServiceMock: any = MockService(FeaturesService, {
    has: feature => {
      return true;
    },
  });

  const siteServiceMock: any = MockService(SiteService, {
    props: {
      isProDomain: { get: () => false },
      pro: { get: () => false },
    },
  });

  const tagsService: any = new TagsService();

  let pipe;

  beforeEach(() => {
    pipe = new TagsPipe(featuresServiceMock, siteServiceMock, tagsService);
  });

  it('should transform when # in the middle ', () => {
    const string = 'textstring#name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/newsfeed/global/top;hashtag=name;period=7d'
    );
  });

  it('should transform when # preceded by space ', () => {
    const string = 'textstring #name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/newsfeed/global/top;hashtag=name;period=7d'
    );
  });

  it('should transform when # preceded by [] ', () => {
    const string = 'textstring [#name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/newsfeed/global/top;hashtag=name;period=7d'
    );
  });

  it('should transform when # preceded by () ', () => {
    const string = 'textstring (#name)';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/newsfeed/global/top;hashtag=name;period=7d'
    );
  });

  it('should transform uppercase text following # to lower case ', () => {
    const string = 'textString #NaMe';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/newsfeed/global/top;hashtag=name;period=7d'
    );
  });

  it('should correctly parse when duplicates substrings present', () => {
    const string = '#hash #hashlonger';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain(
      '<a href="/newsfeed/global/top;hashtag=hash;period=7d'
    );
    expect(transformedString).toContain(
      '<a href="/newsfeed/global/top;hashtag=hashlonger;period=7d'
    );
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

  it('should transform to an email', () => {
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

  it('should transform url with https', () => {
    const string = 'textstring https://minds.com/';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="https://minds.com/');
  });

  it('should transform url with ftp', () => {
    const string = 'textstring ftp://minds.com/';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="ftp://minds.com/');
  });

  it('should transform url with file', () => {
    const string = 'textstring file://minds.com/';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="file://minds.com/');
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

  it('should transform many tags', () => {
    const string = `text http://minds.com/#position@some @name
    @name1 #hash1#hash2 #hash3 ftp://s.com name@mail.com
    `;
    const transformedString = pipe.transform(<any>string);

    expect(transformedString).toContain(
      '<a href="http://minds.com/#position@some"'
    );
    expect(transformedString).toContain('<a class="tag" href="/name"');
    expect(transformedString).toContain('<a class="tag" href="/name1"');
    expect(transformedString).toContain(
      '<a href="/newsfeed/global/top;hashtag=hash1;period=7d'
    );
    expect(transformedString).toContain(
      '<a href="/newsfeed/global/top;hashtag=hash2;period=7d'
    );
    expect(transformedString).toContain(
      '<a href="/newsfeed/global/top;hashtag=hash3;period=7d'
    );
    expect(transformedString).toContain('<a href="ftp://s.com"');
    expect(transformedString).toContain('<a href="mailto:name@mail.com"');
  });
});
