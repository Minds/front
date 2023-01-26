import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

getTestBed().initTestEnvironment(
  [BrowserDynamicTestingModule, BrowserAnimationsModule],
  platformBrowserDynamicTesting(),
  {
    teardown: { destroyAfterEach: false },
  }
);
