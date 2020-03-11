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
      Some other text
      <pre><code class="language-javascript">console.log('foo');</code></pre>
      <pre><code class="language-php">echo 'hi';</code></pre>
    </div>
  `,
})
class MockComponent {}

describe('CodeHighlightDirective', () => {
  let fixture: ComponentFixture<MockComponent>;
  let directiveElement: DebugElement;

  const createComponent = (providers: Provider[] = []) => {
    fixture = TestBed.configureTestingModule({
      declarations: [CodeHighlightDirective, MockComponent],
      providers: [
        { provide: CodeHighlightService, useValue: codeHighlightServiceMock },
        ...providers,
      ],
    }).createComponent(MockComponent);

    fixture.detectChanges();

    directiveElement = fixture.debugElement.query(
      By.directive(CodeHighlightDirective)
    );
  };

  describe('when feature enabled', () => {
    beforeEach(() => {
      featuresServiceMock.mock('code-highlight', true);

      createComponent([
        { provide: FeaturesService, useValue: featuresServiceMock },
      ]);
    });

    afterEach(() => {
      codeHighlightServiceMock.reset();
    });

    it('should highlight code blocks', () => {
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
    });

    afterEach(() => {
      codeHighlightServiceMock.reset();
    });

    it("shouldn't highlight when feature is disabled", () => {
      const pre = directiveElement.queryAll(By.css(`pre`));

      expect(codeHighlightServiceMock.highlightBlock).not.toHaveBeenCalledWith(
        pre[0].nativeElement
      );
      expect(codeHighlightServiceMock.highlightBlock).not.toHaveBeenCalledWith(
        pre[1].nativeElement
      );
    });
  });
});
