import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CustomPageFormComponent } from './custom-page-form.component';
import { CustomPageService } from '../../../services/custom-page.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { MockService } from '../../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomPageExtended } from '../../../../custom-pages/custom-pages.types';

describe('CustomPageFormComponent', () => {
  let comp: CustomPageFormComponent;
  let fixture: ComponentFixture<CustomPageFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomPageFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: CustomPageService,
          useValue: MockService(CustomPageService, {
            has: ['customPage$'],
            props: {
              customPage$: {
                get: () => new BehaviorSubject<CustomPageExtended>(null),
              },
            },
          }),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomPageFormComponent);
    comp = fixture.componentInstance;
  });
});
