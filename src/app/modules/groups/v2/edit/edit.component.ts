import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GroupEditService } from './edit.service';

/**
 * Edit component - modal
 * Container for vertical accordion modal with various panes for editing a group
 */
@Component({
  selector: 'm-group__edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.ng.scss'],
  providers: [GroupEditService],
})
export class GroupEditComponent {
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
   * Modal options
   *
   * @param onSave
   * @param onDismissIntent
   * @param group
   */
  setModalData({ group, onSave, onDismissIntent }) {
    this.service.setGroup(group);
    this.onSave = onSave || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  /**
   * Saves the updated group info
   */
  async onSubmit(): Promise<void> {
    const group = await this.service.save();

    if (group) {
      this.onSave(group);
    }
  }
}
