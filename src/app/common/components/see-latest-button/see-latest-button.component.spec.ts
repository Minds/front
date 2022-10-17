import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from '../../../utils/mock';
import { SeeLatestButtonComponent } from './see-latest-button.component';

describe('SeeLatestPostsButtonComponent', () => {
  let component: SeeLatestButtonComponent;
  let fixture: ComponentFixture<SeeLatestButtonComponent>;

  function getSeeLatestButton(): DebugElement {
    return fixture.debugElement.query(By.css('.m-seeLatestButton'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SeeLatestButtonComponent,
        MockComponent({
          selector: 'm-button',
          outputs: ['onAction'],
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeLatestButtonComponent);
    component = fixture.componentInstance;

    spyOn(component.onClickEmitter, 'emit');
    spyOn(component.onPollEmitter, 'emit');

    component.newCount = 2;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be clickable', () => {
    component.onClick();
    expect(component.onClickEmitter.emit).toHaveBeenCalled();
  });

  it('should get title when new count is 1', () => {
    component.newCount = 2;
    fixture.detectChanges();
    expect(component.title).toContain('See 2 latest');
  });

  it('should render if count is greater than 0', () => {
    component.newCount = 2;
    fixture.detectChanges();
    expect(getSeeLatestButton()).not.toBeNull();
  });

  it('should NOT render if count is less than 1', () => {
    component.newCount = 0;
    fixture.detectChanges();
    expect(getSeeLatestButton()).toBeNull();
  });
});
