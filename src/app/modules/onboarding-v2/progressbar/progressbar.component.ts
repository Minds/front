import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'm-onboarding__progressbar',
  templateUrl: 'progressbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressbarComponent implements OnInit {
  @Input() steps: Array<{ name: string; selected: boolean }> = [];

  constructor(protected cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.isMobile();
  }

  getSelectedIndex() {
    return this.steps.findIndex(item => item.selected);
  }

  isMobile() {
    return window.innerWidth <= 740;
  }

  @HostListener('window:resize')
  listenForResize() {
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
