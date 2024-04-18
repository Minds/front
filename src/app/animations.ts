import {
  trigger,
  style,
  animate,
  transition,
  keyframes,
  state,
  AnimationTriggerMetadata,
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

/**
 * Fades in along with moving 5px from top or bottom
 * depending on direction, when counter changes.
 */
export const CounterChangeFadeIn = trigger('counterChange', [
  transition(':increment', [
    animate(
      300,
      keyframes([
        style({ opacity: 0, transform: 'translateY(5px)', offset: 0 }),
        style({ opacity: 1, transform: 'translateY(0px)', offset: 1 }),
      ])
    ),
  ]),
  transition(':decrement', [
    animate(
      300,
      keyframes([
        style({ opacity: 0, transform: 'translateY(-5px)', offset: 0 }),
        style({ opacity: 1, transform: 'translateY(0px)', offset: 1 }),
      ])
    ),
  ]),
  transition(':enter', [
    animate(
      300,
      keyframes([
        style({ opacity: 0, transform: 'translateY(5px)', offset: 0 }),
        style({ opacity: 1, transform: 'translateY(0px)', offset: 1 }),
      ])
    ),
  ]),
  transition(':leave', [
    animate(
      200,
      keyframes([
        style({ opacity: 1, transform: 'translateY(0px)', offset: 0 }),
        style({ opacity: 0, transform: 'translateY(-5px)', offset: 1 }),
      ])
    ),
  ]),
]);

/**
 * Grows and shrinks smoothly on enter and leave.
 */
export const GrowShrinkFast: AnimationTriggerMetadata = trigger('growShrink', [
  state('in', style({ height: '*', opacity: 1, margin: '*' })),
  transition(':enter', [
    style({ height: '0px', opacity: 0, margin: 0 }),
    animate(
      '0.3s cubic-bezier(0.24, 1, 0.32, 1)',
      style({ height: '*', opacity: 1, margin: '*' })
    ),
  ]),
  transition(':leave', [
    animate(
      '0.3s cubic-bezier(0.24, 1, 0.32, 1)',
      style({ height: '0px', opacity: 0, margin: 0 })
    ),
  ]),
]);

/**
 * Grows and shrinks smoothly on enter and leave without a horizontal margin shift.
 */
export const GrowShrinkFastNoMarginShift: AnimationTriggerMetadata = trigger(
  'growShrinkNoMarginShift',
  [
    state(
      'in',
      style({ height: '*', opacity: 1, marginTop: '*', marginBottom: '*' })
    ),
    transition(':enter', [
      style({ height: '0px', opacity: 0, marginTop: 0, marginBottom: 0 }),
      animate(
        '0.3s cubic-bezier(0.24, 1, 0.32, 1)',
        style({ height: '*', opacity: 1, marginTop: '*', marginBottom: '*' })
      ),
    ]),
    transition(':leave', [
      animate(
        '0.3s cubic-bezier(0.24, 1, 0.32, 1)',
        style({ height: '0px', opacity: 0, marginTop: 0, marginBottom: 0 })
      ),
    ]),
  ]
);
