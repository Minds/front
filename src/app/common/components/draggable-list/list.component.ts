import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  Output,
  EventEmitter,
  ChangeDetectorRef,
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
  @Input() disabled: boolean;
  @ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;
  @Output() emptyListHeaderRowClicked: EventEmitter<any> = new EventEmitter();
  @Output() arrayChanged: EventEmitter<any> = new EventEmitter();

  dragging: boolean = false;

  trackByFunction(index, item) {
    return this.id ? item[this.id] + index : index;
  }

  constructor(private cd: ChangeDetectorRef) {}

  onDrop(event: DndDropEvent) {
    this.dragging = false;
    if (
      this.data &&
      (event.dropEffect === 'copy' || event.dropEffect === 'move')
    ) {
      let dragIndex = this.data.findIndex(
        item => event.data[this.id] === item[this.id]
      );
      let dropIndex = event.index;
      // remove element
      this.data.splice(dragIndex, 1);

      // add it back to new index
      if (dragIndex < dropIndex) {
        dropIndex--;
      }

      this.data.splice(dropIndex, 0, event.data);
      this.arrayChanged.emit(this.data);
    }
  }

  removeItem(index) {
    this.data.splice(index, 1);
    this.arrayChanged.emit(this.data);
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

  /**
   * If input is focused then disable dragging
   */
  onFocusIn(e: FocusEvent | MouseEvent) {
    this.disabled = true;
  }

  /**
   * Re-enable when input not focused
   * TODO: Make this smarter.. what if something else disabled the dragging?
   */
  onFocusOut(e: FocusEvent | MouseEvent) {
    this.disabled = false;
  }
}
