import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'm-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.ng.scss'],
})
export class SliderComponent implements OnInit {
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() default: number;
  @Input() step: string; // size of each increment
  @Input() id: string;

  @Input() minLabel: string;
  @Input() maxLabel: string;

  @Input() emitOnLoad: boolean = false;

  value: number;
  @Output('onSlide') onSlideEmitter: EventEmitter<any> = new EventEmitter<
    any
  >();

  ngOnInit(): void {
    if (this.default) {
      this.value = this.default;
    } else {
      this.value = this.getHalfwayPoint();
    }

    if (this.emitOnLoad) {
      this.onSlide(this.value);
    }
  }

  onSlide(value: number): void {
    const obj = {
      value: value,
    };
    if (this.id) {
      obj['id'] = this.id;
    }
    this.onSlideEmitter.emit(obj);
  }

  getHalfwayPoint(): number {
    return this.max < this.min
      ? this.min
      : this.min + (this.max - this.min) / 2;
  }
}
