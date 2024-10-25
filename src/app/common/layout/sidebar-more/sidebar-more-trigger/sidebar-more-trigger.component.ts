import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { NgxPopperjsContentComponent } from 'ngx-popperjs';
import { Session } from '../../../../services/session';
import { IsTenantService } from '../../../services/is-tenant.service';

@Component({
  selector: 'm-sidebarMore__trigger',
  templateUrl: './sidebar-more-trigger.component.html',
  styleUrls: ['./sidebar-more-trigger.component.ng.scss'],
})
export class SidebarMoreTriggerComponent implements AfterViewInit {
  @Output('toggle') onToggle: EventEmitter<Boolean> =
    new EventEmitter<Boolean>();

  popperPlacement: string = 'auto';

  @ViewChild('popper') popper: NgxPopperjsContentComponent;

  shown: boolean = false;

  constructor(
    public session: Session,
    protected isTenant: IsTenantService
  ) {}

  ngAfterViewInit(): void {}

  popperOnShown($event): void {
    this.show(true);
  }
  popperOnHide($event): void {
    this.show(false);
  }

  clickPopperContent($event) {
    // Don't hide popper if clicking 'more'/'less' footer links toggle
    if (
      $event.srcElement.classList[0] !== 'm-sidebarMoreDropdownFooter__toggle'
    ) {
      this.popper.hide();
      this.shown = false;
    }
  }

  show(isShown: boolean): void {
    this.shown = isShown;
    this.onToggle.emit(this.shown);
  }
}
