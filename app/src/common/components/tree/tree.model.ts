import { EventEmitter } from '@angular/core';
import { TreeNode } from './tree-node.model';

export class TreeModel {
  nodes: Array<TreeNode> = [];

  hiddenNodes: TreeNode[] = [];
  expandedNodes: TreeNode[] = [];

  updated: EventEmitter<any> = new EventEmitter<any>();

  setData(data: Array<any>) {
    (data || []).forEach((item) => {
      const node = new TreeNode(item, 'id', 'label', 'children', this);
      this.nodes.push(node);
    });
  }

  isHidden(node: TreeNode) {
    return this.hiddenNodes.findIndex((item) => {
      return item === node;
    }) !== -1;
  }

  isExpanded(node: TreeNode) {
    return this.expandedNodes.findIndex((item) => {
      return item === node;
    }) !== -1;
  }

  toggleExpansion(node: TreeNode) {
    const index = this.expandedNodes.findIndex((item) => {
      return item === node;
    });
    if (index !== -1) {
      this.expandedNodes.splice(index, 1);
    } else {
      this.expandedNodes.push(node);
    }
  }

  expandNode(node: TreeNode) {
    const index = this.expandedNodes.findIndex((item) => {
      return item === node;
    });
    if (index === -1) {
      this.expandedNodes.push(node);
    }
  }

  collapseNode(node: TreeNode) {
    const index = this.expandedNodes.findIndex((item) => {
      return item === node;
    });
    if (index !== -1) {
      this.expandedNodes.splice(index, 1);
    }
  }

  hideNode(node: TreeNode) {
    const index = this.hiddenNodes.findIndex((item) => {
      return item === node;
    });
    if (index === -1) {
      this.hiddenNodes.push(node);
    }
  }

  showNode(node: TreeNode) {
    const index = this.hiddenNodes.findIndex((item) => {
      return item === node;
    });
    if (index !== -1) {
      this.hiddenNodes.splice(index, 1);
    }
  }

  clearExpandedNodes() {
    this.expandedNodes = [];
  }

  clearFilter() {
    this.hiddenNodes = [];
  }

  filterNodes(filter: string = '') {
    if (filter === '') {
      this.clearFilter();
      return;
    }
    let filterFn;
    filterFn = (node) => node.label.toLowerCase().indexOf(filter.toLowerCase()) !== -1;

    this.nodes.forEach((node) => this._filterNode(node, filterFn));
  }

  private _filterNode(node: TreeNode, filterFn) {
    // if node passes function then it's visible
    let isVisible = filterFn(node);

    if (node.children) {
      // if one of node's children passes filter then this node is also visible
      node.children.forEach((child) => {
        if (this._filterNode(child, filterFn)) {
          isVisible = true;
        }
      });
    }

    if (isVisible) {
      this.showNode(node);
      node.ensureVisible();
    } else {
      this.hideNode(node);
    }

    return isVisible;
  }

}