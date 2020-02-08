import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  CodeHighlightDirective,
  codeHighlightWrapperClass,
} from './code-highlight.directive';
import { CodeHighlightService } from './code-highlight.service';
import { codeHighlightServiceMock } from '../../mocks/modules/code-highlight/code-highlight-service.mock';

@Component({
  template: `
  <div m-code-highlight>
    <div class="${codeHighlightWrapperClass}" data-language="javascript">
      console.log('foo');
    </div>
    <div class="${codeHighlightWrapperClass}" data-language="php">
      <?php echo '<p>Hello World</p>'; ?>
    </div>
    <div class="${codeHighlightWrapperClass}" data-language="auto">
      console.log('foo');
    </div>
    <div class="${codeHighlightWrapperClass}">
      console.log('foo');
    </div>
    <div>
      console.log('foo');
    </div>
  </div>
  `,
})
class MockComponent {}

describe('CodeHighlightDirective', () => {
  let fixture: ComponentFixture<MockComponent>;
  let directiveElement: DebugElement;
  let moduleWrappers: DebugElement[];

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [CodeHighlightDirective, MockComponent],
      providers: [
        { provide: CodeHighlightService, useValue: codeHighlightServiceMock },
      ],
    }).createComponent(MockComponent);

    fixture.detectChanges();

    directiveElement = fixture.debugElement.query(
      By.directive(CodeHighlightDirective)
    );
    moduleWrappers = directiveElement.queryAll(
      By.css(`div.${codeHighlightWrapperClass}`)
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
      By.css(`div:not(.${codeHighlightWrapperClass})`)
    ).nativeElement;

    expect(bareWrapper.children.length).toBe(0);

    expect(codeHighlightServiceMock.highlightBlock).not.toHaveBeenCalledWith(
      bareWrapper
    );
  });
});
