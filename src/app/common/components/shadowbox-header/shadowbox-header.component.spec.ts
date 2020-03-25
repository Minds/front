import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Component,
  Input,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';

import { ShadowboxHeaderComponent } from './shadowbox-header.component';

describe('ShadowboxHeaderComponent', () => {
  let component: ShadowboxHeaderComponent;
  let fixture: ComponentFixture<ShadowboxHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShadowboxHeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShadowboxHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
