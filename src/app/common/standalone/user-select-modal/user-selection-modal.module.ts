import { NgModule } from '@angular/core';
import { UserSelectionModalComponent } from './user-selection-modal.component';

@NgModule({
  imports: [UserSelectionModalComponent],
})
export class UserSelectionModalModule {
  public resolveComponent(): typeof UserSelectionModalComponent {
    return UserSelectionModalComponent;
  }
}
