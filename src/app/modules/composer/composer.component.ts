import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UniqueId } from '../../helpers/unique-id.helper';

@Component({
  selector: 'm-composer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'composer.component.html',
})
export class ComposerComponent {
  id: string = UniqueId.generate('m-composer');

  poppedOut: boolean = false;

  popOut() {
    this.poppedOut = true;
  }
}
