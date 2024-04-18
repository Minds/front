import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';

/**
 * The dropdown menu that appears with
 * autocomplete suggestions of users or hashtags,
 * based on what the user has typed already
 */
@Component({
  selector: 'm-text-input--autocomplete-menu',
  templateUrl: 'text-input-autocomplete-menu.component.html',
})
export class TextInputAutocompleteMenuComponent implements OnInit {
  @ViewChild('dropdownMenu', { static: true })
  dropdownMenuElement: ElementRef<HTMLUListElement>;
  @ViewChild('defaultItemTemplate', { static: true }) defaultItemTemplate;
  itemTemplate: any;
  position: { top: number; left: number };
  selectChoice = new Subject();
  activeChoice: any;
  searchText: string;
  choiceLoadError: any;
  choiceLoading = false;
  private _choices: any[];
  trackById = (index: number, choice: any) =>
    typeof choice.id !== 'undefined' ? choice.id : choice;

  set choices(choices: any[]) {
    this._choices = choices;
    if (choices.indexOf(this.activeChoice) === -1 && choices.length > 0) {
      this.activeChoice = choices[0];
    }
  }

  get choices() {
    return this._choices;
  }

  ngOnInit() {
    if (!this.itemTemplate) {
      this.itemTemplate = this.defaultItemTemplate;
    }
  }

  @HostListener('document:keydown.ArrowDown', ['$event'])
  onArrowDown(event: KeyboardEvent) {
    event.preventDefault();
    const index = this.choices.indexOf(this.activeChoice);
    if (this.choices[index + 1]) {
      this.scrollToChoice(index + 1);
    }
  }

  @HostListener('document:keydown.ArrowUp', ['$event'])
  onArrowUp(event: KeyboardEvent) {
    event.preventDefault();
    const index = this.choices.indexOf(this.activeChoice);
    if (this.choices[index - 1]) {
      this.scrollToChoice(index - 1);
    }
  }

  @HostListener('document:keydown.Enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    if (this.choices.indexOf(this.activeChoice) > -1) {
      event.preventDefault();
      this.selectChoice.next(this.activeChoice);
    }
  }

  private scrollToChoice(index: number) {
    this.activeChoice = this._choices[index];
    if (this.dropdownMenuElement) {
      const ulPosition =
        this.dropdownMenuElement.nativeElement.getBoundingClientRect();
      const li = this.dropdownMenuElement.nativeElement.children[index];
      const liPosition = li.getBoundingClientRect();
      if (liPosition.top < ulPosition.top) {
        li.scrollIntoView();
      } else if (liPosition.bottom > ulPosition.bottom) {
        li.scrollIntoView(false);
      }
    }
  }
}
