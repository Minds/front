import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MockComponent, MockDirective, MockService } from '../../utils/mock';
import { Session } from '../../services/session';
import { DefaultFeedContainerComponent } from './default-feed-container.component';

describe('DefaultFeedContainerComponent', () => {
  let comp: DefaultFeedContainerComponent;
  let fixture: ComponentFixture<DefaultFeedContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DefaultFeedContainerComponent,
        MockComponent({
          selector: 'm-defaultFeed',
        }),
        MockComponent({
          selector: 'm-discovery__disclaimer',
        }),
        MockComponent({
          selector: 'm-suggestions__sidebar',
        }),
        MockDirective({
          selector: 'm-pageLayout__container',
        }),
        MockDirective({
          selector: 'm-pageLayout__pane',
        }),
        MockDirective({
          selector: 'm-stickySidebar',
        }),
      ],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: MockService(Router) },
        { provide: Session, useValue: MockService(Session) },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(DefaultFeedContainerComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  it('should have default feed component', () => {
    expect(By.css('m-defaultFeed')).toBeDefined();
  });

  it('should have discovery disclaimer', () => {
    expect(By.css('m-discovery__disclaimer')).toBeDefined();
  });

  it('should have suggestions sidebar component', () => {
    expect(By.css('m-suggestions__sidebar')).toBeDefined();
  });
});
