import { TestBed } from '@angular/core/testing';
import { DatePipe, JsonPipe } from '@angular/common';
import { UtcDatePipe } from './utcdate';

describe('DataTableFormat', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UtcDatePipe],
      providers: [DatePipe, JsonPipe],
    });
  });

  it('sanity', () => {
    expect(true).toBeTruthy();
  });

  it('should transform ', () => {
    let pipe = new UtcDatePipe();
    let testDate: Date = new Date(Date.UTC(2024, 1, 1));

    const outputDate: Date = pipe.transform(<any>testDate);

    const diffHours = Math.abs(
      Math.floor((testDate.getTime() - outputDate.getTime()) / (1000 * 60 * 60))
    );

    expect(diffHours).toBe(testDate.getTimezoneOffset() / 60);
  });
});
