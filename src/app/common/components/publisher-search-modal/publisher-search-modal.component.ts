import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  SkipSelf,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

export type PublisherType = 'user' | 'group';

/**
 * NO-OP
 */
const noOp = () => {};

/**
 * Modal used to input a search query on a channel or group page
 *
 * When a query is entered, the channel/group page is filtered to show relevant content
 */
@Component({
  selector: 'm-publisherSearchModal',
  templateUrl: './publisher-search-modal.component.html',
  styleUrls: ['./publisher-search-modal.component.ng.scss'],
})
export class PublisherSearchModalComponent implements OnInit {
  /**
   *
   */
  onSearchIntent: (any: any) => void = noOp;

  /**
   *
   */
  onDismissIntent: () => void = noOp;

  publisher: any;

  q: string;
  placeholder: string;

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.updatePlaceholder();
  }

  ngAfterViewInit(): void {
    this.setFocus();
  }

  /**
   * @param publisher
   * @param onSearch
   * @param onDismissIntent
   */
  setModalData({ publisher, onSearch, onDismissIntent }) {
    this.publisher = publisher;
    this.onSearchIntent = onSearch || noOp;
    this.onDismissIntent = onDismissIntent || noOp;
  }

  onSearch(): void {
    if (!this.q) {
      return;
    }

    this.onSearchIntent(this.q);
    this.onDismissIntent();
  }

  /**
   * Calls DismissIntent.
   */
  onDismiss(): void {
    this.onDismissIntent();
  }

  setFocus() {
    if (this.searchInput.nativeElement) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 1);
    }
  }

  @HostListener('keyup', ['$event'])
  keyup(e) {
    if (e.keyCode === 13) {
      this.onSearch();
    }
  }

  @HostListener('window:resize')
  onResize(e: Event) {
    this.updatePlaceholder();
  }

  updatePlaceholder(): void {
    this.placeholder = $localize`:@@COMMON__SEARCH__SHORT:Search`;

    if (window.innerWidth >= 500) {
      if (this.type === 'user') {
        this.placeholder += ` @${this.publisher.username}'s channel`;
      } else {
        this.placeholder += ` ${this.publisher.name}`;
      }
    }
  }

  get type(): PublisherType {
    return this.publisher.type;
  }
}
