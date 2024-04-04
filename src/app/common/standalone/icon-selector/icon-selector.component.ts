import { Component, Input, OnInit } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { SELECTABLE_MATERIAL_ICON_IDS } from './selectable-icon-ids';
import noOp from '../../../helpers/no-op';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, startWith, tap } from 'rxjs';
import { CommonModule } from '../../common.module';
import { SelectableIconComponent } from '../selectable-icon/selectable-icon.component';
import convertSnakeCaseToTitleCase from '../../../helpers/convert-snake-case-to-title-case';

export interface SelectableIcon {
  id: string;
  name: string;
}

type IconSelectorModalConfigs = {
  selectedIconId: string | null;
  onConfirm: (any) => any;
};

/**
 * Allows users to search for and select a material-icon from a pre-selected list. Currently used only within modal contexts.
 *
 * When icon selection is confirmed by the user,
 * the selected icon id is exported
 * via the onConfirm callback passed by the parent modal.
 */
@Component({
  selector: 'm-iconSelector',
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectableIconComponent,
  ],
  templateUrl: './icon-selector.component.html',
  styleUrls: ['./icon-selector.component.ng.scss'],
  standalone: true,
})
export class IconSelectorComponent implements OnInit {
  /**
   * List of material-icon ids to choose from
   */
  @Input() iconIdList: string[] = SELECTABLE_MATERIAL_ICON_IDS;

  /**
   * Complete list of icon objects
   */
  protected iconList: SelectableIcon[] = [];

  /**
   * List of icon objects that have been filtered according
   * to search input
   */
  public filteredIconList: SelectableIcon[] = [];

  protected searchControl = new FormControl();

  protected selectedIconId: string | null = null;

  protected isModal: boolean = true;

  /**
   * The parent modal defines this behavior via setModalData
   */
  public onConfirm: (any) => any = noOp;

  ngOnInit(): void {
    this.convertIdsToSelectableIcons();

    /**
     * Filter the visible icon list when the search input changes
     */
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(200),
        map(searchTerm => this.filterIconsBySearchTerm(searchTerm))
      )
      .subscribe(filteredIcons => {
        this.filteredIconList = filteredIcons;
      });
  }

  private convertIdsToSelectableIcons() {
    for (let id of this.iconIdList) {
      this.iconList.push({
        id: id,
        name: convertSnakeCaseToTitleCase(id),
      });
    }
    this.filteredIconList = this.iconList;
  }

  /**
   * Return matches when the search term partially matches id OR display name
   * @param searchTerm
   * @returns SelectableIcon
   */
  private filterIconsBySearchTerm(searchTerm: string): SelectableIcon[] {
    searchTerm = searchTerm.toLowerCase();
    return this.iconList.filter(
      icon =>
        icon.id.includes(searchTerm) ||
        icon.name.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * @param iconId
   */
  protected selectIcon(iconId: string): void {
    this.selectedIconId = iconId;
  }

  protected onClickConfirm(): void {
    if (this.selectedIconId) {
      this.onConfirm(this.selectedIconId);
    }
  }

  /**
   * Set modal data
   * @param configs
   */
  public setModalData(configs: IconSelectorModalConfigs): void {
    this.selectedIconId = configs?.selectedIconId;
    this.onConfirm = configs.onConfirm || noOp;
  }
}
