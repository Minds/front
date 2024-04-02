import { TestBed } from '@angular/core/testing';
import { ChatDatePipe } from './chat-date-pipe';
import * as moment from 'moment';

describe('ChatDatePipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatDatePipe],
    });
  });

  it('init', () => {
    expect(true).toBeTruthy();
  });

  it('should transform into an string when same day', () => {
    let pipe = new ChatDatePipe();

    let testDate = moment()
      .startOf('day')
      .add(1, 'seconds');

    let transformedDate = pipe.transform(testDate.unix());
    expect(transformedDate).toEqual(testDate.format('h:mma'));
  });

  it('should transform into an string when same day and NOT short mode', () => {
    let pipe = new ChatDatePipe();

    let testDate = moment()
      .startOf('day')
      .add(1, 'seconds');

    let transformedDate = pipe.transform(testDate.unix(), false);
    expect(transformedDate).toEqual(testDate.format('h:mma'));
  });

  it('should transform into an string when NOT same day but same year', () => {
    let pipe = new ChatDatePipe();

    let testDate = moment()
      .startOf('day')
      .subtract(20, 'seconds');

    let transformedDate = pipe.transform(testDate.unix());
    expect(transformedDate).toEqual(testDate.format('MMM DD'));
  });

  it('should transform into an string when NOT same day but same year and NOT short mode', () => {
    let pipe = new ChatDatePipe();

    let testDate = moment()
      .startOf('day')
      .subtract(20, 'seconds');

    let transformedDate = pipe.transform(testDate.unix(), false);
    expect(transformedDate).toEqual(testDate.format('MMM DD h:mma'));
  });

  it('should transform into an string when NOT same year', () => {
    let pipe = new ChatDatePipe();

    let testDate = moment()
      .startOf('year')
      .subtract(20, 'seconds');

    let transformedDate = pipe.transform(testDate.unix());
    expect(transformedDate).toEqual(testDate.format('MMM D YYYY'));
  });

  it('should transform into an string when NOT same year and NOT short mode', () => {
    let pipe = new ChatDatePipe();

    let testDate = moment()
      .startOf('year')
      .subtract(20, 'seconds');

    let transformedDate = pipe.transform(testDate.unix(), false);
    expect(transformedDate).toEqual(testDate.format('MMM D YYYY h:mma'));
  });
});
