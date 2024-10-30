import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

/**
 * Injects custom elements into the document head.
 */
@Injectable({ providedIn: 'root' })
export class HeadElementInjectorService {
  /** The id of the custom injected elements. */
  private readonly customElementId: string = 'customInjectedHeadElement';

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  /**
   * Injects custom elements into the document head, from a string of HTML.
   * @param { string } elementsText - The custom elements to inject into the head, as text. e.g. '<script>...</script>'.
   * @param { boolean } clearExisting - Whether to clear existing custom injected elements first.
   * @returns { this }
   */
  public injectFromString(
    elementsText: string,
    clearExisting: boolean = true
  ): this {
    if (clearExisting) {
      this.removeAll();
    }

    if (!elementsText?.length) {
      return this;
    }

    // Create a temporary container to create the elements from the given string.
    const container: HTMLDivElement = this.document.createElement('div');
    try {
      container.innerHTML = elementsText;
    } catch (e) {
      console.error('Error injecting elements', e);
    }

    // Iterate over each element in the container.
    for (const element of Array.from(container.children)) {
      try {
        if (element.tagName === 'SCRIPT') {
          const scriptElement: HTMLScriptElement =
            this.document.createElement('script');

          scriptElement.id = this.customElementId;
          scriptElement.type =
            element.getAttribute('type') ?? 'text/javascript';

          if (element.hasAttribute('src')) {
            scriptElement.src = element.getAttribute('src') ?? '';
          }

          if (element?.textContent?.length) {
            scriptElement.text = element.textContent ?? '';
          }

          this.document.head.appendChild(scriptElement);
        } else {
          const clone: Node = element.cloneNode(true);
          if (clone instanceof HTMLElement) {
            clone.id = this.customElementId;
            this.document.head.appendChild(clone);
          }
        }
      } catch (e) {
        console.error('Error injecting element', e);
      }
    }

    return this;
  }

  /**
   * Removes any previously injected custom elements.
   * @returns { this }
   */
  public removeAll(): this {
    const elements: Element[] = Array.from(
      this.document.head.querySelectorAll(`#${this.customElementId}`) ?? []
    );
    for (const element of elements) {
      element?.parentNode?.removeChild(element);
    }
    return this;
  }
}
