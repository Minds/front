import { Component, Input } from '@angular/core';
import { GroupEditService } from './edit.service';

@Component({
  selector: 'm-group__editModal',
  templateUrl: 'edit.component.html',
  providers: [GroupEditService],
})
export class GroupEditModalComponent {
  /**
   * Sets the channel to be edited
   * @param group
   */
  @Input('group') set data(group: any) {
    this.service.setGroup(group);
  }

  /**
   * Modal options
   *
   * @param onSave
   * @param onDismissIntent
   */
  set opts({ onSave, onDismissIntent }) {
    this.onSave = onSave || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  /**
   * Modal save handler
   */
  onSave: (any) => any = () => {};

  /**
   * Modal dismiss intent handler
   */
  onDismissIntent: () => void = () => {};

  /**
   * Constructor
   * @param service
   */
  constructor(public service: GroupEditService) {}

  /**
   * Saves the updated user info
   */
  async onSubmit(): Promise<void> {
    const group = await this.service.save();

    if (group) {
      this.onSave(group);
    }
  }
}
