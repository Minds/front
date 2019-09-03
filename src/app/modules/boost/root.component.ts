import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MindsTitle } from '../../services/ux/title';

@Component({
  selector: 'm-boost-root',
  changeDetection: ChangeDetectionStrategy.Default, // Boost Console relies on default CDS
  templateUrl: 'root.component.html',
})
export class BoostRootComponent {
  constructor(title: MindsTitle) {
    title.setTitle('Boost');
  }
}
