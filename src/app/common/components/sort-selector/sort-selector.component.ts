import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { DropdownComponent } from "../dropdown/dropdown.component";

@Component({
  selector: 'm-sort-selector',
  templateUrl: './sort-selector.component.html',
})
export class SortSelectorComponent {

  algorithms: Array<{ id, label, icon?, help?, noPeriod? }> = [
    {
      id: 'hot',
      label: 'Hot',
      icon: 'whatshot',
      help: 'Hot will sort based on the difference between up and down votes, and the freshness of the content over the last hours.',
      noPeriod: true,
    },
    {
      id: 'top',
      label: 'Top',
      icon: 'thumb_up',
      help: 'Top will sort based on the number of up votes a content has over certain time period.',
    },
    {
      id: 'controversial',
      label: 'Controversial',
      icon: 'thumbs_up_down',
      help: 'Controversial will sort based on the balance of up and down votes a content has over certain time period.',
    },
    {
      id: 'latest',
      label: 'Latest',
      icon: 'timelapse',
      help: 'Latest will sort the content based on its creation date.',
      noPeriod: true,
    },
  ];

  periods: Array<{ id, label }> = [
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
      label: '1y'
    },
  ];

  customTypes: Array<{ id, label, icon? }> = [
    {
      id: 'activities',
      label: 'All',
      icon: 'view_stream',
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
  ];

  @Input() isActive: boolean = false;

  @Input() algorithm: string;

  @Input() period: string;

  @Input() customType: string;

  @Input() labelClass: string = "m--sort-selector-label";

  @Input() labelActiveClass: string = "m--sort-selector-label--active";

  @Input() except: Array<string> = [];

  @Input() hideCustomTypes: boolean = false;

  @Input() caption: string = 'Sort';

  @Input() tooltipText: string;

  @Output('onChange') onChangeEventEmitter = new EventEmitter<{ algorithm, period, customType }>();

  @ViewChild('algorithmDropdown') algorithmDropdown: DropdownComponent;

  @ViewChild('periodDropdown') periodDropdown: DropdownComponent;

  @ViewChild('customTypeDropdown') customTypeDropdown: DropdownComponent;

  getVisibleAlgorithms() {
    return this.algorithms.filter(algorithm => this.except.indexOf(algorithm.id) === -1)
  }

  setAlgorithm(id: string) {
    if (!this.algorithms.find(algorithm => id === algorithm.id)) {
      console.error('Unknown algorithm');
      return false;
    }

    this.algorithm = id;
    this.emit();

    return true;
  }

  getCurrentAlgorithm() {
    return this.algorithms.find(algorithm => this.algorithm === algorithm.id);
  }

  getCurrentAlgorithmProp(prop: string) {
    const currentAlgorithm = this.getCurrentAlgorithm();

    if (!currentAlgorithm) {
      return '';
    }

    return currentAlgorithm[prop];
  }

  setPeriod(id: string) {
    if (!this.periods.find(period => id === period.id)) {
      console.error('Unknown period');
      return false;
    }

    this.period = id;
    this.emit();

    return true;
  }

  getCurrentPeriod() {
    return this.periods.find(period => this.period === period.id)
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

    return !currentAlgorithm.noPeriod;
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
    return this.customTypes.find(customType => this.customType === customType.id)
  }

  getCurrentCustomTypeProp(prop: string) {
    const currentAlgorithm = this.getCurrentCustomType();

    if (!currentAlgorithm) {
      return '';
    }

    return currentAlgorithm[prop];
  }

  emit() {
    this.onChangeEventEmitter.emit({
      algorithm: this.algorithm,
      period: this.hasCurrentAlgorithmPeriod() ? this.period : null,
      customType: this.customType,
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
}
