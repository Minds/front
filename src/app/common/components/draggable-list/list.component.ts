import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { DndDropEvent, EffectAllowed } from 'ngx-drag-drop';

@Component({
  selector: 'm-draggable-list',
  template: `
    <ul
      dndDropzone
      [dndHorizontal]="false"
      [dndEffectAllowed]="dndEffectAllowed"
      (dndDrop)="onDrop($event)"
      class="m-draggableList__list"
    >
      <div
        class="dndPlaceholder"
        dndPlaceholderRef
        style="min-height:100px;border:1px dashed green;background-color:rgba(0, 0, 0, 0.1)"
      ></div>

      <li
        *ngFor="let item of data; let i = index; trackBy: trackByFunction"
        [dndDraggable]="item"
        [dndEffectAllowed]="'move'"
        class="m-draggableList__listItem"
      >
        <i class="handle material-icons" dndHandle>reorder</i>
        <ng-container
          [ngTemplateOutlet]="template"
          [ngTemplateOutletContext]="{ item: item, i: i }"
        ></ng-container>
      </li>
    </ul>
  `,
})
export class DraggableListComponent {
  @Input() data: Array<any>;
  @Input() dndEffectAllowed: EffectAllowed = 'copyMove';
  @Input() id: string;
  @ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;

  trackByFunction(index, item) {
    return this.id ? item[this.id] + index : index;
  }

  onDrop(event: DndDropEvent) {
    if (
      this.data &&
      (event.dropEffect === 'copy' || event.dropEffect === 'move')
    ) {
      let dragIndex = this.data.findIndex(
        item => event.data[this.id] === item[this.id]
      );
      let dropIndex = event.index || this.data.length;
      // remove element
      this.data.splice(dragIndex, 1);

      // add it back to new index
      if (dragIndex < dropIndex) {
        dropIndex--;
      }

      this.data.splice(dropIndex, 0, event.data);
    }
  }
}
