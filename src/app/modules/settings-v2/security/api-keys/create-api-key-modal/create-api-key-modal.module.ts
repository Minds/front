import { NgModule } from '@angular/core';
import { CreateApiKeyModalComponent } from './create-api-key-modal.component';

@NgModule({
  imports: [CreateApiKeyModalComponent],
})
export class CreateApiKeyModalModule {
  public resolveComponent(): typeof CreateApiKeyModalComponent {
    return CreateApiKeyModalComponent;
  }
}
