import { CodeHighlightPipe } from './code-highlight.pipe';
import { CodeHighlightService } from './code-highlight.service';
import { codeHighlightServiceMock } from '../../mocks/modules/code-highlight/code-highlight-service.mock';
import { featuresServiceMock } from '../../../tests/features-service-mock.spec';

describe('CodeHighlightPipe', () => {
  let pipe;

  const setup = featureEnabled => {
    featuresServiceMock.mock('code-highlight', featureEnabled);
    pipe = new CodeHighlightPipe(codeHighlightServiceMock, featuresServiceMock);
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
        `<div class="${CodeHighlightService.moduleWrapperClass}"><pre><code class="language-javascript">console.log(a);</code></pre></div>`
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
        `<div class="${CodeHighlightService.moduleWrapperClass}"><pre><code class="language-javascript">console.log(a);</code></pre></div>`
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
        `<div class="${CodeHighlightService.moduleWrapperClass}"><pre><code class="language-javascript">console.log(a);</code></pre></div>`
      );

      expect(codeHighlightServiceMock.highlight).not.toHaveBeenCalled();
      expect(codeHighlightServiceMock.highlightAuto).toHaveBeenCalledWith(
        'console.log(a);'
      );
    });
  });

  describe('when feature is disabled', () => {
    beforeEach(() => {
      setup(false);
    });

    afterEach(() => {
      codeHighlightServiceMock.reset();
    });

    it('should not transform', () => {
      const string = `\`\`\` console.log(a);\`\`\``;
      const transformedString = pipe.transform(string);

      expect(transformedString).toBe(string);
    });
  });
});
