import { BehaviorSubject } from "rxjs";

export let groupsServiceMock = new function () {
  this.group = new BehaviorSubject(null);
  this.$group = this.group.asObservable();
};
