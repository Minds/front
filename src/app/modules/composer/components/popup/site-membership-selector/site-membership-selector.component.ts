import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ComposerService } from '../../../services/composer.service';
import { ComposerSiteMembershipsService } from '../../../services/site-memberships.service';
import { SiteMembership } from '../../../../../../graphql/generated.engine';
import { Subscription } from 'rxjs';

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

  init = false;
  membershipsForm: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private composerService: ComposerService,
    protected siteMembershipsService: ComposerSiteMembershipsService
  ) {
    this.membershipsForm = this.fb.group({
      memberships: new FormArray([]),
      selectAllMemberships: [false],
    });
  }

  get membershipsFormArray() {
    return this.membershipsForm.controls.memberships as FormArray;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.siteMembershipsService.allMemberships$.subscribe(allMemberships => {
        const membershipsArray = this.membershipsForm.get(
          'memberships'
        ) as FormArray;
        // Clear the form array before adding new controls
        membershipsArray.clear();
        // Add a new control for each membership
        allMemberships.forEach((membership, index) => {
          const control = this.fb.control(false); // Initialize control unchecked
          membershipsArray.push(control);

          // Subscribe to the value changes of each individual membership checkbox
          // Here we call handleMembershipChange method whenever a checkbox value changes
          this.subscriptions.push(
            control.valueChanges.subscribe(value => {
              this.handleMembershipChange(index, value);
            })
          );
        });

        this.init = true; // ojm remove/

        // ojm keep or no?
        // this.applyInitialSelection();
      }),
      this.membershipsForm
        .get('selectAllMemberships')
        ?.valueChanges.subscribe(value => {
          this.membershipsFormArray.controls.forEach(control =>
            control.setValue(value)
          );
        })
    );

    // Listen for changes in the "Select All Memberships" checkbox
    this.membershipsForm
      .get('selectAllMemberships')
      ?.valueChanges.subscribe(value => {
        if (value) {
          this.membershipsFormArray.controls.forEach(control =>
            control.setValue(true)
          );
        }
      });

    this.siteMembershipsService.fetchMemberships();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // ojm keep or no?
  // applyInitialSelection() {
  //   const initialSelections: SiteMembershipGuidsSubjectValue = this.composerService.siteMembershipGuids$.getValue();
  //   const allMemberships: SiteMembership[] = this.siteMembershipsService.allMemberships$.getValue();
  //   const membershipsArray = this.membershipsForm.get(
  //     'memberships'
  //   ) as FormArray;

  //   allMemberships.forEach((membership, index) => {
  //     const isSelected = initialSelections.some(
  //       selectedMembership =>
  //         selectedMembership.membershipGuid === membership.membershipGuid
  //     );
  //     membershipsArray.at(index).setValue(isSelected, { emitEvent: false });
  //   });

  //   // After applying initial selections, check if all memberships are selected to update 'Select All' checkbox
  //   const allSelected = allMemberships.every(membership =>
  //     initialSelections.some(
  //       selectedMembership =>
  //         selectedMembership.membershipGuid === membership.membershipGuid
  //     )
  //   );
  //   this.membershipsForm
  //     .get('selectAllMemberships')
  //     ?.setValue(allSelected, { emitEvent: false });
  // }

  /**
   * Make sure the 'All memberships' checkbox is accurate when the individual membership checkboxes change
   * @param index
   */
  private handleMembershipChange(index: number, value: boolean): void {
    // Logic when an individual membership checkbox changes
    // Uncheck 'Select All' if any checkbox is unchecked
    if (!value) {
      this.membershipsForm.get('selectAllMemberships')?.setValue(false);
    } else {
      // Check if all checkboxes are now checked
      const allChecked = this.membershipsFormArray.controls.every(
        control => control.value
      );
      this.membershipsForm.get('selectAllMemberships')?.setValue(allChecked);
    }
  }

  /**
   * When 'selectAllMemberships' is checked/unchecked, update all individual checkboxes accordingly
   */
  onSelectAllChange() {
    const selectAll = this.membershipsForm.get('selectAllMemberships')?.value;

    this.membershipsFormArray.controls.forEach(control => {
      control.setValue(selectAll);
    });
  }

  /**
   * Update the composer service with the new value and close the popup
   *
   * If 'all memberships' was selected, return -1
   */
  onSubmit() {
    // Check if the 'all memberships' checkbox is checked
    const selectAll = this.membershipsForm.get('selectAllMemberships')?.value;

    if (selectAll) {
      // If 'all memberships' is checked, set -1 to indicate all memberships are selected
      this.composerService.siteMembershipGuids$.next([-1]);
    } else {
      // Otherwise, proceed to collect selected membership GUIDs
      const selectedMembershipGuids = this.membershipsFormArray.value
        .map((checked: boolean, i: number) =>
          checked
            ? this.siteMembershipsService.allMemberships$.getValue()[i]
                .membershipGuid
            : null
        )
        .filter((v: string | null) => v !== null);

      // Update the service with the selected membership GUIDs
      this.composerService.siteMembershipGuids$.next(selectedMembershipGuids);
    }

    // Emit event to close the popup
    this.dismissIntent.emit();
  }
}
