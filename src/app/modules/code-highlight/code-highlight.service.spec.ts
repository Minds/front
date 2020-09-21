import { CodeHighlightService } from './code-highlight.service';

describe('CodeHighlightService', () => {
  let service;

  beforeEach(() => {
    service = new CodeHighlightService();

    spyOn(service, 'getLanguages').and.callFake(() => {
      return ['javascript'];
    });

    spyOn(service, 'highlightAuto').and.callThrough();
  });

  it('should fall back to automatic language detection when passed unsupported language', () => {
    const res = service.highlight('brainfuck', '[->+<]');

    expect(service.highlightAuto).toHaveBeenCalledWith('[->+<]');
  });
});
