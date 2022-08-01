import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Filter, Option } from '../../../interfaces/dashboard';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'm-sort-selector',
  templateUrl: './sort-selector.component.html',
  styleUrls: ['./sort-selector.component.ng.scss'],
})
export class SortSelectorComponent implements OnInit {
  algorithms = [
    {
      id: 'hot',
      label: 'Hot',
      icon: 'whatshot',
    },
    {
      id: 'top',
      label: 'Top',
      icon: 'trending_up',
    },
    {
      id: 'latest',
      label: 'Latest',
      icon: 'timelapse',
    },
  ];

  periods = [
    {
      id: '12h',
      label: '12h',
    },
    {
      id: '24h',
      label: '24h',
    },
    {
      id: '7d',
      label: '7d',
    },
    {
      id: '30d',
      label: '30d',
    },
    {
      id: '1y',
      label: '1y',
    },
  ];

  customTypes = [
    {
      id: 'activities',
      label: 'All',
      icon: 'all_inclusive',
    },
    {
      id: 'images',
      label: 'Images',
      icon: 'photo',
    },
    {
      id: 'videos',
      label: 'Videos',
      icon: 'videocam',
    },
    {
      id: 'blogs',
      label: 'Blogs',
      icon: 'subject',
    },
    {
      id: 'channels',
      label: 'Channels',
      icon: 'people',
    },
    {
      id: 'groups',
      label: 'Groups',
      icon: 'group_work',
    },
  ];

  @Input() algorithm: string;

  @Input() allowedAlgorithms: string[] | boolean = true;

  @Input() period: string;

  @Input() allowedPeriods: string[] | boolean = true;

  @Input() customType: string;

  @Input() allowedCustomTypes: string[] | boolean = true;

  @Input() labelClass: string = 'm-sortSelector__label';

  @Input() showPlusFilter: boolean = false;

  @Output() onChange: EventEmitter<{
    algorithm;
    period;
    customType;
    plus;
  }> = new EventEmitter<{ algorithm; period; customType; plus }>();

  @ViewChild('algorithmDropdown')
  algorithmDropdown: DropdownMenuComponent;

  @ViewChild('periodDropdown')
  periodDropdown: DropdownMenuComponent;

  @ViewChild('customTypeDropdown')
  customTypeDropdown: DropdownMenuComponent;

  plusFilterApplied: boolean = false;

  protected lastUsedPeriod: string;

  protected lastWidth: number;

  constructor(protected elementRef: ElementRef) {}

  ngOnInit() {
    if (this.period) {
      this.lastUsedPeriod = this.period;
    }

    if (!this.customType) {
      this.customType = this.customTypes[0].id;
    }
  }

  getAlgorithms(): Option[] {
    if (this.allowedAlgorithms === true) {
      return this.algorithms;
    } else if (!this.allowedAlgorithms) {
      return [];
    }

    return this.algorithms.filter(
      algorithm => (<string[]>this.allowedAlgorithms).indexOf(algorithm.id) > -1
    );
  }

  shouldShowAlgorithms(): boolean {
    return this.getAlgorithms().length > 0;
  }

  setAlgorithm(id: string): boolean {
    const algorithm = this.algorithms.find(algorithm => id === algorithm.id);

    if (!algorithm) {
      console.error('Unknown algorithm');
      return false;
    }

    if (this.isDisabled(id)) {
      return false;
    }

    this.algorithm = id;

    if (this.lastUsedPeriod && algorithm.id === 'top') {
      this.period = this.lastUsedPeriod;
    }

    this.emit();

    return true;
  }

  getCurrentAlgorithm(): Option {
    return this.algorithms.find(algorithm => this.algorithm === algorithm.id);
  }

  getCurrentAlgorithmProp(prop: string) {
    const currentAlgorithm = this.getCurrentAlgorithm();

    if (!currentAlgorithm) {
      return '';
    }

    return currentAlgorithm[prop];
  }

  getPeriods(): Option[] {
    if (this.allowedPeriods === true) {
      return this.periods;
    } else if (!this.allowedPeriods) {
      return [];
    }

    return this.periods.filter(
      period => (<string[]>this.allowedPeriods).indexOf(period.id) > -1
    );
  }

  shouldShowPeriods(): boolean {
    return this.getPeriods().length > 0;
  }

  setPeriod(id: string): boolean {
    if (!this.periods.find(period => id === period.id)) {
      console.error('Unknown period');
      return false;
    }

    this.period = id;
    this.lastUsedPeriod = this.period;
    this.emit();

    return true;
  }

  getCurrentPeriod(): Option {
    return this.periods.find(period => this.period === period.id);
  }

  getCurrentPeriodLabel() {
    const currentPeriod = this.getCurrentPeriod();

    if (!currentPeriod) {
      return 'All the time';
    }

    return currentPeriod.label;
  }

  hasCurrentAlgorithmPeriod() {
    const currentAlgorithm = this.getCurrentAlgorithm();

    if (!currentAlgorithm) {
      return false;
    }

    return currentAlgorithm.id === 'top';
  }

  getCustomTypes(): Option[] {
    if (this.allowedCustomTypes === true) {
      return this.customTypes;
    } else if (!this.allowedCustomTypes) {
      return [];
    }

    return this.customTypes.filter(
      customType =>
        (<string[]>this.allowedCustomTypes).indexOf(customType.id) > -1
    );
  }

  shouldShowCustomTypes() {
    return this.getCustomTypes().length > 0;
  }

  setCustomType(id: string) {
    if (!this.customTypes.find(customType => id === customType.id)) {
      console.error('Unknown custom type');
      return false;
    }

    this.customType = id;
    this.emit();

    return true;
  }

  getCurrentCustomType() {
    return this.customTypes.find(
      customType => this.customType === customType.id
    );
  }

  getCurrentCustomTypeProp(prop: string) {
    const currentAlgorithm = this.getCurrentCustomType();

    if (!currentAlgorithm) {
      return '';
    }

    return currentAlgorithm[prop];
  }

  setPlus(): void {
    this.plusFilterApplied = !this.plusFilterApplied;
    this.closeDropdowns();
    this.emit();
  }

  emit(): void {
    this.onChange.emit({
      algorithm: this.algorithm,
      period: this.hasCurrentAlgorithmPeriod() ? this.period : null,
      customType: this.customType,
      plus: this.plusFilterApplied,
    });
  }

  closeDropdowns() {
    if (this.algorithmDropdown) {
      this.algorithmDropdown.close();
    }

    if (this.periodDropdown) {
      this.periodDropdown.close();
    }

    if (this.customTypeDropdown) {
      this.customTypeDropdown.close();
    }
  }

  isDisabled(id) {
    return (
      id != 'top' &&
      (this.customType === 'channels' || this.customType === 'groups')
    );
  }
}
