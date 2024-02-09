import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import {
  ComposerService,
  SiteMembershipGuidsSubjectValue,
} from '../../../services/composer.service';
import { ComposerSiteMembershipsService } from '../../../services/site-memberships.service';
import {
  SiteMembership,
  SiteMembershipBillingPeriodEnum,
} from '../../../../../../graphql/generated.engine';
import { Subscription } from 'rxjs';
import { ToasterService } from '../../../../../common/services/toaster.service';

@Component({
  selector: 'm-composer__siteMembershipSelector',
  templateUrl: 'site-membership-selector.component.html',
  styleUrls: ['site-membership-selector.component.ng.scss'],
})
export class ComposerSiteMembershipSelectorComponent
  implements OnInit, OnDestroy {
  /**
   * Signal event emitter to parent's popup service
   */
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  membershipsForm: FormGroup;
  subscriptions: Subscription[] = [];

  /**
   * Allows us to use roleId enums in the template
   */
  public SiteMembershipBillingPeriodEnum: typeof SiteMembershipBillingPeriodEnum = SiteMembershipBillingPeriodEnum;

  constructor(
    private fb: FormBuilder,
    protected composerService: ComposerService,
    protected siteMembershipsService: ComposerSiteMembershipsService,
    protected toaster: ToasterService
  ) {
    this.membershipsForm = this.fb.group({
      memberships: new FormArray([]),
      selectAllCheckbox: new FormControl<boolean>(false),
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.siteMembershipsService.allMemberships$.subscribe(allMemberships => {
        this.setUpFormControls(allMemberships);

        this.subscriptions.push(
          this.composerService.siteMembershipGuids$.subscribe(guids => {
            this.checkSelectedMemberships(guids, allMemberships);
          })
        );
      })
    );

    this.siteMembershipsService.fetchMemberships();
  }

  /**
   * Ensure previously-made selections are displayed
   * @param guids
   * @param allMemberships
   */
  private checkSelectedMemberships(
    guids: SiteMembershipGuidsSubjectValue,
    allMemberships: SiteMembership[]
  ): void {
    const membershipsArray = this.membershipsForm.get(
      'memberships'
    ) as FormArray;

    // Reset all checkboxes to false initially
    membershipsArray.controls.forEach(control =>
      control.setValue(false, { emitEvent: false })
    );
    this.selectAllCheckbox.setValue(false, { emitEvent: false });

    // Process previous selections
    if (Array.isArray(guids)) {
      if (guids.length === 1 && guids[0] === -1) {
        // If guids is [-1], select all memberships
        membershipsArray.controls.forEach(control =>
          control.setValue(true, { emitEvent: false })
        );
        this.selectAllCheckbox.setValue(true, { emitEvent: false });
      } else {
        const stringGuids: string[] = guids as string[];
        allMemberships.forEach((membership, index) => {
          if (stringGuids.includes(membership.membershipGuid)) {
            membershipsArray.at(index).setValue(true, { emitEvent: false });
          }
        });

        // Check if all memberships are selected and update 'Select All' checkbox
        const allSelected = membershipsArray.value.every(value => value);
        this.selectAllCheckbox.setValue(allSelected, { emitEvent: false });
      }
    }
  }

  private setUpFormControls(allMemberships: SiteMembership[]) {
    const membershipsArray = this.membershipsForm.get(
      'memberships'
    ) as FormArray;
    membershipsArray.clear();

    allMemberships.forEach(() => membershipsArray.push(this.fb.control(false)));

    this.subscriptions.push(
      // Subscribe to changes in individual checkboxes to update 'Select All'
      membershipsArray.valueChanges.subscribe(values => {
        const allChecked = values.every(value => value);
        this.selectAllCheckbox.setValue(allChecked, { emitEvent: false });
      }),

      // Handle 'Select All' changes
      this.selectAllCheckbox.valueChanges.subscribe(value => {
        membershipsArray.controls.forEach(control => control.setValue(value));
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Update the composer service with the new value and close the popup
   * If 'all memberships' was selected, return [-1]
   */
  onSubmit() {
    // Check if the 'all memberships' checkbox is checked
    const selectAll = this.membershipsForm.get('selectAllCheckbox').value;

    if (selectAll) {
      this.composerService.siteMembershipGuids$.next([-1]);
    } else {
      const selectedMembershipGuids = this.membershipsFormArray.value
        .map((checked: boolean, i: number) =>
          checked
            ? this.siteMembershipsService.allMemberships$.getValue()[i]
                .membershipGuid
            : null
        )
        .filter((v: string | null) => v !== null);

      // Explicitly set to null if no checkboxes are checked
      if (selectedMembershipGuids.length === 0) {
        this.composerService.siteMembershipGuids$.next(null);
        //Ensure paywall-related post properties are reset
        this.composerService.paywallThumbnail$.next(null);
        if (!this.composerService.attachments$.getValue()) {
          this.composerService.title$.next(null);
        }
      } else {
        // Proceed with selected GUIDs
        this.composerService.siteMembershipGuids$.next(selectedMembershipGuids);
      }
    }

    // Emit event to close the popup
    this.dismissIntent.emit();
  }

  formClicked(): void {
    if (this.composerService.isEditing$.getValue()) {
      this.toaster.error('Memberships are no longer editable on this post');
    }
  }

  get membershipsFormArray() {
    return this.membershipsForm.controls.memberships as FormArray;
  }

  get selectAllCheckbox() {
    return this.membershipsForm.get('selectAllCheckbox');
  }
}
