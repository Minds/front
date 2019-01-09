import { TestBed } from "@angular/core/testing";
import { DatePipe, JsonPipe } from "@angular/common";
import { FriendlyDateDiffPipe } from './friendlydatediff';

describe('FriendlyDateDiff', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendlyDateDiffPipe]
    });
  });

  it('sanity', () => {
    expect(true).toBeTruthy();
  });

  it('should transform a date with a 1 year difference', () => {
    let pipe = new FriendlyDateDiffPipe();
    let testDate: Date = new Date(2019, 1, 1);
    let referenceDate: Date = new Date(2020, 1, 1);
    
    let transformedDate = pipe.transform(<any>testDate, referenceDate.toISOString());
    expect(transformedDate).toEqual("1y ago");

    transformedDate = pipe.transform(<any>testDate, referenceDate.toString());
    expect(transformedDate).toEqual("1y ago");

    //As unix timestamp
    transformedDate = pipe.transform(<any>testDate, referenceDate.getTime());
    expect(transformedDate).toEqual("1y ago");

  });

  it('should transform a date with a 51 week difference', () => {
    let pipe = new FriendlyDateDiffPipe();
    let testDate: Date = new Date(2019, 1, 1);
    let referenceDate: Date = new Date(2019, 12, 30);
    
    let transformedDate = pipe.transform(<any>testDate, referenceDate.toISOString());
    expect(transformedDate).toEqual("51w ago");

    transformedDate = pipe.transform(<any>testDate, referenceDate.toString());
    expect(transformedDate).toEqual("51w ago");

    //As unix timestamp
    transformedDate = pipe.transform(<any>testDate, referenceDate.getTime());
    expect(transformedDate).toEqual("51w ago");

  });

  it('should transform a date with a 6 day difference', () => {
    let pipe = new FriendlyDateDiffPipe();
    let testDate: Date = new Date(2019, 1, 1);
    let referenceDate: Date = new Date(2019, 1, 7);
    
    let transformedDate = pipe.transform(<any>testDate, referenceDate.toISOString());
    expect(transformedDate).toEqual("6d ago");

    transformedDate = pipe.transform(<any>testDate, referenceDate.toString());
    expect(transformedDate).toEqual("6d ago");

    //As unix timestamp
    transformedDate = pipe.transform(<any>testDate, referenceDate.getTime());
    expect(transformedDate).toEqual("6d ago");

  });

  it('should transform a date with a 23 hour difference', () => {
    let pipe = new FriendlyDateDiffPipe();
    let testDate: Date = new Date(2019, 1, 1);
    let referenceDate: Date = new Date(2019, 1, 1, 23);
    
    let transformedDate = pipe.transform(<any>testDate, referenceDate.toISOString());
    expect(transformedDate).toEqual("23h ago");

    transformedDate = pipe.transform(<any>testDate, referenceDate.toString());
    expect(transformedDate).toEqual("23h ago");

    //As unix timestamp
    transformedDate = pipe.transform(<any>testDate, referenceDate.getTime());
    expect(transformedDate).toEqual("23h ago");

  });

  it('should transform a date with a 1 minute difference', () => {
    let pipe = new FriendlyDateDiffPipe();
    let testDate: Date = new Date(2019, 1, 1, 0, 1);
    let referenceDate: Date = new Date(2019, 1, 1, 0, 2);
    
    let transformedDate = pipe.transform(<any>testDate, referenceDate.toISOString());
    expect(transformedDate).toEqual("1m ago");

    transformedDate = pipe.transform(<any>testDate, referenceDate.toString());
    expect(transformedDate).toEqual("1m ago");

    //As unix timestamp
    transformedDate = pipe.transform(<any>testDate, referenceDate.getTime());
    expect(transformedDate).toEqual("1m ago");

  });

  it('should transform a date without a referenceDate and use the current time', () => {
    let pipe = new FriendlyDateDiffPipe();
    let testDate: Date = new Date();
    let transformedDate = pipe.transform(<any>testDate);
    expect(transformedDate).toEqual("0s ago");
  });

  it('should transform a date without a referenceDate and use the current time minus 1 year', () => {
    let pipe = new FriendlyDateDiffPipe();
    let testDate: Date = new Date();
    testDate.setFullYear(testDate.getFullYear() - 1);
    let transformedDate = pipe.transform(<any>testDate);
    expect(transformedDate).toEqual("1y ago");
  });

});