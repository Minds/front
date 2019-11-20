import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { PageLayoutComponent } from './page-layout.component';

@Component({
  selector: 'm-sidebarMenu',
  template: '',
})
class SidebarMenuComponentMock {
  @Input() catId;
  @Input() menu;
}

describe('PageLayoutComponent', () => {
  let component: PageLayoutComponent;
  let fixture: ComponentFixture<PageLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageLayoutComponent, SidebarMenuComponentMock],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
