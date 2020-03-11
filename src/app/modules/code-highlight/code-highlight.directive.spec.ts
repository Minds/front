import { Component, DebugElement, Provider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CodeHighlightDirective } from './code-highlight.directive';
import { CodeHighlightService } from './code-highlight.service';
import { codeHighlightServiceMock } from '../../mocks/modules/code-highlight/code-highlight-service.mock';
import { FeaturesService } from '../../services/features.service';
import { MockService } from '../../utils/mock';
import { featuresServiceMock } from '../../../tests/features-service-mock.spec';

@Component({
  template: `
  <div m-code-highlight>
    <div class="${CodeHighlightService.moduleWrapperClass}" data-language="javascript">
      console.log('foo');
    </div>
    <div class="${CodeHighlightService.moduleWrapperClass}" data-language="php">
      <?php echo '<p>Hello World</p>'; ?>
    </div>
    <div class="${CodeHighlightService.moduleWrapperClass}" data-language="auto">
      console.log('foo');
    </div>
    <div class="${CodeHighlightService.moduleWrapperClass}">
      console.log('foo');
    </div>
    <div>
      console.log('foo');
    </div>
    <pre><code class="language-javascript">console.log('foo');</code></pre>
    <pre><code class="language-php">echo 'hi';</code></pre>
  </div>
  `,
})
class MockComponent {}

describe('CodeHighlightDirective', () => {
  let fixture: ComponentFixture<MockComponent>;
  let directiveElement: DebugElement;
  let moduleWrappers: DebugElement[];

  const createComponent = (providers: Provider[] = []) => {
    fixture = TestBed.configureTestingModule({
      declarations: [CodeHighlightDirective, MockComponent],
      providers: [
        { provide: CodeHighlightService, useValue: codeHighlightServiceMock },
        ...providers,
      ],
    }).createComponent(MockComponent);

    fixture.detectChanges();
  };

  describe('when feature enabled', () => {
    beforeEach(() => {
      featuresServiceMock.mock('code-highlight', true);

      createComponent([
        { provide: FeaturesService, useValue: featuresServiceMock },
      ]);

      directiveElement = fixture.debugElement.query(
        By.directive(CodeHighlightDirective)
      );
      moduleWrappers = directiveElement.queryAll(
        By.css(`div.${CodeHighlightService.moduleWrapperClass}`)
      );
    });

    afterEach(() => {
      codeHighlightServiceMock.reset();
    });

    it('should highlight code blocks', () => {
      const moduleWrapper = moduleWrappers[0].nativeElement;
      const pre = moduleWrapper.children[0];

      expect(pre.tagName.toLowerCase()).toBe('pre');
      expect(pre.children.length).toBe(1);

      const code = pre.children[0];

      expect(code.tagName.toLowerCase()).toBe('code');
      expect(code.classList).toContain('language-javascript');

      expect(codeHighlightServiceMock.highlightBlock).toHaveBeenCalledWith(
        moduleWrapper
      );
    });

    it('should highlight multiple child code blocks with different languages', () => {
      const moduleWrapper = moduleWrappers[1].nativeElement;
      const pre = moduleWrapper.children[0];
      const code = pre.children[0];

      expect(code.classList).toContain('language-php');

      expect(codeHighlightServiceMock.highlightBlock).toHaveBeenCalledWith(
        moduleWrapper
      );
    });

    it('should automatically highlight when language hint is set to auto', () => {
      const moduleWrapper = moduleWrappers[2].nativeElement;
      const pre = moduleWrapper.children[0];
      const code = pre.children[0];

      expect(code.classList.length).toBe(0);

      expect(codeHighlightServiceMock.highlightBlock).toHaveBeenCalledWith(
        moduleWrapper
      );
    });

    it('should automatically highlight when no language hint is present', () => {
      const moduleWrapper = moduleWrappers[3].nativeElement;
      const pre = moduleWrapper.children[0];
      const code = pre.children[0];

      expect(code.classList.length).toBe(0);

      expect(codeHighlightServiceMock.highlightBlock).toHaveBeenCalledWith(
        moduleWrapper
      );
    });

    it('should not highlight text as code when no module wrapper class is present', () => {
      const bareWrapper = directiveElement.query(
        By.css(`div:not(.${CodeHighlightService.moduleWrapperClass})`)
      ).nativeElement;

      expect(bareWrapper.children.length).toBe(0);

      expect(codeHighlightServiceMock.highlightBlock).not.toHaveBeenCalledWith(
        bareWrapper
      );
    });

    it('should also highlight unwrapped code blocks', () => {
      const pre = directiveElement.queryAll(By.css(`pre`));

      expect(codeHighlightServiceMock.highlightBlock).toHaveBeenCalledWith(
        pre[0].nativeElement
      );
      expect(codeHighlightServiceMock.highlightBlock).toHaveBeenCalledWith(
        pre[1].nativeElement
      );
    });
  });

  describe('when feature disabled', () => {
    beforeEach(() => {
      featuresServiceMock.mock('code-highlight', false);

      createComponent([
        { provide: FeaturesService, useValue: featuresServiceMock },
      ]);

      directiveElement = fixture.debugElement.query(
        By.directive(CodeHighlightDirective)
      );
      moduleWrappers = directiveElement.queryAll(
        By.css(`div.${CodeHighlightService.moduleWrapperClass}`)
      );
    });

    afterEach(() => {
      codeHighlightServiceMock.reset();
    });

    it("shouldn't highlight when feature is disabled", () => {
      const moduleWrapper = moduleWrappers[0].nativeElement;

      expect(moduleWrapper.children.length).toBe(0);
    });
  });
});
