import { CodeHighlightPipe } from './code-highlight.pipe';
import { CodeHighlightService } from './code-highlight.service';

describe('CodeHighlightPipe', () => {
  const codeHighlightService: CodeHighlightService = new CodeHighlightService();
  let pipe;

  beforeEach(() => {
    spyOn(codeHighlightService, 'highlight').and.callFake((lang, code) => {
      return code;
    });
    pipe = new CodeHighlightPipe(codeHighlightService);
  });

  it('should transform code blocks into highlighted code blocks', () => {
    const string = `\`\`\`javascript function (a) { console.log(a) }\`\`\``;
    const transformedString = pipe.transform(string);
    expect(transformedString).toContain(
      `<pre><code class="javascript"> function (a) { console.log(a) }</code></pre>`
    );
  });

  it('should transform code blocks in blog posts', () => {
    const string = `<?xml encoding="utf-8" ?><p>\`\`\`javascript</p><p>function lol() {</p><p>console.log('lol')</p><p>}</p><p>\`\`\`</p>`;
    const transformedString = pipe.transform(string);
    expect(transformedString).toContain(
      `<pre><code class="javascript">function lol() { console.log('lol') }</code></pre>`
    );
  });
});
