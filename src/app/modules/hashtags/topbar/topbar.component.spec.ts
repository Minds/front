import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarHashtagsComponent } from './topbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from '../../../utils/mock';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { TopbarHashtagsService } from '../service/topbar.service';
import { topbarHashtagsServiceMock } from '../../../mocks/modules/hashtags/service/topbar.service.mock';

describe('TopbarHashtagsComponent', () => {

  let comp: TopbarHashtagsComponent;
  let fixture: ComponentFixture<TopbarHashtagsComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MockComponent({ selector: 'm-tooltip', template: '<ng-content></ng-content>' }),
        MockComponent({ selector: 'm-dropdown', template: '<ng-content></ng-content>' }),
        TopbarHashtagsComponent
      ],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
        {
          provide: TopbarHashtagsService, useValue: topbarHashtagsServiceMock
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(TopbarHashtagsComponent);

    topbarHashtagsServiceMock.loadResponse = [
      {
        value: 'hashtag1',
        selected: true
      },
      {
        value: 'hashtag2',
        selected: false
      }
    ];

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

  it('should have an #all option that lets the feed know to ignore user selected hashtags', () => {
    let all = fixture.debugElement.query(By.css('.m-topbar--hashtags--hashtag--all'));

    expect(all).not.toBeNull();

    expect(all.nativeElement.textContent).toContain('#all');

    expect(comp.all).toBeFalsy();

    all.nativeElement.click();

    expect(comp.all).toBeTruthy();
  });

  it('should have two hashtags, and one should be selected', () => {
    let hashtag1 = fixture.debugElement.query(By.css('.m-topbar--hashtags > span.m-topbar--hashtags--hashtag.m-topbar--hashtags--hashtag--selected:not(.m-topbar--hashtags--hashtag--all)'));
    expect(hashtag1).not.toBeNull();
    expect(hashtag1.nativeElement.textContent).toContain('#hashtag1');


    let hashtag2 = fixture.debugElement.query(By.css('.m-topbar--hashtags > span.m-topbar--hashtags--hashtag:not(.m-topbar--hashtags--hashtag--selected):not(.m-topbar--hashtags--hashtag--all)'));
    expect(hashtag2).not.toBeNull();
    expect(hashtag2.nativeElement.textContent).toContain('#hashtag2');
  });

  it('should toggle the hashtag when clicked', () => {
    let hashtag1 = fixture.debugElement.query(By.css('.m-topbar--hashtags > span.m-topbar--hashtags--hashtag.m-topbar--hashtags--hashtag--selected'));

    hashtag1.nativeElement.click();

    fixture.detectChanges();

    expect(topbarHashtagsServiceMock.toggleSelection).toHaveBeenCalled();
  });

  it('should have a MORE button', () => {
    let button = fixture.debugElement.query(By.css('span.m-topbar--hashtags--select-more'));
    expect(button).not.toBeNull();
    expect(button.nativeElement.textContent).toContain('MORE');

    let tooltip = fixture.debugElement.query(By.css('span.m-topbar--hashtags--select-more m-tooltip'));
    expect(tooltip).not.toBeNull();
    expect(tooltip.nativeElement.textContent).toContain('Select the hashtags you wish to see more often');
  });

  it('should open the hashtags selector modal when clicking on MORE', () => {
    spyOn(comp, 'openModal').and.stub();

    let button = fixture.debugElement.query(By.css('span.m-topbar--hashtags--select-more'));

    button.nativeElement.click();

    expect(comp.openModal).toHaveBeenCalled();
  });

});
