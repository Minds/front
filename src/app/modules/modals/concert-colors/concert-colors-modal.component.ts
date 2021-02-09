import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'm-concertColors__modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'concert-colors-modal.component.html',
  styleUrls: ['./concert-colors-modal.component.ng.scss'],
})
export class ConcertColorsModalComponent {
  @Input() title: string;
}
