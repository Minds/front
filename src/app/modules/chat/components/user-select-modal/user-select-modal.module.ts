import { NgModule } from '@angular/core';
import { UserSelectModalComponent } from './user-select-modal.component';

@NgModule({
  imports: [UserSelectModalComponent],
})
export class UserSelectModalModule {
  public resolveComponent(): typeof UserSelectModalComponent {
    return UserSelectModalComponent;
  }
}
