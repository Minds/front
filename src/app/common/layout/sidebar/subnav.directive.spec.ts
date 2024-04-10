import { SidebarNavigationSubnavDirective } from './subnav.directive';
import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
  waitForAsync,
} from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'my-test-component',
  template: `
    <li
      class="m-sidebarNavigation__item"
      [class.m-sidebarNavigation__item--active]="active"
    >
      <ul class="m-sidebarNavigation__subnav" m-sidebarNavigation__subnav>
        <li></li>
      </ul>
    </li>
  `,
})
class TestNavigationItemComponent {
  @Input() active = false;
}

describe('SidebarNavigationSubnavDirective', () => {
  let component: TestNavigationItemComponent;
  let fixture: ComponentFixture<TestNavigationItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestNavigationItemComponent,
        SidebarNavigationSubnavDirective,
      ],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TestNavigationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should not have popover when not hovers', () => {
    const popoverEl = fixture.debugElement.query(
      By.css('.m-sidebarNavigation__subnav--popover')
    );

    expect(popoverEl).toBeNull();
  });

  it('hovers over parent', () => {
    fixture.debugElement.triggerEventHandler('mouseenter', {});
    const popoverEl = fixture.debugElement.query(
      By.css('.m-sidebarNavigation__subnav--popover')
    );

    expect(popoverEl).toBeDefined();
  });

  it('should not have popover if parent is active', fakeAsync(() => {
    component.active = true;

    spyOnProperty(window, 'innerWidth').and.returnValue(1200);
    window.dispatchEvent(new Event('resize'));

    fixture.detectChanges();
    tick(1);

    fixture.debugElement.triggerEventHandler('mouseenter', {});
    const popoverEl = fixture.debugElement.query(
      By.css('.m-sidebarNavigation__subnav--popover')
    );

    expect(popoverEl).toBeNull();
  }));
});
