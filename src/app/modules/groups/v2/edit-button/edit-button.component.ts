import { Component, OnDestroy, OnInit } from '@angular/core';
import { GroupEditModalService } from '../edit/edit.modal.service';
import { GroupService } from '../group.service';
import { Subscription } from 'rxjs';

/**
 * Button that opens the group edit modal
 */
@Component({
  selector: 'm-group__editButton',
  templateUrl: './edit-button.component.html',
})
export class GroupEditButton implements OnInit, OnDestroy {
  group;
  private subscriptions: Subscription[] = [];

  constructor(
    public service: GroupService,
    private editModal: GroupEditModalService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.group$.subscribe(group => {
        this.group = group;
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
  /**
   * Opens the edit modal
   */
  async openEditModal(): Promise<void> {
    const editedGroup = await this.editModal.present(this.group);

    if (editedGroup) {
      this.service.load(editedGroup);
    }
  }
}
