import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  TemplateRef,
} from '@angular/core';
import { DndDropEvent, DropEffect, EffectAllowed } from 'ngx-drag-drop';

@Component({
  selector: 'm-draggable-list',
  template: `
    <ul
      dndDropzone
      [dndHorizontal]="false"
      [dndEffectAllowed]="dndEffectAllowed"
      (dndDrop)="onDrop($event, data)"
    >
      <div
        class="dndPlaceholder"
        dndPlaceholderRef
        style="min-height:72px;border:1px dashed green;background-color:rgba(0, 0, 0, 0.1)"
      ></div>

      <li
        *ngFor="let item of data; let i = index; trackBy: trackByFunction"
        [dndDraggable]="item"
        [dndEffectAllowed]="'move'"
        (dndCopied)="onDragged(item, data, 'copy')"
        (dndLinked)="onDragged(item, data, 'link')"
        (dndMoved)="onDragged(item, data, 'move')"
        (dndEnd)="onDragEnd(item, data, $event)"
        (dndCanceled)="onDragged(item, data, 'none')"
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
  @Input() dndEffectAllowed: EffectAllowed = 'move';
  @ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;

  trackByFunction(index, item) {
    return item.tag + index;
  }

  onDragged(item: any, list: any[], effect: DropEffect) {
    // const index = list.indexOf(item);
    // list.splice(index, 1);
  }

  onDragEnd(item: any, list: any[], event: DragEvent) {
    const index = list.indexOf(item);
    list.splice(index, 1);
    console.warn('drag ended');
  }

  onDrop(event: DndDropEvent, list?: any[]) {
    if (list && (event.dropEffect === 'copy' || event.dropEffect === 'move')) {
      let index = event.index;

      if (typeof index === 'undefined') {
        index = list.length;
      }

      list.splice(index, 0, event.data);
    }
  }
}
