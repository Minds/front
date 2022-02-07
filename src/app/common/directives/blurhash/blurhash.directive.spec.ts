import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Component } from '@angular/core';
import { BlurhashDirective } from './blurhash.directive';

@Component({
  selector: 'my-test-component',
  template: `
    <div [m-blurhash]="">
      Contents
    </div>
  `,
})
class TestBlurhashDirectiveComponent {}

describe('BlurhashDirective', () => {
  let component: TestBlurhashDirectiveComponent;
  let fixture: ComponentFixture<TestBlurhashDirectiveComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BlurhashDirective, TestBlurhashDirectiveComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBlurhashDirectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
