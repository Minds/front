import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('canWrap', () => {
    it('should handle canWrap being set', () => {
      component.canWrap = true;
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.m-button--canWrap')
      ).toBeTruthy();
    });

    it('should handle canWrap being unset', () => {
      component.canWrap = false;
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.m-button--canWrap')
      ).toBeFalsy();
    });
  });
});
