import { AudioTimePipe } from './audio-time.pipe';

describe('AudioTimePipe', () => {
  let pipe: AudioTimePipe;

  beforeEach(() => {
    pipe = new AudioTimePipe();
  });

  it('should init', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format 0 seconds', () => {
    expect(pipe.transform(0)).toBe('0:00');
  });

  it('should format seconds only', () => {
    expect(pipe.transform(5)).toBe('0:05');
    expect(pipe.transform(45)).toBe('0:45');
  });

  it('should format minutes and seconds', () => {
    expect(pipe.transform(65)).toBe('1:05');
    expect(pipe.transform(120)).toBe('2:00');
  });

  it('should format hours, minutes and seconds', () => {
    expect(pipe.transform(3665)).toBe('1:01:05');
    expect(pipe.transform(7200)).toBe('2:00:00');
    expect(pipe.transform(43201)).toBe('12:00:01');
  });
});
