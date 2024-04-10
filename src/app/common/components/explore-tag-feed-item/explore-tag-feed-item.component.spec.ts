import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent } from '../../../utils/mock';
import { ExploreTagFeedItemComponent } from './explore-tag-feed-item.component';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('ExploreTagFeedItemComponent', () => {
  let comp: ExploreTagFeedItemComponent;
  let fixture: ComponentFixture<ExploreTagFeedItemComponent>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [
        ExploreTagFeedItemComponent,
        MockComponent({ selector: 'm-button' }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreTagFeedItemComponent);
    comp = fixture.componentInstance;
    comp.tag = 'minds';
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('tag text', () => {
    it('should show the tag text', () => {
      const text: DebugElement = fixture.debugElement.query(
        By.css('.m-exploreTagFeedItem__text')
      );
      expect(text.nativeElement.innerText).toBe('#minds trending');
    });
  });

  describe('explore button click', () => {
    it('should call router navigate on Explore button click', () => {
      const navSpy = spyOn(router, 'navigateByUrl');
      const button = fixture.debugElement.query(
        By.css('.m-exploreTagFeedItem__exploreButton')
      );
      expect(button).not.toBeUndefined();

      button.nativeElement.click();

      expect(navSpy).toHaveBeenCalledTimes(1);
      expect(navSpy.calls.mostRecent().args[0].toString()).toEqual(
        '/search?q=%23minds&f=top&t=all'
      );
    });
  });
});
