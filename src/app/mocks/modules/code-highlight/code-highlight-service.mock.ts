export let codeHighlightServiceMock = new (function () {
  this.highlightBlock = jasmine.createSpy('highlightBlock');

  this.highlight = jasmine.createSpy('highlight').and.callFake((lang, code) => {
    return { value: code, language: lang };
  });

  this.highlightAuto = jasmine
    .createSpy('highlightAuto')
    .and.callFake((code) => {
      return { value: code, language: 'javascript' };
    });

  this.reset = () => {
    this.highlightBlock.calls.reset();
    this.highlight.calls.reset();
    this.highlightAuto.calls.reset();
  };
})();
