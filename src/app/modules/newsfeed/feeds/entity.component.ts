import {
  Component,
  ComponentRef,
  ChangeDetectorRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';

import { GroupsTileComponent } from '../../groups/tile/tile.component';
import { DynamicHostDirective } from '../../../common/directives/dynamic-host.directive';

@Component({
  selector: 'm-newsfeed__entity',
  templateUrl: 'entity.component.html',
})
export class NewsfeedEntityComponent {
  @Output() deleted = new EventEmitter<any>();
  @ViewChild(DynamicHostDirective)
  host: DynamicHostDirective;
  entity;
  @Input() displayOptions = { isFeed: true };
  @Input() canDelete: boolean = null;

  constructor(protected cd: ChangeDetectorRef) {}

  @Input('entity') set setEntity(entity) {
    this.entity = entity;
    this.updateComponents();
  }

  // Return the component to use
  private getComponent(type: string) {
    return type === 'user' ? null : GroupsTileComponent;
  }

  @Input() slot: number;

  // Clear the view container
  clear() {
    this.cd.detectChanges();
    this.cd.markForCheck();
    if (this.host) this.host.viewContainerRef.clear();
  }

  // Update the component
  updateComponents() {
    if (this.entity && this.entity.type === 'group') {
      this.clear();

      let componentRef: ComponentRef<any> =
        this.host.viewContainerRef.createComponent(
          this.getComponent(this.entity.type)
        );
      componentRef.instance.entity = this.entity;
      componentRef.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Sets entity to null and by extension hides it.
   */
  delete(): void {
    this.deleted.emit(this.entity);
  }
}
