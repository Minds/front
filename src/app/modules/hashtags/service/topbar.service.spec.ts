import { TopbarHashtagsService } from './topbar.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

describe('TopbarHashtagsService', () => {
  let client = null;
  let hashtagsService = new TopbarHashtagsService(client);

  it('should split hashtags from a message correctly', function(done) {
    const input = '#begin foobar #Has #Hell123 #hello and #what, #ending';
    const expectedResult = [
      'begin',
      'Has',
      'Hell123',
      'hello',
      'what',
      'ending',
    ];

    const result = hashtagsService.sliceHashTags(input);
    expect(result).toEqual(expectedResult);
    done();
  });

  it('should return an empty array if the message has no hashtags', function(done) {
    const input = 'foo bar.';
    const result = hashtagsService.sliceHashTags(input);

    expect(result).toEqual([]);
    done();
  });
});
