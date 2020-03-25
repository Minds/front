import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ExperimentsModule } from './experiments.module';
import { ExperimentDirective } from './experiment.directive';
import { ExperimentsService } from './experiments.service';

import { Client } from '../../common/api/client.service';
import { clientMock } from '../../../tests/client-mock.spec';
import { Storage } from '../../services/storage';
import {
  CookieOptionsProvider,
  COOKIE_OPTIONS,
  CookieService,
  CookieModule,
} from '@gorniv/ngx-universal';

@Component({
  template: `
    <div
      *mExperiment="'homepage'; bucket: 'base'"
      class="homepage-bucket-base"
    ></div>
    <div
      *mExperiment="'homepage'; bucket: 'variant1'"
      class="homepage-bucket-variant1"
    ></div>
  `,
})
class ExperimentsTestComponent {}

describe('Directive: ExperimentDirective', () => {
  let fixture: ComponentFixture<ExperimentsTestComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CookieModule],
      providers: [
        ExperimentsService,
        { provide: Client, useValue: clientMock },
        Storage,
        CookieService,
        { provide: COOKIE_OPTIONS, useValue: CookieOptionsProvider },
      ],
      declarations: [ExperimentDirective, ExperimentsTestComponent],
    }).compileComponents();
    clientMock.response = {};
  });

  it('should load base', fakeAsync(() => {
    const url = `api/v2/experiments/homepage`;
    clientMock.response = {
      status: 'success',
      bucketId: 'base',
    };

    fixture = TestBed.createComponent(ExperimentsTestComponent);
    fixture.detectChanges();

    jasmine.clock().tick(100);
    tick();

    expect(!!fixture.debugElement.query(By.css('.homepage-bucket-base'))).toBe(
      true
    );
    expect(
      !!fixture.debugElement.query(By.css('.homepage-bucket-variant1'))
    ).toBe(false);
  }));
});
