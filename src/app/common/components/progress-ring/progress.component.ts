import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'm-progressring',
  templateUrl: 'progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressRingComponent implements OnInit {
  progress: number = 0;
  width: number = 20;
  height: number = 20;
  radius: number = 10;

  @Input('progress') set _progress(value: number) {
    if (value < 101 && value > -1) {
      this.setProgress(value);
    }
  }

  @Input('size') set _size(value: { w: number; h: number; r: number }) {
    this.width = value.w;
    this.height = value.h;
    this.radius = value.r;
  }

  @Input() cx: number = 10;
  @Input() cy: number = 10;

  @ViewChild('circle', { static: true }) circle: ElementRef;
  private circumference;

  constructor() {}

  ngOnInit() {
    // this.r = this.circle.r.baseVal.value;
    this.circumference = this.radius * 2 * Math.PI;

    this.circle.nativeElement.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
    // this.circle.nativeElement.style.strokeDashoffset = `${this.circumference}`;

    // this.setProgress(this.progress);
  }

  setProgress(percent) {
    if (!this.circumference) {
      this.circumference = this.radius * 2 * Math.PI;
    }
    this.circle.nativeElement.style.strokeDashoffset =
      this.circumference - (percent / 100) * this.circumference; // calculate offset
  }
}
