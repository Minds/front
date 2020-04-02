import { Component, Input } from '@angular/core';

@Component({
  selector: 'm-sidebarWidget',
  templateUrl: './sidebar-widget.component.html',
})
export class SidebarWidgetComponent {
  @Input() title: string;
}
