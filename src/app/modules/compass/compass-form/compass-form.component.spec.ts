import { ComponentFixture, TestBed } from '@angular/core/testing';
import { compassServiceMock } from '../../../mocks/modules/compass/compass.service.mock';
import { CompassService } from '../compass.service';
import { CompassFormComponent } from './compass-form.component';

describe('CompassFormComponent', () => {
  let component: CompassFormComponent;
  let fixture: ComponentFixture<CompassFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompassFormComponent],
      providers: [{ provide: CompassService, useValue: compassServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
