import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StickySidebarDirective } from './sticky-sidebar.directive';
import { Component } from '@angular/core';

@Component({
  selector: 'my-test-component',
  template: ` <div m-stickySidbar>Contents</div> `,
})
class TestStickySidebarDirectiveComponent {}

describe('StickySidebarDirective', () => {
  let component: TestStickySidebarDirectiveComponent;
  let fixture: ComponentFixture<TestStickySidebarDirectiveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        StickySidebarDirective,
        TestStickySidebarDirectiveComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestStickySidebarDirectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it ('should make sticky on scroll', () => {

  // });
});
