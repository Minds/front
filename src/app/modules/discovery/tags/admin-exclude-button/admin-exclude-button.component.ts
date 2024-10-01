import { Component, Injector, Input } from '@angular/core';
import { DiscoveryTag, DiscoveryTagsService } from '../tags.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import {
  ExcludeHashtagGQL,
  ExcludeHashtagMutation,
} from '../../../../../graphql/generated.engine';
import { ModalRef, ModalService } from '../../../../services/ux/modal.service';
import { ConfirmV2Component } from '../../../modals/confirm-v2/confirm.component';
import { MutationResult } from 'apollo-angular';

/**
 * Button to exclude a tag from the trending list.
 */
@Component({
  selector: 'm-discovery__adminExcludeButton',
  template: `
    <m-button
      class="m-discoveryTrendListItem__excludeButton"
      (onAction)="onExcludeTagClick($event, tag)"
      color="red"
      size="xsmall"
      iconOnly="true"
    >
      <i class="material-icons">close</i>
    </m-button>
  `,
})
export class DiscoveryAdminExcludeButtonComponent {
  /** The tag to exclude. */
  @Input() protected tag: DiscoveryTag;

  /** Whether a call to exclude is in progress. */
  private readonly inProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private excludeHashtagGQL: ExcludeHashtagGQL,
    private discoveryTagsService: DiscoveryTagsService,
    private modalService: ModalService,
    private toaster: ToasterService,
    private injector: Injector
  ) {}

  /**
   * Handles the click event for excluding a tag.
   * @param { MouseEvent } $event - The click event.
   * @param { DiscoveryTag } tag - The tag to exclude.
   * @returns { Promise<void> }
   */
  protected async onExcludeTagClick(
    $event: MouseEvent,
    tag: DiscoveryTag
  ): Promise<void> {
    $event.preventDefault();
    $event.stopPropagation();

    const modalRef: ModalRef<ConfirmV2Component> = this.modalService.present(
      ConfirmV2Component,
      {
        data: {
          title: 'Hide this hashtag?',
          body:
            'Are you sure that you want to hide this hashtag?\n' +
            'Hiding will prevent it from being shown in the trending list for all users.',
          confirmButtonText: 'Hide',
          confirmButtonColor: 'red',
          confirmButtonSolid: true,
          showCancelButton: true,
          onConfirm: async () => {
            modalRef.close();
            this.excludeHashtag(tag);
          },
        },
        injector: this.injector,
      }
    );
  }

  /**
   * Excludes a hashtag.
   * @param { DiscoveryTag } tag - The tag to exclude.
   * @returns { Promise<void> }
   */
  private async excludeHashtag(tag: DiscoveryTag): Promise<void> {
    this.inProgress$.next(true);

    try {
      const response: MutationResult<ExcludeHashtagMutation> =
        await firstValueFrom(
          this.excludeHashtagGQL.mutate({ hashtag: tag.value })
        );

      if (response?.data?.excludeHashtag) {
        this.discoveryTagsService.removeTagFromTrending(tag);
      }

      this.toaster.success(
        response?.data?.excludeHashtag
          ? `#${tag.value} excluded successfully`
          : `Failed to exclude #${tag.value}`
      );
    } catch (e: unknown) {
      console.error(e);
    } finally {
      this.inProgress$.next(false);
    }
  }
}
