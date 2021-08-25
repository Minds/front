import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NestedMenuComponent } from './nested-menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('NestedMenuComponent', () => {
  let component: NestedMenuComponent;
  let fixture: ComponentFixture<NestedMenuComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NestedMenuComponent],
        imports: [RouterTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show a menu item if shouldShow resolves to false', () => {
    component.menus = [
      {
        header: {
          label: 'Test',
          id: 'test',
        },
        items: [
          {
            label: 'Test item',
            id: 'test-item',
            shouldShow: () => true,
          },
        ],
      },
    ];

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-nestedMenu__itemWrapper'))
        .nativeElement.textContent
    ).toContain('Test item');

    component.menus = [
      {
        header: {
          label: 'Test',
          id: 'test',
        },
        items: [
          {
            label: 'Test item',
            id: 'test-item',
            shouldShow: () => false,
          },
        ],
      },
    ];

    fixture.detectChanges();
    //
    expect(
      fixture.debugElement.query(By.css('.m-nestedMenu__itemWrapper'))
    ).toBeNull();
  });
});
