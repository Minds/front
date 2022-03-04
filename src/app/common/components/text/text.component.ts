import { Component, Input, OnInit } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

enum MindsTextElementType {
  span = 'span',
  p = 'p',
  h1 = 'h1',
  h2 = 'h2',
  h3 = 'h3',
  h4 = 'h4',
}

/**
 * Base text component
 *
 * example: <m-text h1 primary>
 */
@Component({
  selector: 'm-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class MindsTextComponent implements OnInit {
  // ==================| COLORS |=====================>
  @Input() primary: boolean = true;
  @Input() secondary: boolean;
  @Input() danger: boolean;

  // ==================| HTML ELEMENT |=====================>
  /**
   * the html element to render.
   * by default it depends on text Type (below).
   * otherwise defaults to span.
   */
  @Input() element: MindsTextElementType;

  // ==================| TYPE |=====================>
  @Input() b1: boolean;
  @Input() b2: boolean;
  @Input() b3: boolean;
  @Input() h1: boolean;
  @Input() h2: boolean;
  @Input() h3: boolean;
  @Input() h4: boolean;
  @Input() xl1: boolean;
  @Input() xl2: boolean;
  @Input() xl3: boolean;

  // ==================| WEIGHTS |=====================>
  @Input() regular: boolean = true;
  @Input() thin: boolean;
  @Input() medium: boolean;
  @Input() bold: boolean;
  @Input() black: boolean;

  constructor() {}

  get defaultElementType() {
    if (this.element) return this.element;

    if (coerceBooleanProperty(this.b1)) return MindsTextElementType.span;
    if (coerceBooleanProperty(this.b2)) return MindsTextElementType.span;
    if (coerceBooleanProperty(this.b3)) return MindsTextElementType.span;
    if (coerceBooleanProperty(this.h1)) return MindsTextElementType.h1;
    if (coerceBooleanProperty(this.h2)) return MindsTextElementType.h2;
    if (coerceBooleanProperty(this.h3)) return MindsTextElementType.h3;
    if (coerceBooleanProperty(this.h4)) return MindsTextElementType.h4;
    if (coerceBooleanProperty(this.xl1)) return MindsTextElementType.h1;
    if (coerceBooleanProperty(this.xl2)) return MindsTextElementType.h1;
    if (coerceBooleanProperty(this.xl3)) return MindsTextElementType.h1;

    return MindsTextElementType.span;
  }

  ngOnInit(): void {
    this.element = this.defaultElementType;
  }

  getClass() {
    // TODO
    return {
      'm-text---primary': this.primary,
      'm-text---secondary': this.secondary,
      'm-text---danger': this.danger,
    };
  }
}
