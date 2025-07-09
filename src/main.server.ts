import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';
import { TestComponent } from './app/test.component';

import '../server-polyfills';
console.log('loaded polyfills?');
import { Minds } from '~/app.component';

const bootstrap = () => bootstrapApplication(Minds, config);

export default bootstrap;
