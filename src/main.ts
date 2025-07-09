import { bootstrapApplication } from '@angular/platform-browser';
import { Minds } from './app/app.component';

import { config } from './app/app.config.browser';
import { TestComponent } from './app/test.component';

bootstrapApplication(Minds, config).catch((err) => {
  console.log('build error on bootstrap');
  console.error(err);
});
