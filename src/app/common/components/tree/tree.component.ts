import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TreeModel } from './tree.model';
import { TreeNode } from './tree-node.model';

@Component({
  selector: 'm--tree',
  template: `
    <span *ngIf="nodes.length === 0"><i i18n="No results on a tree view@@COMMON__TREE__NO_RESULTS">No results found</i></span>
    <ng-container *ngFor="let item of nodes">
      <ng-container *ngIf="!item.isHidden">
        <div class="m-tree--items" [style.padding-left.px]="item.level * 10">
          <span [style.visibility]="item.isLeaf ? 'hidden' : 'visible'">
            <span class="m-tree--items-icon" *ngIf="item.isExpanded" (click)="item.toggleExpansion()">
              -
            </span>
            <span class="m-tree--items-icon" *ngIf="!item.isExpanded" (click)="item.toggleExpansion()">
              +
            </span>
          </span>
          <span class="m-tree--items--label" (click)="onItemClicked(item)">
          {{item.label}}
        </span>
        </div>
        <m--tree class="m-tree--sub-item" *ngIf="!item.isLeaf && item.isExpanded && !item.isHidden"
          [collection]="item.children" [treeModel]="treeModel"
          (itemClicked)="onItemClicked($event)"></m--tree>
      </ng-container>
    </ng-container>
  `
})
export class TreeComponent {

  @Input() treeModel: TreeModel = new TreeModel();

  nodes: TreeNode[] = [];
  private _filter: string;

  @Input()
  set collection(value: Array<any>) {
    if (value && value.length > 0 && value[0] instanceof TreeNode) {
      this.nodes = value;
    } else {
      this.treeModel.setData(value);
      this.nodes = this.treeModel.nodes;
    }
  }

  private timeout;

  @Input()
  set filter(filter: string) {
    if (filter !== this._filter) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.treeModel.clearExpandedNodes();
        this.treeModel.filterNodes(filter);
        this._filter = filter;
      }, 200);
    }
  }

  @Output() itemClicked: EventEmitter<any> = new EventEmitter<any>();

  onItemClicked(item) {
    this.itemClicked.emit(item);
  }

}
