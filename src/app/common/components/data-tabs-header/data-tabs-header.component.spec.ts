import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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

import { DataTabsHeaderComponent } from './data-tabs-header.component';

describe('DataTabsHeaderComponent', () => {
  let component: DataTabsHeaderComponent;
  let fixture: ComponentFixture<DataTabsHeaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DataTabsHeaderComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTabsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
