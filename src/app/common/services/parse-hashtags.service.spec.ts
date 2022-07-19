import { TestBed } from '@angular/core/testing';
import { HashtagsFromStringService } from './parse-hashtags.service';
import { RegexService } from './regex.service';

describe('HashtagsFromStringService', () => {
  let service: HashtagsFromStringService;

  const regexService: any = new RegexService();

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    TestBed.configureTestingModule({
      providers: [],
    });

    service = new HashtagsFromStringService(regexService);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should strip URLs from string', () => {
    expect(
      (service as any).stripUrls(
        '#1 #2 #3 #4 https://www.minds.com/#install #5'
      )
    ).toBe('#1 #2 #3 #4  #5');
  });

  it('should parse linear hashtags', () => {
    expect(service.parseHashtagsFromString('#1 #2 #3 #4 #5 #6 #7 #8')).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
    ]);
  });

  it('should parse linear hashtags padding by non-hashtags', () => {
    expect(
      service.parseHashtagsFromString(
        '#1 split #2 split #3 split #4 split #5 split #6 split #7 split #8'
      )
    ).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
  });

  it('should return an empty array when there are no matches', () => {
    expect(service.parseHashtagsFromString('no hashtags here')).toEqual([]);
  });

  it('should not count a url in a string of hashtags', () => {
    expect(
      service.parseHashtagsFromString(
        '#1 #2 split #3 https://www.minds.com/#4 #5'
      )
    ).toEqual(['1', '2', '3', '5']);
  });

  it('should parse multiline strings', () => {
    expect(
      service.parseHashtagsFromString(
        `#1
      4 #2
      #3`
      )
    ).toEqual(['1', '2', '3']);
  });

  it('should parse hashtags with no space seperator', () => {
    expect(service.parseHashtagsFromString('#1#2#3#4#5')).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
    ]);
  });
});
