import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { DataTabsLayoutComponent } from './data-tabs-layout.component';

@Component({
  selector: 'm-dataTabsHeader',
  template: '',
})
class DataTabsHeaderComponentMock {
  @Input() isScrollable;
}

describe('DataTabsLayoutComponent', () => {
  let component: DataTabsLayoutComponent;
  let fixture: ComponentFixture<DataTabsLayoutComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DataTabsLayoutComponent, DataTabsHeaderComponentMock],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTabsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
