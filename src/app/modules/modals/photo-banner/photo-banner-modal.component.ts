import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'm-photoBannerModal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'photo-banner-modal.component.html',
  styleUrls: ['./photo-banner-modal.component.ng.scss'],
})
export class PhotoBannerModalComponent {
  @Input() title: string;
}
