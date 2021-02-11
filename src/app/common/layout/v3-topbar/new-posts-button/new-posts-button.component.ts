import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
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
export class NewPostsButtonComponent implements OnInit {
  scrollInProgress: boolean = false;
  active: boolean = false;

  constructor(public service: NewPostsService) {}

  ngOnInit(): void {
    this.service.newPostsAvailable$.subscribe(newPostsAvailable => {
      console.log('ojm active?', newPostsAvailable);
      this.active = newPostsAvailable;

      //ojm figure out how to prevent showing this if they're already at the top of the feed
    });
  }

  scrollToNewPosts(event: MouseEvent): void {
    if (this.scrollInProgress) return;

    this.scrollInProgress = true;
    //ojm todo scroll?

    this.service.newPostsAvailable$.next(false);
    this.scrollInProgress = false;
  }
}
