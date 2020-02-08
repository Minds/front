import { CodeHighlightPipe } from './code-highlight.pipe';
import { codeHighlightServiceMock } from '../../mocks/modules/code-highlight/code-highlight-service.mock';

describe('CodeHighlightPipe', () => {
  let pipe;

  beforeEach(() => {
    pipe = new CodeHighlightPipe(codeHighlightServiceMock);
  });

  afterEach(() => {
    codeHighlightServiceMock.reset();
  });

  it('should transform code blocks into highlighted code blocks', () => {
    const string = `\`\`\`javascript console.log(a);\`\`\``;
    const transformedString = pipe.transform(string);

    expect(transformedString).toContain(
      `<pre><code class="language-javascript">console.log(a);</code></pre>`
    );

    expect(codeHighlightServiceMock.highlight).toHaveBeenCalledWith(
      'javascript',
      'console.log(a);'
    );
  });

  it('should automatically transform code blocks when auto is the language hint', () => {
    const string = `\`\`\`auto console.log(a);\`\`\``;
    const transformedString = pipe.transform(string);

    expect(transformedString).toContain(
      `<pre><code class="language-javascript">console.log(a);</code></pre>`
    );

    expect(codeHighlightServiceMock.highlight).not.toHaveBeenCalled();
    expect(codeHighlightServiceMock.highlightAuto).toHaveBeenCalledWith(
      'console.log(a);'
    );
  });

  it('should automatically transform code blocks with no language hint', () => {
    const string = `\`\`\` console.log(a);\`\`\``;
    const transformedString = pipe.transform(string);

    expect(transformedString).toContain(
      `<pre><code class="language-javascript">console.log(a);</code></pre>`
    );

    expect(codeHighlightServiceMock.highlight).not.toHaveBeenCalled();
    expect(codeHighlightServiceMock.highlightAuto).toHaveBeenCalledWith(
      'console.log(a);'
    );
  });
});
