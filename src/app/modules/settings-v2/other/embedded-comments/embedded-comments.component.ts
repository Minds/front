import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Session } from '../../../../services/session';

import { catchError, map, take, tap } from 'rxjs/operators';
import { MutationResult, QueryRef } from 'apollo-angular';
import { EMPTY, Observable, Subscription, lastValueFrom } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';
import { ApolloError } from '@apollo/client';
import {
  FetchEmbeddedCommentsSettingsGQL,
  FetchEmbeddedCommentsSettingsQuery,
  FetchEmbeddedCommentsSettingsQueryVariables,
  SetEmbeddedCommentsSettingsGQL,
} from '../../../../../graphql/generated.engine';

/**
 * Wallet settings component.
 *
 * Controls whether wallet balance appears in topbar
 * (e.g. for privacy during screenshares and screencasts)
 */
@Component({
  selector: 'm-settingsV2__embeddedComments',
  templateUrl: 'embedded-comments.component.html',
  styleUrls: ['embedded-comments.component.ng.scss'],
})
export class SettingsV2EmbeddedCommentsComponent implements OnInit, OnDestroy {
  // user form.
  public form: UntypedFormGroup;

  // true when load in progress.
  public inProgress = true;

  // Saving form
  public saving = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private session: Session,
    private router: Router,
    private toast: ToasterService,
    protected fb: FormBuilder,
    private fetchEmbeddedCommentsSettings: FetchEmbeddedCommentsSettingsGQL,
    private setEmbeddedCommentsSettings: SetEmbeddedCommentsSettingsGQL,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork: boolean
  ) {}

  ngOnInit(): void {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    if (!this.isTenantNetwork) {
      this.router.navigate(['/']);
    }

    this.form = this.fb.group({
      domain: ['', [Validators.required, Validators.minLength(3)]],
      pathRegex: ['', [Validators.required, Validators.minLength(1)]],
      autoImportsEnabled: [true, [Validators.required]],
    });

    this.subscriptions = [
      this.fetchEmbeddedCommentsSettings
        .watch()
        .valueChanges.pipe(
          map(
            (result: ApolloQueryResult<FetchEmbeddedCommentsSettingsQuery>) =>
              result.data.embeddedCommentsSettings
          )
        )
        .subscribe((settings) => {
          this.form.setValue({
            domain: settings?.domain,
            pathRegex: settings?.pathRegex,
            autoImportsEnabled: settings?.autoImportsEnabled,
          });
        }),
    ];

    this.inProgress = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription?.unsubscribe());
  }

  async onSave() {
    this.saving = true;

    try {
      await lastValueFrom(
        this.setEmbeddedCommentsSettings
          .mutate(this.form.value)
          .pipe(catchError((e: ApolloError) => this.handleError(e)))
      );

      this.form.markAsPristine();

      this.toast.success('Success!');
    } catch (e) {
    } finally {
      this.saving = false;
    }
  }

  private handleError(e: ApolloError): Observable<never> {
    this.toast.error(e.message);
    return EMPTY;
  }
}
