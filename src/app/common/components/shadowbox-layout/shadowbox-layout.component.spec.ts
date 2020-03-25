import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { ShadowboxLayoutComponent } from './shadowbox-layout.component';

@Component({
  selector: 'm-shadowboxHeader',
  template: '',
})
class ShadowboxHeaderComponentMock {
  @Input() isScrollable;
}

describe('ShadowboxLayoutComponent', () => {
  let component: ShadowboxLayoutComponent;
  let fixture: ComponentFixture<ShadowboxLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShadowboxLayoutComponent, ShadowboxHeaderComponentMock],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShadowboxLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
