import { TreeModel } from './tree.model';

export class TreeNode {
  id: string;
  label: string;
  children: Array<TreeNode> = [];
  treeModel: TreeModel;
  original: any;
  parent: TreeNode;


  get isHidden() {
    return this.treeModel.isHidden(this);
  }

  get isExpanded() {
    return this.treeModel.isExpanded(this);
  }

  get isLeaf() {
    return !this.children || this.children.length === 0;
  }

  get level() {
    return this.parent ? this.parent.level + 1: 0;
  }

  constructor(data: any, idField: string, labelField: string, childrenField: string, treeModel: TreeModel, parent: TreeNode = null) {
    this.original = data;

    this.id = data[idField] || '';
    this.label = data[labelField] || '';

    this.parent = parent;

    (data[childrenField] || []).forEach((item) => {
      const node = new TreeNode(item, idField, labelField, childrenField, treeModel, this);
      this.children.push(node);
    });

    this.treeModel = treeModel;
  }

  toggleExpansion() {
    if (this.isExpanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  collapse() {
    this.treeModel.collapseNode(this);
  }

  expand() {
    this.treeModel.expandNode(this);
  }

  ensureVisible() {
    if (this.parent) {
      this.parent.expand();
      this.parent.ensureVisible();
    }

    return this;
  }

}