import { Component, DebugElement, Provider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CodeHighlightDirective } from './code-highlight.directive';
import { CodeHighlightService } from './code-highlight.service';
import { codeHighlightServiceMock } from '../../mocks/modules/code-highlight/code-highlight-service.mock';

@Component({
  template: `
    <div m-code-highlight>
      Some other text
      <pre><code class="language-javascript">console.log('foo');</code></pre>
      <pre><code class="language-php">echo 'hi';</code></pre>
      <pre><div class="no-highlight">Should not highlight this</div></pre>
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
});
