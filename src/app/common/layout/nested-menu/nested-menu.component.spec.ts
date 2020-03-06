import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedMenuComponent } from './nested-menu.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('NestedMenuComponent', () => {
  let component: NestedMenuComponent;
  let fixture: ComponentFixture<NestedMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NestedMenuComponent],
      providers: [{ provide: Router, useValue: RouterTestingModule }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
