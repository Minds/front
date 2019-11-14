import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  DndDropEvent,
  EffectAllowed,
  DndDragImageOffsetFunction,
} from 'ngx-drag-drop';

@Component({
  selector: 'm-draggableList',
  templateUrl: 'list.component.html',
})
export class DraggableListComponent {
  @Input() data: Array<any>;
  @Input() dndEffectAllowed: EffectAllowed = 'copyMove';
  @Input() id: string;
  @Input() headers: string[];
  @ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;
  @Output() emptyListHeaderRowClicked: EventEmitter<any> = new EventEmitter();
  @Output() itemRemoved: EventEmitter<number> = new EventEmitter();

  dragging: boolean = false;

  trackByFunction(index, item) {
    return this.id ? item[this.id] + index : index;
  }

  onDrop(event: DndDropEvent) {
    this.dragging = false;

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
  onDragStart(event: DragEvent) {
    this.dragging = true;
  }

  removeItem(index) {
    this.itemRemoved.next(index);
  }

  clickedHeaderRow($event) {
    if (this.data.length === 0) {
      this.emptyListHeaderRowClicked.emit($event);
    }
  }

  dragImageOffsetRight: DndDragImageOffsetFunction = (
    event: DragEvent,
    dragImage: HTMLElement
  ) => {
    return {
      x: dragImage.offsetWidth - 57,
      y: event.offsetY + 10,
    };
  };
}
