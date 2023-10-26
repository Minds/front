import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NewsfeedTabsComponent } from './tabs.component';

describe('NewsfeedTabsComponent', () => {
  let comp: NewsfeedTabsComponent;
  let fixture: ComponentFixture<NewsfeedTabsComponent>;

  /**
   * Get all tabs.
   * @returns { DebugElement[] } all tabs.
   */
  const getAllTabs = (): DebugElement[] =>
    fixture.debugElement.queryAll(By.css('.m-tabs__tab a'));

  /**
   * Get a specific tab by its text.
   * @param { string } text - text to get tab by.
   * @returns { DebugElement } - specific tab.
   */
  const getTabByText = (text: string): DebugElement =>
    getAllTabs().find((span: DebugElement): boolean =>
      span.nativeElement.textContent.includes(text)
    );

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NewsfeedTabsComponent],
        providers: [],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(NewsfeedTabsComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });
});
