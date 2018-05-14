import { trigger, style, animate, transition, keyframes } from '@angular/animations';

export const animations: any[] = [
  trigger('attentionNeeded', [
    transition('* => *', [
      style({ transform: 'perspective(1px) translateZ(0)', transformOrigin: '0 100%' }),
      animate(1000, keyframes([
        style({ transform: 'skew(0deg)',   offset: 0.0000 }),
        style({ transform: 'skew(-12deg)', offset: 0.1665 }),
        style({ transform: 'skew(10deg)',  offset: 0.3333 }),
        style({ transform: 'skew(-6deg)',  offset: 0.4995 }),
        style({ transform: 'skew(4deg)',   offset: 0.6666 }),
        style({ transform: 'skew(-2deg)',  offset: 0.8325 }),
        style({ transform: 'skew(0deg)',   offset: 1.0000 }),
      ]))
    ])
  ])
];
