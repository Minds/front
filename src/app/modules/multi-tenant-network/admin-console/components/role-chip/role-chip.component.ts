import { Component, Input } from '@angular/core';
import { Role } from '../../../../../../graphql/generated.engine';

/**
 * Displays a single role
 * with an icon, name and a rounded border
 */
@Component({
  selector: 'm-role__chip',
  templateUrl: './role-chip.component.html',
  styleUrls: ['./role-chip.component.ng.scss'],
})
export class RoleChipComponent {
  @Input() role: Role;
}
