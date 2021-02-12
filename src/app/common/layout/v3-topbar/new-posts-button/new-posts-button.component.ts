import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NewPostsService } from '../../../services/new-posts.service';

@Component({
  selector: 'm-newPostsButton',
  templateUrl: './new-posts-button.component.html',
  styleUrls: ['./new-posts-button.component.ng.scss'],
  animations: [
    trigger('slide', [
      state(
        'up',
        style({
          bottom: 0,
        })
      ),
      state(
        'down',
        style({
          bottom: '-40px',
        })
      ),
      transition('up => down', [animate('300ms')]),
      transition('down => up', [animate('150ms')]),
    ]),
  ],
})
export class NewPostsButtonComponent {
  scrollInProgress: boolean = false;
  newPostsAvailable: boolean = false;

  constructor(public service: NewPostsService) {}

  scrollToNewPosts(event: MouseEvent): void {
    if (this.scrollInProgress) return;

    this.scrollInProgress = true;

    // todo: switch to obs.pipe(skipWhile(val => val === false))
    this.service.showNewPostsIntent$.next(true);
    // reset intent directly afterwards
    this.service.showNewPostsIntent$.next(false);

    this.service.newPostsAvailable$.next(false);
    this.scrollInProgress = false;
  }
}
