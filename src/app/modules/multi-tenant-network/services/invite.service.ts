import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  map,
  of,
  take,
  tap,
} from 'rxjs';
import {
  CancelInviteGQL,
  CancelInviteMutation,
  CancelInviteMutationVariables,
  CreateInviteGQL,
  CreateInviteMutation,
  CreateInviteMutationVariables,
  InviteEdge,
  ResendInviteGQL,
  ResendInviteMutation,
  ResendInviteMutationVariables,
  Role,
} from '../../../../graphql/generated.engine';
import { ToasterService } from '../../../common/services/toaster.service';
import { PermissionsService } from '../../../common/services/permissions.service';
import { Session } from '../../../services/session';
import { MutationResult } from 'apollo-angular';

/**
 * Service for management of invites
 */
@Injectable({ providedIn: 'root' })
export class InviteService implements OnDestroy {
  /** Subject to store all roles value. */
  public readonly allInvites$: BehaviorSubject<Role[]> = new BehaviorSubject<
    Role[]
  >(null);

  private subscriptions: Subscription[] = [];

  constructor(
    private createInviteGQL: CreateInviteGQL,
    private cancelInviteGQL: CancelInviteGQL,
    private resendInviteGQL: ResendInviteGQL,
    private toaster: ToasterService
  ) {}

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Creates an invite
   * @returns { Observable<boolean> } true if the invite was created
   */
  public createInvite(
    mutationVars: CreateInviteMutationVariables
  ): Observable<boolean> {
    return this.createInviteGQL.mutate(mutationVars).pipe(
      take(1),
      map((result: MutationResult<CreateInviteMutation>) => {
        return Boolean(result?.data);
      }),
      tap(inviteCreated => {
        if (inviteCreated) {
          this.toaster.success('Your invitation has been created');
        }
      }),
      catchError(
        (e: any): Observable<boolean> => {
          if (e?.errors?.[0] && e.errors[0].message) {
            this.toaster.error(e.errors[0].message);
          } else {
            this.toaster.error('Something went wrong. Please try again');
          }
          console.error(e);
          return of(false);
        }
      )
    );
  }

  /**
   * Cancels an invite
   * @returns { Observable<boolean> } true if the invite was canceled
   */
  public cancelInvite(invite: InviteEdge): Observable<boolean> {
    const mutationVars: CancelInviteMutationVariables = {
      inviteId: invite.node.inviteId,
    };

    return this.cancelInviteGQL.mutate(mutationVars).pipe(
      take(1),
      map((result: MutationResult<CancelInviteMutation>) => {
        return 'cancelInvite' in (result?.data ?? {});
      }),
      tap(inviteCanceled => {
        if (inviteCanceled) {
          this.toaster.inform('The invitation has been canceled');
        }
      }),
      catchError(
        (e: any): Observable<boolean> => {
          if (e?.errors?.[0] && e.errors[0].message) {
            this.toaster.error(e.errors[0].message);
          }
          console.error(e);
          return of(false);
        }
      )
    );
  }

  /**
   * Resends an invite
   * @returns { Observable<boolean> } true if the invite was resent
   */
  public resendInvite(invite: InviteEdge): Observable<boolean> {
    const mutationVars: ResendInviteMutationVariables = {
      inviteId: invite.node.inviteId,
    };

    return this.resendInviteGQL.mutate(mutationVars).pipe(
      take(1),
      map((result: MutationResult<ResendInviteMutation>) => {
        return 'resendInvite' in (result?.data ?? {});
      }),
      tap(inviteResent => {
        if (inviteResent) {
          this.toaster.success('The invitation has been resent');
        }
      }),
      catchError(
        (e: any): Observable<boolean> => {
          if (e?.errors?.[0] && e.errors[0].message) {
            this.toaster.error(e.errors[0].message);
          }
          console.error(e);
          return of(false);
        }
      )
    );
  }
}
