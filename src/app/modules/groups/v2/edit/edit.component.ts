import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { GroupEditService } from './edit.service';
import { ApiService } from '../../../../common/api/api.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';

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
  @ViewChild('aiThreads')
  protected aiThreadsInput: ElementRef<HTMLInputElement>;

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
  constructor(
    public service: GroupEditService,
    private apiService: ApiService
  ) {}

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
    if (this.aiThreadsInput.nativeElement.files.length) {
      const data = new FormData();
      data.append('file', this.aiThreadsInput.nativeElement.files[0]);

      try {
        await lastValueFrom(
          this.apiService.upload(
            'api/v3/seco/import-threads/' + this.service.group$.value.guid,
            {
              file: this.aiThreadsInput.nativeElement.files[0],
            },
            {}
          )
        );

        this.onDismissIntent();
      } catch (err) {
        console.error(err);
      }
      return;
    }

    const group = await this.service.save();

    if (group) {
      this.onSave(group);
    }
  }
}
