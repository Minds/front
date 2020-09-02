import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'm-loadingEllipsis',
  templateUrl: './loading-ellipsis.component.html',
  styleUrls: ['./loading-ellipsis.component.ng.scss'],
})
export class LoadingEllipsisComponent {
  @Input() inProgress: boolean = true;
  @Input() dotDiameter: string = '8px';
}
