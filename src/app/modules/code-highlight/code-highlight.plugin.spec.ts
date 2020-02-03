import { CodeHighlightPlugin } from './code-highlight.plugin';
import { CodeHighlightService } from './code-highlight.service';

describe('CodeHighlightPlugin', () => {
  const codeHighlightService: CodeHighlightService = new CodeHighlightService();
  let plugin;

  beforeEach(() => {
    plugin = new CodeHighlightPlugin(codeHighlightService, {});
  });

  it('should remove extra newlines added from medium-editor when preparing code text', () => {
    const content = `function foo(bar) {\n\nconsole.log('bar', bar);\n\n}`;

    const preparedContent = plugin.prepareSelectionContent(content);
    expect(preparedContent).toBe(
      `function foo(bar) {\nconsole.log('bar', bar);\n}`
    );
  });
});
