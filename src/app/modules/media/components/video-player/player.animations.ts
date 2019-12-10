import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

export const PLAYER_ANIMATIONS = [
  trigger('fadeAnimation', [
    state(
      'in',
      style({
        visibility: 'visible',
        opacity: 1,
      })
    ),
    state(
      'out',
      style({
        visibility: 'hidden',
        opacity: 0,
      })
    ),
    transition('in <=> out', [animate('300ms ease-in')]),
  ]),
];
