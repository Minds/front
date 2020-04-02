import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TopicsOnboardingComponent } from './topics.component';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { topbarHashtagsServiceMock } from '../../../../mocks/modules/hashtags/service/topbar.service.mock';
import { MaterialMock } from '../../../../../tests/material-mock.spec';
import { MaterialSwitchMock } from '../../../../../tests/material-switch-mock.spec';
import { AbbrPipe } from '../../../../common/pipes/abbr';
import { TopbarHashtagsService } from '../../../hashtags/service/topbar.service';

describe('TopicsOnboardingComponent', () => {
  let comp: TopicsOnboardingComponent;
  let fixture: ComponentFixture<TopicsOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        MaterialMock,
        MaterialSwitchMock,
        AbbrPipe,
        TopicsOnboardingComponent,
      ],
      providers: [
        { provide: TopbarHashtagsService, useValue: topbarHashtagsServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(TopicsOnboardingComponent);

    clientMock.response = {};

    comp = fixture.componentInstance;

    topbarHashtagsServiceMock.loadResponse = [
      {
        value: 'thegreatmigration',
        selected: true,
      },
      {
        value: 'thegreatmigration',
        selected: true,
      },
      {
        value: 'thegreatmigration',
        selected: true,
      },
      {
        value: 'thegreatmigration',
        selected: true,
      },
    ];

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

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have text', () => {
    expect(
      fixture.debugElement.query(By.css('h2:first-child')).nativeElement
        .textContent
    ).toContain('Welcome to Minds!');
    expect(
      fixture.debugElement.query(By.css('h2.m-channelOnboardingSlide__subtext'))
        .nativeElement.textContent
    ).toContain('What topics are you most interested in?');
  });

  it('should create a hashtag', () => {
    comp.input = 'Newhastag';
    comp.addNew();
    fixture.detectChanges();

    expect(topbarHashtagsServiceMock.toggleSelection).toHaveBeenCalled();
  });

  it('should create a hashtag and be case insensitive', () => {
    comp.input = "UpperCaseDoesn'tMatter";
    comp.addNew();

    fixture.detectChanges();

    expect(
      comp.hashtags.findIndex(item => item.value === 'uppercasedoesntmatter')
    ).not.toBe(-1);

    expect(topbarHashtagsServiceMock.toggleSelection).toHaveBeenCalled();
  });

  it('should have a done button', () => {
    const button = fixture.debugElement.query(
      By.css('i.m-hashtag--creator--done')
    );
    expect(button).not.toBeNull();
    expect(button.nativeElement.textContent).toContain('done');
  });

  it('clicking on done should close the modal', () => {
    const button = fixture.debugElement.query(
      By.css('i.m-hashtag--creator--close')
    );
    button.nativeElement.click();

    expect(comp.addingHashtag).toBeFalsy();
  });
});
