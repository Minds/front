import { CodeHighlightPipe } from './code-highlight.pipe';
import { CodeHighlightService } from './code-highlight.service';
import { codeHighlightServiceMock } from '../../mocks/modules/code-highlight/code-highlight-service.mock';

describe('CodeHighlightPipe', () => {
  let pipe;

  const setup = (featureEnabled) => {
    pipe = new CodeHighlightPipe(codeHighlightServiceMock);
  };

  const createCodeBlockHtmlString = (lang, code) => {
    return (
      `<div class="${CodeHighlightService.moduleWrapperClass}">` +
      `<pre><code class="language-${lang}">${code}</code></pre>` +
      `</div>`
    );
  };

  describe('when feature is enabled', () => {
    beforeEach(() => {
      setup(true);
    });

    afterEach(() => {
      codeHighlightServiceMock.reset();
    });

    it('should transform code blocks into highlighted code blocks', () => {
      const string = `\`\`\`javascript console.log(a);\`\`\``;
      const transformedString = pipe.transform(string);

      expect(transformedString).toBe(
        createCodeBlockHtmlString('javascript', 'console.log(a);')
      );

      expect(codeHighlightServiceMock.highlight).toHaveBeenCalledWith(
        'javascript',
        'console.log(a);'
      );
    });

    it('should automatically transform code blocks when auto is the language hint', () => {
      const string = `\`\`\`auto console.log(a);\`\`\``;
      const transformedString = pipe.transform(string);

      expect(transformedString).toBe(
        createCodeBlockHtmlString('javascript', 'console.log(a);')
      );

      expect(codeHighlightServiceMock.highlight).not.toHaveBeenCalled();
      expect(codeHighlightServiceMock.highlightAuto).toHaveBeenCalledWith(
        'console.log(a);'
      );
    });

    it('should automatically transform code blocks with no language hint', () => {
      const string = `\`\`\` console.log(a);\`\`\``;
      const transformedString = pipe.transform(string);

      expect(transformedString).toBe(
        createCodeBlockHtmlString('javascript', 'console.log(a);')
      );

      expect(codeHighlightServiceMock.highlight).not.toHaveBeenCalled();
      expect(codeHighlightServiceMock.highlightAuto).toHaveBeenCalledWith(
        'console.log(a);'
      );
    });

    it('should transform multiple code blocks with different languages and fence styles', () => {
      const string =
        '```javascript function (bar) { console.log(`${bar}`); }```\n' +
        "```php <?php echo 'hello world' ?> ```\n" +
        '\n' +
        '```javascript\n' +
        'function (bar) {\n' +
        '  console.log(`${bar}`);\n' +
        '}\n' +
        '```';
      const transformedString = pipe.transform(string);

      expect(transformedString).toBe(
        createCodeBlockHtmlString(
          'javascript',
          'function (bar) { console.log(`${bar}`); }'
        ) +
          '\n' +
          createCodeBlockHtmlString('php', "<?php echo 'hello world' ?> ") +
          '\n' +
          '\n' +
          createCodeBlockHtmlString(
            'javascript',
            'function (bar) {\n  console.log(`${bar}`);\n}\n'
          )
      );
    });
  });
});
