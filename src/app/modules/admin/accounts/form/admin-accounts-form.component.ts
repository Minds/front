import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  catchError,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import {
  EntityResolverService,
  EntityResolverServiceOptions,
} from '../../../../common/services/entity-resolver.service';
import { MindsUser } from '../../../../interfaces/entities';
import { firstValueFrom, Observable, of, Subscription } from 'rxjs';
import {
  AdminUpdateAccountGQL,
  AdminUpdateAccountMutation,
} from '../../../../../graphql/generated.engine';
import { ApolloError, ApolloQueryResult } from '@apollo/client';
import { ToasterService } from '../../../../common/services/toaster.service';

@Component({
  selector: 'm-admin__accounts--form',
  styleUrls: ['admin-accounts-form.component.ng.scss'],
  templateUrl: './admin-accounts-form.component.html',
})
export class AdminAccountsFormComponent implements OnInit, OnDestroy {
  public accountsForm: UntypedFormGroup = this.formBuilder.group({
    currentUsername: [
      '',
      {
        initialValueIsDefault: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
        ],
      },
    ],
    newUsername: [
      '',
      {
        initialValueIsDefault: true,
        validators: [Validators.maxLength(40)],
        updateOn: 'change',
      },
    ],
    newEmail: [
      '',
      {
        initialValueIsDefault: true,
        validators: [Validators.email],
        updateOn: 'change',
      },
    ],
    resetMFA: [false],
  });

  public targetUser$: Observable<MindsUser> = new Observable<MindsUser>(null);

  public targetUserSubscription: Subscription;

  public inProgress = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private entityResolverService: EntityResolverService,
    private updateAccountGQL: AdminUpdateAccountGQL,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.targetUser$ = this.accountsForm.controls.currentUsername.valueChanges.pipe(
      distinctUntilChanged(),
      switchMap((username: string) => {
        if (!username) {
          return of(null);
        }
        this.inProgress = true;
        const options = new EntityResolverServiceOptions();
        options.refType = 'username';
        options.ref = username;

        return this.entityResolverService.get$<MindsUser>(options);
      }),
      tap(() => {
        this.inProgress = false;
      }),
      shareReplay(1)
    );
    this.targetUserSubscription = this.targetUser$.subscribe();
  }

  ngOnDestroy(): void {
    this.targetUserSubscription.unsubscribe();
  }

  private resetFormFields(): void {
    this.accountsForm.reset();
  }

  public async onSave(e: Event): Promise<void> {
    e.preventDefault();

    await firstValueFrom(
      this.updateAccount().pipe(
        take(1),
        tap((success: boolean) => {
          this.toaster.success('Account updated');
        }),
        catchError((err: ApolloError) => {
          this.toaster.error(err.message);
          return of(false);
        })
      )
    );
  }

  private updateAccount(): Observable<boolean> {
    return this.updateAccountGQL
      .mutate({
        currentUsername: this.accountsForm.controls.currentUsername.value,
        newUsername: this.accountsForm.controls.newUsername.value,
        newEmail: this.accountsForm.controls.newEmail.value,
        resetMFA: this.accountsForm.controls.resetMFA.value,
      })
      .pipe(
        map(
          (result: ApolloQueryResult<AdminUpdateAccountMutation>): boolean => {
            return true;
          }
        )
      );
  }
}
