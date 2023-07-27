import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { MockService } from '../../../utils/mock';
import { MINDS_PIPES } from '../../pipes/pipes';
import { FeedsService } from '../../services/feeds.service';
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
    spyOn(component.onClickEmitter, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be clickable', () => {
    component.onClick();
    expect(component.onClickEmitter.emit).toHaveBeenCalled();
  });
});
