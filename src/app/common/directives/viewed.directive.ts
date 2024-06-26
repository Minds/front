import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ActivityEntity } from '../../modules/newsfeed/activity/activity.service';
import { ElementVisibilityService } from './../services/element-visibility.service';

/**
 * Use to detect whether an element was viewed.
 * This merely simplifies the usage of ElementVisibilityService.
 */
@Directive({
  selector: '[mViewed]',
  providers: [ElementVisibilityService],
})
export class ViewedDirective implements AfterViewInit {
  @Output()
  public readonly mViewed = new EventEmitter<any>();

  constructor(
    private elementVisibilityService: ElementVisibilityService,
    private el: ElementRef
  ) {}

  ngAfterViewInit(): void {
    this.elementVisibilityService
      .setElementRef(this.el)
      .onView((entity: ActivityEntity) => this.mViewed.emit(entity));
  }
}
