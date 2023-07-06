import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { BoostAudience } from '../../boost-modal-v2.types';
import { BoostModalV2Service } from '../../services/boost-modal-v2.service';
import { BoostTargetExperimentService } from '../../../../experiments/sub-services/boost-target-experiment.service';

/**
 * Audience selector panel for boost modal V2. Allows selection of
 * the audience of the boost e.g. Safe vs Controversial.
 */
@Component({
  selector: 'm-boostModalV2__audienceSelector',
  templateUrl: './audience.component.html',
  styleUrls: ['audience.component.ng.scss'],
})
export class BoostModalV2AudienceSelectorComponent
  implements OnInit, OnDestroy {
  public BoostAudience: typeof BoostAudience = BoostAudience;
  public form: FormGroup; // form group

  /**
   * Whether the collapsible container for the target platform
   * checkboxes is open
   */
  protected targetPlatformContainerOpen: boolean = false;

  private audienceChangeSubscription: Subscription; // change audience in service on value change.
  private audienceInitSubscription: Subscription; // init the form using existing audience or default.
  private safeOptionClickSubscription: Subscription; // initialized on safe option click.

  private subscriptions: Subscription[] = [];

  constructor(
    private service: BoostModalV2Service,
    private formBuilder: FormBuilder,
    protected boostTargetExperiment: BoostTargetExperimentService
  ) {}

  ngOnInit(): void {
    this.audienceInitSubscription = combineLatest([
      this.service.audience$,
      this.isSafeOptionDisabled$,
      this.service.targetPlatformWeb$,
      this.service.targetPlatformAndroid$,
      this.service.targetPlatformIos$,
    ])
      .pipe(take(1))
      .subscribe(
        ([
          initialAudience,
          isSafeOptionDisabled,
          initialTargetPlatformWeb,
          initialTargetPlatformAndroid,
          initialTargetPlatformIos,
        ]: [BoostAudience, boolean, boolean, boolean, boolean]): void => {
          if (isSafeOptionDisabled) {
            this.service.audience$.next(BoostAudience.CONTROVERSIAL);
            initialAudience = BoostAudience.CONTROVERSIAL;
          }
          this.form = this.formBuilder.group({
            audience: new FormControl<BoostAudience>(
              initialAudience,
              Validators.required
            ),
          });

          if (this.boostTargetExperiment.isActive()) {
            this.form.addControl(
              'targetPlatformWeb',
              new FormControl(initialTargetPlatformWeb, Validators.required)
            );
            this.form.addControl(
              'targetPlatformAndroid',
              new FormControl(initialTargetPlatformAndroid, Validators.required)
            );
            this.form.addControl(
              'targetPlatformIos',
              new FormControl(initialTargetPlatformIos, Validators.required)
            );

            this.subscriptions.push(
              // Target Platform WEB Subscription
              // Change value in service on form control value change.
              this.form.controls.targetPlatformWeb.valueChanges.subscribe(
                (val: boolean) => {
                  this.service.targetPlatformWeb$.next(val);
                }
              ),
              // Target Platform ANDROID Subscription
              // Change value in service on form control value change.
              this.form.controls.targetPlatformAndroid.valueChanges.subscribe(
                (val: boolean) => {
                  this.service.targetPlatformAndroid$.next(val);
                }
              ),
              // Target Platform iOS Subscription
              // Change value in service on form control value change.
              this.form.controls.targetPlatformIos.valueChanges.subscribe(
                (val: boolean) => {
                  this.service.targetPlatformIos$.next(val);
                }
              )
            );
          }
        }
      );

    // change audience in service on value form control change.
    this.audienceChangeSubscription = this.form.controls.audience.valueChanges.subscribe(
      (audience: BoostAudience) => {
        this.service.audience$.next(audience);
      }
    );
  }

  ngOnDestroy(): void {
    this.audienceInitSubscription?.unsubscribe();
    this.audienceChangeSubscription?.unsubscribe();
    this.safeOptionClickSubscription?.unsubscribe();

    for (let subscription of this.subscriptions) {
      subscription?.unsubscribe();
    }
  }

  /**
   * Whether safe audience is disabled.
   * @returns { boolean } true if safe audience is disabled.
   */
  get isSafeOptionDisabled$(): Observable<boolean> {
    return this.service.disabledSafeAudience$;
  }

  /**
   * On radio button select, change form value unless audience is disabled.
   * @param { BoostAudience } audience - audience selected.
   * @returns { void }
   */
  public selectRadioButton(audience: BoostAudience): void {
    if (audience === BoostAudience.SAFE) {
      this.safeOptionClickSubscription = this.isSafeOptionDisabled$
        .pipe(take(1))
        .subscribe((isSafeOptionDisabled: boolean) => {
          if (!isSafeOptionDisabled) {
            this.form.controls.audience.setValue(audience);
          }
        });
    } else {
      this.form.controls.audience.setValue(audience);
    }
  }
}
