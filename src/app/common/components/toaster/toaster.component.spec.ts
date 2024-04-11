import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToasterComponent } from './toaster.component';
import { ToasterService } from '../../services/toaster.service';

describe('ToasterComponent', () => {
  let component: ToasterComponent;
  let fixture: ComponentFixture<ToasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ToasterComponent],
      providers: [ToasterService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
