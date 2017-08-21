import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'm-wire-console',
  templateUrl: 'console.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WireConsoleComponent {

  showOptions: boolean = false;

  constructor(private cd: ChangeDetectorRef) { }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
