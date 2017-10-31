/// <reference path="typings/medium-editor.d.ts" />
/// <reference path="typings/minds.d.ts" />
/// <reference path="../tools/typings/tsd/index.d.ts" />

import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { MindsModuleNgFactory } from '../.tmp.aot/app/app.module.ngfactory';

enableProdMode();
platformBrowser().bootstrapModuleFactory(MindsModuleNgFactory);
