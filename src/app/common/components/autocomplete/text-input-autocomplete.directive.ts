import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { TextInputAutocompleteMenuComponent } from './text-input-autocomplete-menu.component';
import { Subject } from 'rxjs';
import getCaretCoordinates from 'textarea-caret';
import { getContentEditableCaretCoordinates } from '../../../helpers/contenteditable-caret';

export interface ChoiceSelectedEvent {
  choice: any;
  insertedAt: {
    start: number;
    end: number;
  };
}

@Directive({
  selector:
    'minds-textarea[mTextInputAutocomplete],textarea[mTextInputAutocomplete],input[type="text"][mTextInputAutocomplete]',
})
export class TextInputAutocompleteDirective implements OnDestroy {
  triggerCharacter: string;
  /**
   * The character that will trigger the menu to appear
   */
  @Input() triggerCharacters = ['@'];

  /**
   * The regular expression that will match the search text after the trigger character
   */
  @Input() searchRegexp = /^\w*$/;

  /**
   * The menu component to show with available options.
   * You can extend the built in `TextInputAutocompleteMenuComponent` component to use a custom template
   */
  @Input() menuComponent = TextInputAutocompleteMenuComponent;

  @Input() itemTemplate: any;

  /**
   * Enables adjustments for scroll offset.
   */
  @Input() adjustForScrollOffset: boolean = false;

  /**
   * Called when the options menu is shown
   */
  @Output() menuShown = new EventEmitter();

  /**
   * Called when the options menu is hidden
   */
  @Output() menuHidden = new EventEmitter();

  /**
   * Called when a choice is selected
   */
  @Output() choiceSelected = new EventEmitter<ChoiceSelectedEvent>();

  /**
   * A function that accepts a search string and returns an array of choices. Can also return a promise.
   */
  @Input()
  findChoices: (
    searchText: string,
    triggerCharacter?: string
  ) => any[] | Promise<any[]>;

  /**
   * A function that formats the selected choice once selected.
   */
  @Input()
  getChoiceLabel: (choice: any, triggerCharacter?: any) => string = (choice) =>
    choice;

  /* tslint:disable member-ordering */
  private menu:
    | {
        component: ComponentRef<TextInputAutocompleteMenuComponent>;
        triggerCharacterPosition: number;
        lastCaretPosition?: number;
      }
    | undefined;

  private menuHidden$ = new Subject<any>();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector,
    private elm: ElementRef
  ) {}

  @HostListener('keypress', ['$event.key'])
  onKeypress(key: string) {
    const index: number = this.triggerCharacters.indexOf(key);
    if (index !== -1) {
      this.triggerCharacter = this.triggerCharacters[index];
      this.showMenu();
    }
  }

  @HostListener('input', ['$event'])
  onChange(event: any) {
    const value: string =
      event.target.value || event.target.innerText || event.target.textContent;

    if (this.menu) {
      if (
        this.triggerCharacters.indexOf(
          value[this.menu.triggerCharacterPosition]
        ) === -1
      ) {
        this.hideMenu();
      } else {
        const cursor = this.elm.nativeElement.selectionStart;
        if (cursor < this.menu.triggerCharacterPosition) {
          this.hideMenu();
        } else {
          const searchText = value.slice(
            this.menu.triggerCharacterPosition + 1,
            cursor
          );
          if (!searchText.match(this.searchRegexp)) {
            this.hideMenu();
          } else {
            this.menu.component.instance.searchText = searchText;
            this.menu.component.instance.choices = [];
            this.menu.component.instance.choiceLoadError = undefined;
            this.menu.component.instance.choiceLoading = true;
            this.menu.component.changeDetectorRef.detectChanges();
            Promise.resolve(this.findChoices(searchText, this.triggerCharacter))
              .then((choices) => {
                if (this.menu) {
                  this.menu.component.instance.choices = choices;
                  this.menu.component.instance.choiceLoading = false;
                  this.menu.component.changeDetectorRef.detectChanges();
                }
              })
              .catch((err) => {
                if (this.menu) {
                  this.menu.component.instance.choiceLoading = false;
                  this.menu.component.instance.choiceLoadError = err;
                  this.menu.component.changeDetectorRef.detectChanges();
                }
              });
          }
        }
      }
    }
  }

  @HostListener('blur')
  onBlur() {
    if (this.menu) {
      this.menu.lastCaretPosition = this.getTriggerCharPosition(
        this.elm.nativeElement
      );
    }
  }

  private getTriggerCharPosition(element) {
    if (
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLInputElement
    ) {
      return this.elm.nativeElement.selectionStart;
    } else {
      const coordinates = getContentEditableCaretCoordinates(element);

      if (coordinates && (coordinates.start || coordinates.start === 0)) {
        return coordinates.start;
      }
    }
  }

  private showMenu() {
    if (!this.menu) {
      const menuFactory =
        this.componentFactoryResolver.resolveComponentFactory<TextInputAutocompleteMenuComponent>(
          this.menuComponent
        );
      this.menu = {
        component: this.viewContainerRef.createComponent(
          menuFactory,
          0,
          this.injector
        ),
        triggerCharacterPosition: this.getTriggerCharPosition(
          this.elm.nativeElement
        ),
      };
      const lineHeight = +getComputedStyle(
        this.elm.nativeElement
      ).lineHeight!.replace(/px$/, '');

      let scrollOffsetTop = this.getScrollTopOffset(this.elm);

      const { top, left } =
        this.elm.nativeElement instanceof HTMLTextAreaElement
          ? <any>(
              getCaretCoordinates(
                this.elm.nativeElement,
                this.elm.nativeElement.selectionStart
              )
            )
          : getContentEditableCaretCoordinates(this.elm.nativeElement);
      this.menu.component.instance.itemTemplate = this.itemTemplate;
      this.menu.component.instance.position = {
        top: top + lineHeight - scrollOffsetTop,
        left,
      };
      this.menu.component.changeDetectorRef.detectChanges();
      this.menu.component.instance.selectChoice
        .pipe(takeUntil(this.menuHidden$))
        .subscribe((choice) => {
          const label = this.getChoiceLabel(choice, this.triggerCharacter);
          let element: any = this.elm.nativeElement;

          if (element.nodeName === 'MINDS-TEXTAREA') {
            element = element.firstChild;
          }
          let value: string;
          let selectionStart;
          if (element instanceof HTMLTextAreaElement) {
            value = element.value;
            selectionStart = element.selectionStart;
          } else {
            value = element.textContent;
            selectionStart = getContentEditableCaretCoordinates(element).start;
          }

          const startIndex = this.menu!.triggerCharacterPosition;

          const start = value.slice(0, startIndex);

          const caretPosition =
            this.menu!.lastCaretPosition || selectionStart || 0;

          const end = value.slice(caretPosition);

          value = start + label + end;

          if (element instanceof HTMLDivElement) {
            element.textContent = value;
          } else {
            element.value = value;
          }
          // force ng model / form control to update
          element.dispatchEvent(new Event('input'));
          this.hideMenu();
          const setCursorAt = (start + label).length;

          if (
            element instanceof HTMLTextAreaElement ||
            element instanceof HTMLInputElement
          ) {
            element.setSelectionRange(setCursorAt, setCursorAt);
          } else {
            const range = document.createRange();
            const sel = window.getSelection();

            range.setStart(element.firstChild, setCursorAt);
            range.setEnd(element.firstChild, setCursorAt);
            //range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }

          element.focus();

          this.choiceSelected.emit({
            choice,
            insertedAt: {
              start: startIndex,
              end: startIndex + label.length,
            },
          });
        });
      this.menuShown.emit();
    }
  }

  private hideMenu() {
    if (this.menu) {
      this.menu.component.destroy();
      this.menuHidden$.next(null);
      this.menuHidden.emit();
      this.menu = undefined;
    }
  }

  /**
   * Gets scroll offset for element if adjustForScrollOffset
   * is set. Else will return 0. Will prevent element from
   * being pushed offscreen from scroll.
   * @param { ElementRef } - DOM element.
   * @returns { number } - scrollTop offset.
   */
  private getScrollTopOffset(element: ElementRef): number {
    let scrollOffsetTop: number = 0;
    if (this.adjustForScrollOffset) {
      scrollOffsetTop = element.nativeElement.scrollTop;
    }
    return scrollOffsetTop;
  }

  ngOnDestroy() {
    this.hideMenu();
  }
}
