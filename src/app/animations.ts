import {
  trigger,
  style,
  animate,
  transition,
  keyframes,
  state,
} from '@angular/animations';

export const animations: any[] = [
  trigger('foolishIn', [
    transition('* => *', [
      style({ opacity: 0 }),
      animate(
        2000,
        keyframes([
          style({
            opacity: 0,
            transformOrigin: '50% 50%',
            transform: 'scale(0, 0)     rotate(360deg)',
            offset: 0.0,
          }),
          style({
            opacity: 1,
            transformOrigin: '0% 100%',
            transform: 'scale(0.5, 0.5) rotate(0deg)',
            offset: 0.066,
          }),
          style({
            opacity: 1,
            transformOrigin: '100% 100%',
            transform: 'scale(0.5, 0.5) rotate(0deg)',
            offset: 0.132,
          }),
          style({
            opacity: 1,
            transformOrigin: '0%',
            transform: 'scale(0.5, 0.5) rotate(0deg)',
            offset: 0.198,
          }),
          style({
            opacity: 1,
            transformOrigin: '0% 0%',
            transform: 'scale(0.5, 0.5) rotate(0deg)',
            offset: 0.264,
          }),
          style({
            opacity: 1,
            transformOrigin: '50% 50%',
            transform: 'scale(1, 1)     rotate(0deg)',
            offset: 0.33,
          }),
          style({ opacity: 1, offset: 0.66 }),
          style({ opacity: 0, offset: 1.0 }),
        ])
      ),
    ]),
  ]),
];

export const FastFadeAnimation = trigger('fastFade', [
  transition(':enter', [
    animate('200ms', keyframes([style({ opacity: 0 }), style({ opacity: 1 })])),
  ]),
  transition(':leave', [
    animate('100ms', keyframes([style({ opacity: 1 }), style({ opacity: 0 })])),
  ]),
]);

export const MediumFadeAnimation = trigger('mediumFade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
]);

export const SlowFadeAnimation = trigger('slowFade', [
  state(
    'in',
    style({
      opacity: 1,
    })
  ),
  state(
    'out',
    style({
      opacity: 0,
    })
  ),
  transition('out => in', [animate('600ms')]),
  transition('in => out', [animate('0ms')]),
]);

// Note: must be used with `overflow: hidden`
export const DropDownAnimation = trigger('dropDown', [
  transition(':enter', [
    style({ opacity: 0, height: 0 }),
    animate('100ms ease-out', style({ opacity: 1, height: '*' })),
  ]),
  transition(
    ':leave',
    animate('100ms ease-out', style({ height: 0, opacity: 0 }))
  ),
]);
