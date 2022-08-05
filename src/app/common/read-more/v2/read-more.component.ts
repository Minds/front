import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'm-readMore',
  templateUrl: './read-more.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./read-more.component.ng.scss'],
})
export class ReadMoreComponent {
  /**
   * The raw input text
   */
  @Input() text: string = '';

  /**
   * The length at which the truncation should kick in.
   * NOTE: we add a buffer to this to avoid outputs that are too close
   * to the threshold having minimal or wasted impact
   */
  @Input() targetLength: number = 280;

  /**
   * The absolute max that should be truncated. This is to avoid long words bypassing our limit
   */
  protected readonly absoluteMax: number = 1000;

  /**
   * Controls if the read more should be toggled off. False shows ellipses
   */
  @Input()
  showAll = false;

  /**
   * emits changes to showAll
   */
  @Output()
  showAllChanged = new EventEmitter();

  constructor(private cd: ChangeDetectorRef) {}

  /**
   * The transformed text that the html template will render
   */
  get outputText(): string {
    if (this.showAll || !this.shouldTruncate) {
      return this.text;
    }
    return (
      this.text.substring(
        0,
        Math.min(
          this.text.lastIndexOf(' ', this.targetLength),
          this.absoluteMax
        )
      ) + '...'
    );
  }

  /**
   * Logic for if any truncation should happen
   * 'Show more' button will also not show if this is false
   */
  get shouldTruncate(): boolean {
    return this.text.length >= this.targetLength * 2;
  }
  /**
   * The 'See more' and 'See less' cta will call this
   * It will control the outputText
   */
  toggle(): void {
    this.showAll = !this.showAll;
    this.showAllChanged.emit(this.showAll);

    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
