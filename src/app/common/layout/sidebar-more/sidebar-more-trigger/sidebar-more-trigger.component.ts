import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Session } from '../../../../services/session';
import { IsTenantService } from '../../../services/is-tenant.service';
import { NgxFloatUiContentComponent } from 'ngx-float-ui';

@Component({
  selector: 'm-sidebarMore__trigger',
  templateUrl: './sidebar-more-trigger.component.html',
  styleUrls: ['./sidebar-more-trigger.component.ng.scss'],
})
export class SidebarMoreTriggerComponent implements AfterViewInit {
  @Output('toggle') onToggle: EventEmitter<Boolean> =
    new EventEmitter<Boolean>();

  floatUiPlacement: string = 'auto';

  @ViewChild('floatUi') floatUi: NgxFloatUiContentComponent;

  shown: boolean = false;

  constructor(
    public session: Session,
    protected isTenant: IsTenantService
  ) {}

  ngAfterViewInit(): void {}

  floatUiOnShown($event): void {
    this.show(true);
  }
  floatUiOnHide($event): void {
    this.show(false);
  }

  clickFloatUiContent($event) {
    // Don't hide float-ui if clicking 'more'/'less' footer links toggle
    if (
      $event.srcElement.classList[0] !== 'm-sidebarMoreDropdownFooter__toggle'
    ) {
      this.floatUi.hide();
      this.shown = false;
    }
  }

  show(isShown: boolean): void {
    this.shown = isShown;
    this.onToggle.emit(this.shown);
  }
}
