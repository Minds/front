import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MultiTenantNavigationService } from '../../services/navigation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { urlValidator } from '../../../../../../forms/url.validator';
import {
  NavigationItem,
  NavigationItemTypeEnum,
} from '../../../../../../../../graphql/generated.engine';
import { IconSelectorComponent } from '../../../../../../../common/standalone/icon-selector/icon-selector.component';
import { ModalService } from '../../../../../../../services/ux/modal.service';
import { Observable, Subscription, combineLatest, map, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../../../../common/services/confirm-leave-dialog.service';

export enum NavigationLinkFormView {
  'CREATE_CUSTOM_LINK',
  'EDIT_CORE_LINK',
  'EDIT_CUSTOM_LINK',
}

/**
 * A form for creating/editing a navigation link's
 * name, icon and destination (path/url)
 *
 * Core links have paths that can't be edited
 * Custom links have urls that can be edited
 */
@Component({
  selector: 'm-networkAdminConsoleNavigation__linkForm',
  templateUrl: './link-form.component.html',
  styleUrls: [
    './link-form.component.ng.scss',
    '../../../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleNavigationLinkFormComponent
  implements OnInit, OnDestroy {
  /**
   * The item that we're creating/editing
   */
  public navigationItem: NavigationItem | null = null;

  /**
   * The type of the link we're creating/editing
   */
  public itemType: NavigationItemTypeEnum = NavigationItemTypeEnum.CustomLink;

  public view: NavigationLinkFormView =
    NavigationLinkFormView.CREATE_CUSTOM_LINK;

  /**
   * Allows us to use enums in the template
   */
  public NavigationItemTypeEnum: typeof NavigationItemTypeEnum = NavigationItemTypeEnum;
  public NavigationLinkFormView: typeof NavigationLinkFormView = NavigationLinkFormView;

  public linkForm: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(
    public service: MultiTenantNavigationService,
    private fb: FormBuilder,
    private injector: Injector,
    public modalService: ModalService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    // Define the structure of the form
    this.linkForm = this.fb.group({
      name: ['', Validators.required],
      iconId: ['', Validators.required],
      pathOrUrl: [''],
    });

    /**
     * Watch queryParams to determine whether we have the id
     * of an item to edit. If not, we're creating a new item.
     */
    this.subscriptions.push(
      combineLatest([
        this.route.queryParams.pipe(take(1)),
        this.service.allNavigationItems$,
      ])
        .pipe(
          map(([params, navigationItems]) => {
            const id = params['id'];
            /**
             * Determine if there's an id and find
             * the matching navigation item or return null
             */
            return id
              ? navigationItems.find(navigationItem => navigationItem.id === id)
              : null;
          })
        )
        .subscribe(item => {
          this.navigationItem = item;

          this.setFormView();

          // We are editing an existing item, not creating a new one
          if (this.navigationItem) {
            this.itemType = this.navigationItem?.type;

            // Initialize form with pre-existing values
            this.linkForm.patchValue({
              name: this.navigationItem.name,
              iconId: this.navigationItem.iconId,
              pathOrUrl:
                this.itemType === NavigationItemTypeEnum.CustomLink
                  ? this.navigationItem.url
                  : this.navigationItem.path,
            });
          }

          this.updateValidators();
        })
    );
  }

  /**
   * Update form control validation rules based on item type
   */
  updateValidators(): void {
    if (this.itemType === NavigationItemTypeEnum.CustomLink) {
      // Custom links are required to enter a valid url
      this.linkForm
        .get('pathOrUrl')
        ?.setValidators([Validators.required, urlValidator]);
    } else {
      // Core links are not allowed to edit the path
      this.linkForm.get('pathOrUrl')?.disable();
    }

    this.linkForm.get('pathOrUrl')?.updateValueAndValidity();
  }

  /**
   * Determine form view from the item type
   */
  private setFormView(): void {
    if (this.itemType === NavigationItemTypeEnum.Core) {
      this.view = NavigationLinkFormView.EDIT_CORE_LINK;
    } else if (this.itemType === NavigationItemTypeEnum.CustomLink) {
      this.view = NavigationLinkFormView.EDIT_CUSTOM_LINK;
    } else {
      this.view = NavigationLinkFormView.CREATE_CUSTOM_LINK;
    }
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.linkForm.valid) {
      const formValue = this.linkForm.value;

      const id = this.navigationItem
        ? this.navigationItem.id
        : this.generateIdForNewCustomItem(formValue.name);

      const submittedItem: NavigationItem = {
        ...this.navigationItem, // Populate with existing navItem properties if it's an edit
        id: id,
        name: formValue.name,
        iconId: formValue.iconId,
        path:
          this.itemType === NavigationItemTypeEnum.Core
            ? this.navigationItem.path
            : null,
        url:
          this.itemType === NavigationItemTypeEnum.CustomLink
            ? formValue.pathOrUrl
            : null,
        type: this.itemType,
        visible: this.navigationItem?.visible || true,
        order: this.navigationItem?.order || 500,
      };

      this.subscriptions.push(
        this.service.upsertNavigationItem(submittedItem).subscribe(success => {
          if (success) {
            // Reset the form so we don't get stopped by the deactivate guard
            this.linkForm.markAsPristine();
            this.router.navigate(['network/admin/navigation/menu/list']);
          }
        })
      );
    }
  }

  openIconSelectorModal(): void {
    const modal = this.modalService.present(IconSelectorComponent, {
      data: {
        selectedIconId: this.linkForm.get('iconId')?.value ?? null,
        onConfirm: iconId => {
          this.linkForm.patchValue({ iconId: iconId });
          modal.dismiss();
        },
      },
      size: 'md',
      injector: this.injector,
    });
  }

  /**
   * Ask for confirmation before allowing a user to
   * navigate away when there are unsaved changes
   * @returns { Observable<boolean> } - true if component can be deactivated.
   */
  canDeactivate(): Observable<boolean> | boolean {
    if (!this.linkForm.dirty) {
      return true;
    }

    return this.dialogService.confirm('Discard changes?');
  }

  /**
   * @param { string } name
   * @returns { string } - lowercase version of the display name with no spaces and current timestamp appended
   */
  generateIdForNewCustomItem(name: string): string {
    return `${name.toLowerCase().replace(/\s+/g, '')}${Date.now()}`;
  }
}
