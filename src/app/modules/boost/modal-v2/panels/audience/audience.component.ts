import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DEFAULT_AUDIENCE } from '../../boost-modal-v2.constants';
import { BoostAudience } from '../../boost-modal-v2.types';
import { BoostModalV2Service } from '../../services/boost-modal-v2.service';

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
  public audienceChangeSubscription: Subscription; // change audience in service on value change.
  public audienceInitSubscription: Subscription; // init the form using existing audience or default.

  constructor(
    private service: BoostModalV2Service,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // init the form using existing audience or default. Allows panel to be returned to and keep old value.
    this.audienceInitSubscription = this.service.audience$
      .pipe(
        take(1),
        map((audience: BoostAudience) => audience ?? DEFAULT_AUDIENCE)
      )
      .subscribe((initialAudience: BoostAudience) => {
        this.form = this.formBuilder.group({
          audience: [initialAudience, Validators.required],
        });
      });

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
  }

  /**
   * On radio button select, change form value.
   * @param { BoostAudience } audience - audience selected.
   */
  public selectRadioButton(audience: BoostAudience): void {
    this.form.controls.audience.setValue(audience);
  }
}
