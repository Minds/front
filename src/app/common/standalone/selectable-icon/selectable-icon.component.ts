import { Component, Input } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import convertSnakeCaseToTitleCase from '../../../helpers/convert-snake-case-to-title-case';

/**
 * Simple card that displays a material-icon and its name
 * along with optional projected content
 */
@Component({
  selector: 'm-selectableIcon',
  imports: [NgCommonModule],
  templateUrl: './selectable-icon.component.html',
  styleUrls: ['./selectable-icon.component.ng.scss'],
  standalone: true,
})
export class SelectableIconComponent {
  /** The material-icon id of the icon to be presented */
  @Input() set iconId(value: string) {
    this._iconId = value;
    if (value) {
      this.iconName = convertSnakeCaseToTitleCase(value);
    }
  }

  /** The icon's display name */
  iconName: string;

  private _iconId: string;

  get iconId(): string {
    return this._iconId;
  }
}
