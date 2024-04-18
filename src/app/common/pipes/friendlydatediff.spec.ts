import { TestBed } from '@angular/core/testing';
import { DatePipe, JsonPipe } from '@angular/common';
import { FriendlyDateDiffPipe } from './friendlydatediff';
import * as moment from 'moment';

describe('FriendlyDateDiff', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendlyDateDiffPipe],
    });
  });

  it('sanity', () => {
    expect(true).toBeTruthy();
  });

  it('should transform into an absolute date with year when there is a difference of 1 year or greater', () => {
    let pipe = new FriendlyDateDiffPipe();

    let testDate = moment().subtract(1, 'years').unix();

    let result = moment().subtract(1, 'years').format('MMM D YYYY');

    let transformedDate = pipe.transform(<any>testDate);
    expect(transformedDate).toEqual(result);
  });

  it('should transform into an absolute date without year when there is a difference of 1 day or greater', () => {
    let pipe = new FriendlyDateDiffPipe();

    let testDate = moment().subtract(1, 'days').unix();

    let result = moment().subtract(1, 'days').format('MMM D');

    let transformedDate = pipe.transform(<any>testDate);
    expect(transformedDate).toEqual(result);
  });

  it('should transform into a relative time with a 23 hour difference', () => {
    let pipe = new FriendlyDateDiffPipe();

    let testDate = moment().subtract(23, 'hours').unix();

    let result = '23h';

    let transformedDate = pipe.transform(<any>testDate);
    expect(transformedDate).toEqual(result);
  });

  it('should transform into a relative time with a 1 minute difference', () => {
    let pipe = new FriendlyDateDiffPipe();

    let testDate = moment().subtract(1, 'minute').unix();

    let result = '1m';

    let transformedDate = pipe.transform(<any>testDate);
    expect(transformedDate).toEqual(result);
  });

  it('should transform a date without a referenceDate and use the current time', () => {
    let pipe = new FriendlyDateDiffPipe();
    let testDate = moment().unix();
    let transformedDate = pipe.transform(<any>testDate);
    expect(transformedDate).toEqual('0s');
  });

  it('should transform a date with a referenceDate', () => {
    let pipe = new FriendlyDateDiffPipe();
    let testDate = moment('2017-07-19').unix();
    let referenceDate = moment('2018-07-19').unix();
    let transformedDate = pipe.transform(<any>testDate, referenceDate);
    expect(transformedDate).toEqual('Jul 19 2017');
  });

  it('should transform number inputs', () => {
    let pipe = new FriendlyDateDiffPipe();
    let testDate = moment().subtract(2, 'minutes').unix();
    let referenceDate = moment().unix();
    let transformedDate = pipe.transform(<any>testDate, referenceDate);
    expect(transformedDate).toEqual('2m');
  });

  it('should transform string inputs', () => {
    let pipe = new FriendlyDateDiffPipe();
    let testDate = moment().subtract(2, 'minutes').unix().toString();
    let referenceDate = moment().unix().toString();
    let transformedDate = pipe.transform(<any>testDate, referenceDate);
    expect(transformedDate).toEqual('2m');
  });
});
