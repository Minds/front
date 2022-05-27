import { TestBed } from '@angular/core/testing';
import { ReplacePipe } from './replace';

describe('ReplacePipe', () => {
  let pipe: ReplacePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReplacePipe],
    });
    pipe = new ReplacePipe();
  });

  it('should init', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a string with matching characters', () => {
    let replacePipe = pipe.transform('test_string', '_', ' ');
    expect(replacePipe).toEqual('test string');
  });

  it('should transform a multi-word string with matching characters and multi-word replacement', () => {
    let replacePipe = pipe.transform(
      'this is a test string',
      'test string',
      'passing result'
    );
    expect(replacePipe).toEqual('this is a passing result');
  });

  it('should NOT transform a multi-word string WITHOUT matching characters', () => {
    let replacePipe = pipe.transform('test string 123', '_', ' ');
    expect(replacePipe).toEqual('test string 123');
  });

  it('should NOT transform single word strings WITHOUT matching characters', () => {
    let replacePipe = pipe.transform('test', '_', ' ');
    expect(replacePipe).toEqual('test');
  });
});
