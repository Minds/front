import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MultiTenantNavigationService } from './../../services/navigation.service';
import { Session } from '../../../../../../../services/session';
import { MindsUser } from '../../../../../../../interfaces/entities';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  NavigationItem,
  NavigationItemTypeEnum,
} from '../../../../../../../../graphql/generated.engine';
import { Router } from '@angular/router';

/**
 * A list of the tenant site's core and custom navigation items.
 * From here, items can be deleted, their edit modal opened,
 * and their visibility can be toggled.
 * Users may also drag & drop to reorder items in the list.
 */
@Component({
  selector: 'm-networkAdminConsoleNavigation__list',
  templateUrl: './list.component.html',
  styleUrls: [
    './list.component.ng.scss',
    '../../../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleNavigationListComponent implements OnInit {
  /**
   * Allows us to use Enum in the template
   */
  public NavigationItemTypeEnum: typeof NavigationItemTypeEnum = NavigationItemTypeEnum;

  /**
   * Local array that holds processed nav items to be displayed
   */
  public navigationItems: NavigationItem[] = [];

  private subscriptions: Subscription[] = [];

  protected channelAvatarUrl: string;

  public form: FormGroup;

  constructor(
    protected service: MultiTenantNavigationService,
    private session: Session,
    private configs: ConfigsService,
    private fb: FormBuilder
  ) {
    // Initialize the form
    this.form = this.fb.group({
      navigationItems: this.fb.array([]),
    });
  }

  ngOnInit() {
    const user = this.session.getLoggedInUser();

    if (!user) {
      return;
    }

    this.subscriptions.push(
      this.service.allNavigationItems$.subscribe(rawItems => {
        if (!rawItems?.length) return;

        this.navigationItemsFormArray.clear();

        this.channelAvatarUrl = `${this.configs.get('cdn_url')}icon/${
          user.guid
        }/small/${user.icontime}`;

        /**
         * Populate the 'channel' item from the raw list
         * with current user's username and avatar
         */
        this.navigationItems = rawItems.map(rawItem => {
          if (rawItem.id === 'channel') {
            return {
              ...rawItem,
              name: `@${user.username}`,
              path: `/${user.username}`,
            };
          }
          return rawItem;
        });

        /**
         * Populate the form with the processed navigation items
         * that include the dynamic channel-specific details
         */
        this.buildFormArray();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  buildFormArray() {
    this.navigationItems.forEach(item => {
      this.navigationItemsFormArray.push(
        this.createFormGroupForObject(this.fb, item)
      );
    });
  }

  /**
   * After a drag/drop, repopulate the form
   * with updatedData and save changes
   * @param updatedData
   */
  arrayChanged(updatedData: NavigationItem[]) {
    this.navigationItems = updatedData;
    this.navigationItemsFormArray.clear();
    this.buildFormArray();
    this.service.reorderNavigationItems(this.navigationItems);
  }

  /**
   * Create a form group out of a nav item
   * by creating an object made of each of its
   * properties with their values wrapped in an array
   * @param fb
   * @param { NavigationItem } item
   * @returns { FormGroup }
   */
  private createFormGroupForObject(
    fb: FormBuilder,
    item: NavigationItem
  ): FormGroup {
    const group = {};
    Object.keys(item).forEach(key => {
      group[key] = [item[key]];
    });
    return fb.group(group);
  }

  /**
   * Called when an item's visibility toggle is clicked
   * @param { number } index
   */
  toggleVisibility(index: number): void {
    const item = this.navigationItemsFormArray.at(index);

    const toggleVisibility = () => {
      item.get('visible').setValue(!item.get('visible').value);
    };

    // Optimistically toggle in anticipation of a successful save
    toggleVisibility();

    this.subscriptions.push(
      this.service.upsertNavigationItem(item.value).subscribe({
        next: success => {
          if (!success) {
            console.warn('Failed to save navigation item.');
            // Undo the optimistic toggle in case of failure
            toggleVisibility();
          }
        },
        error: error => {
          toggleVisibility();
        },
      })
    );
  }

  /**
   * @param {NavigationItem } item
   */
  deleteCustomItem(item: NavigationItem): void {
    this.service.deleteCustomNavigationItem(item);
  }

  get navigationItemsFormArray(): FormArray {
    return this.form.get('navigationItems') as FormArray;
  }
}
