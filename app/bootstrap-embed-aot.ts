/// <reference path="typings/medium-editor.d.ts" />
/// <reference path="typings/minds.d.ts" />
/// <reference path="../tools/typings/tsd/index.d.ts" />

import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { EmbedModuleNgFactory } from '../.tmp.aot/app/embed.module.ngfactory';

enableProdMode();
platformBrowser().bootstrapModuleFactory(EmbedModuleNgFactory);
