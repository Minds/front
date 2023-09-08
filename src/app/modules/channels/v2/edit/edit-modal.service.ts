import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ChannelEditComponent } from './edit.component';
import { MindsUser } from '../../../../interfaces/entities';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../../../services/session';
import { ModalService } from '../../../../services/ux/modal.service';

/**
 * Help showing Edit modal and handling its response
 */
@Injectable()
export class ChannelEditModalService {
  /**
   * Constructor
   * @param modalService
   * @param router
   * @param route
   * @param session
   */
  constructor(
    protected modalService: ModalService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected session: Session
  ) {}

  /**
   * Presents the channel edit modal with a custom injector tree
   */
  async present(
    channel: MindsUser,
    initialPane: number,
    injector: Injector
  ): Promise<MindsUser | null> {
    if (channel.guid !== this.session.getLoggedInUser().guid) {
      this.removeQueryParams();
      throw new Error('You may only edit your own channel');
    }

    const modal = this.modalService.present(ChannelEditComponent, {
      data: {
        channel,
        initialPane,
        onSave: response => modal.close(response),
      },
      size: 'lg',
      injector,
    });

    return modal.result.finally(() => this.removeQueryParams());
  }

  removeQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        editing: null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
