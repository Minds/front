import { Component, Input, HostBinding } from '@angular/core';
import { Session } from '../../../services/session';
import { Client } from '../../api/client.service';

export type SidebarWidgetBorderColor = 'default' | 'primary' | 'none';

@Component({
  selector: 'm-sidebarWidget',
  styleUrls: ['./sidebar-widget.component.ng.scss'],
  templateUrl: './sidebar-widget.component.html',
})
export class SidebarWidgetComponent {
  @Input() titleText: string;
  @Input() dismissibleId: string;

  /** Border color for widget. */
  @Input() public borderColor: SidebarWidgetBorderColor = 'default';

  /**
   * Whether the widget should have a background color
   */
  @Input() backgroundFill: boolean = true;

  @HostBinding('hidden') hidden: boolean = false;

  constructor(private session: Session, private client: Client) {}

  ngOnInit() {
    const user = this.session.getLoggedInUser();
    const dismissedWidgets = user ? user.dismissed_widgets : [];

    if (
      this.dismissibleId &&
      dismissedWidgets &&
      dismissedWidgets.indexOf(this.dismissibleId) > -1
    ) {
      this.hidden = true;
    }
  }

  onDismissClick(e: MouseEvent): void {
    this.hidden = true;
    this.client.put(`api/v3/dismissible-widgets/${this.dismissibleId}`);
  }
}
