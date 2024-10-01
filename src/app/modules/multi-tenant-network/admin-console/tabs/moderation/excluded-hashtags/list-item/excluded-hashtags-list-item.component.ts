import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import {
  RemoveHashtagExclusionGQL,
  RemoveHashtagExclusionMutation,
} from '../../../../../../../../graphql/generated.engine';
import { ExcludedHashtagEdge } from '../excluded-hashtags.types';
import { MutationResult } from 'apollo-angular';

/**
 * List of excluded hashtags.
 */
@Component({
  selector: 'm-networkAdminConsole__excludedHashtagsListItem',
  template: `
    <span class="m-excludedHashtagList__hashtag">#{{ tagEdge.node?.tag }}</span>
    <m-button
      (onAction)="removeHashtagExclusion(tagEdge.node?.tag)"
      color="red"
      size="xsmall"
      iconOnly="true"
    >
      <i class="material-icons">close</i>
    </m-button>
  `,
  styleUrls: ['./excluded-hashtags-list-item.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkAdminConsoleExcludedHashtagsListItemComponent {
  /** The hashtag edge. */
  @Input() public tagEdge: ExcludedHashtagEdge;

  /** Emits when a hashtag is removed. */
  @Output() public onRemoved: EventEmitter<string> = new EventEmitter<string>();

  /** Whether loading is in progress. */
  public inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  constructor(private removeHashtagExclusionGQL: RemoveHashtagExclusionGQL) {}

  /**
   * Removes a hashtag exclusion.
   * @param { string } tag - The hashtag to remove.
   * @returns { Promise<void> }
   */
  public async removeHashtagExclusion(tag: string): Promise<void> {
    this.inProgress$.next(true);

    try {
      const result: MutationResult<RemoveHashtagExclusionMutation> =
        await firstValueFrom(
          this.removeHashtagExclusionGQL.mutate({ hashtag: tag })
        );

      if (result.data?.removeHashtagExclusion) {
        this.onRemoved.emit(tag);
      } else {
        throw new Error('Failed to remove hashtag exclusion');
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.inProgress$.next(false);
    }
  }
}
