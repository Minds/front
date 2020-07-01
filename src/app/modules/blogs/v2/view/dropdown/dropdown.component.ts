import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Session } from '../../../../../services/session';

export type BlogViewMenuOption =
  | 'subscribe'
  | 'report'
  | 'follow'
  | 'edit'
  | 'allow-comments'
  | 'feature'
  | 'delete';

/**
 * Blog dropdown menu for v2 view
 */
@Component({
  selector: 'm-blogView__dropdown',
  host: {
    class: 'm-blog',
  },
  template: `
    <m-postMenu--v2
      [entity]="blog"
      [options]="menuOptions"
      (optionSelected)="onOptionSelected($event)"
    >
      <ng-container post-menu
        ><ng-content select="[post-menu]"></ng-content
      ></ng-container>
    </m-postMenu--v2>
  `,
  providers: [],
})
export class BlogViewDropdownComponent {
  @Input() blog: any;
  @Output() optionSelected = new EventEmitter<BlogViewMenuOption>();

  constructor(public session: Session) {}

  get isOwner(): boolean {
    if (this.blog) {
      return this.blog.ownerObj.guid === this.session.getLoggedInUser().guid;
    }
    return false;
  }

  public onOptionSelected(option: BlogViewMenuOption): void {
    this.optionSelected.emit(option);
  }

  menuOptions: Array<string> = [
    'edit',
    'follow',
    'feature',
    'delete',
    'report',
    'subscribe',
    'set-explicit',
    'remove-explicit',
    'rating',
    'allow-comments',
  ];
}
