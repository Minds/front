import { NgModule } from '@angular/core';
import { ComposerComponent } from './composer.component';
import { CommonModule } from '../../common/common.module';

/**
 * Exported components
 */
const COMPONENTS = [ComposerComponent];

/**
 * Components used internally
 */
const INTERNAL_COMPONENTS = [];

/**
 * Module definition
 */
@NgModule({
  imports: [CommonModule],
  declarations: [...INTERNAL_COMPONENTS, ...COMPONENTS],
  exports: COMPONENTS,
})
export class ComposerModule {}
