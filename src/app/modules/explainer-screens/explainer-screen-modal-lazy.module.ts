import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExplainerScreenModalComponent } from './components/explainer-screen-modal.component';
import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';

/**
 * Lazy loaded module.
 */
@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MarkdownModule.forRoot({}),
  ],
  declarations: [ExplainerScreenModalComponent],
})
export class ExplainerScreenModalLazyModule {
  public resolveComponent(): typeof ExplainerScreenModalComponent {
    return ExplainerScreenModalComponent;
  }
}
