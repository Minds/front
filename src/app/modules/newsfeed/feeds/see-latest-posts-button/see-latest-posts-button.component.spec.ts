import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { MockService } from '../../../../utils/mock';
import { MINDS_PIPES } from './../../../../common/pipes/pipes';
import { FeedsService } from './../../../../common/services/feeds.service';
import { SeeLatestPostsButtonComponent } from './see-latest-posts-button.component';

describe('SeeLatestPostsButtonComponent', () => {
  let component: SeeLatestPostsButtonComponent;
  let fixture: ComponentFixture<SeeLatestPostsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeeLatestPostsButtonComponent, MINDS_PIPES],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeLatestPostsButtonComponent);
    component = fixture.componentInstance;
    component.feedService = MockService(FeedsService) as any;
    component.feedService.newPostsCount$ = new BehaviorSubject(2);
    component.feedService.watchForNewPosts = jasmine.createSpy(
      'watchForNewPosts',
      () => () => {}
    );
    spyOn(component.onClickEmitter, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be clickable', () => {
    component.onClick();
    expect(component.onClickEmitter.emit).toHaveBeenCalled();
    expect(component.feedService.fetch).toHaveBeenCalled();
  });

  it('should have loading', () => {
    component.feedService.countInProgress$ = new BehaviorSubject(false);
    expect(component.loadingNewPosts$.getValue()).toBeFalsy();
    fixture.detectChanges();
    component.feedService.countInProgress$ = new BehaviorSubject(true);
    expect(component.loadingNewPosts$.getValue()).toBeTruthy();
  });

  it('should show correct number', () => {
    expect(component.newPostsCount$.getValue()).toEqual(2);
  });

  it('should unmount nicely', () => {
    component.ngOnDestroy();
    expect(component.disposeWatcher).toHaveBeenCalled();
  });

  it('should start polling for updates', () => {
    expect(component.feedService.watchForNewPosts).toHaveBeenCalled();
    expect(component.disposeWatcher).toBeTruthy();
  });
});
