import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'm-embedded-image',
  templateUrl: './embedded-image.component.html',
  styleUrls: ['./embedded-image.component.scss'],
})
export class EmbeddedImageComponent implements OnInit {
  @Input()
  entity: any; // TODO: type
  topVisible$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  get src() {
    return this.entity.thumbnail_src;
  }

  constructor() {}

  ngOnInit(): void {}

  mouseEnter() {
    this.topVisible$.next(true);
  }

  mouseLeave() {
    this.topVisible$.next(false);
  }
}
