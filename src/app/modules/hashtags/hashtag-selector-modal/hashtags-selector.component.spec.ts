///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { HashtagsSelectorModalComponent } from './hashtags-selector.component';
import { AbbrPipe } from '../../../common/pipes/abbr';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { TopbarHashtagsService } from '../service/topbar.service';
import { topbarHashtagsServiceMock } from '../../../mocks/modules/hashtags/service/topbar.service.mock';

describe('HashtagsSelectorModalComponent', () => {

  let comp: HashtagsSelectorModalComponent;
  let fixture: ComponentFixture<HashtagsSelectorModalComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MaterialMock,
        MaterialSwitchMock,
        AbbrPipe,
        HashtagsSelectorModalComponent,
      ],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
        { provide: TopbarHashtagsService, useValue: topbarHashtagsServiceMock }
      ]
    })
      .compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(HashtagsSelectorModalComponent);

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
      }];

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

  it('should have a title', () => {
    const title = fixture.debugElement.query(By.css('.m-hashtags-selector--header h3'));
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain('Personalize your feed');
  });

  it('should have subtext', () => {
    const subtitle = fixture.debugElement.query(By.css('.m-hashtags-selector--header .m-hashtags-selector--subtext'));
    expect(subtitle).not.toBeNull();

    expect(topbarHashtagsServiceMock.load).toHaveBeenCalled();

    comp.toggleSelection({
      selected: true,
      value: '22'
    });
    fixture.detectChanges();

    expect(topbarHashtagsServiceMock.toggleSelection).toHaveBeenCalled();

    comp.toggleSelection({
      selected: false,
      value: '22'
    });
    fixture.detectChanges();

    expect(topbarHashtagsServiceMock.toggleSelection).toHaveBeenCalled();

    expect(subtitle.nativeElement.textContent).toContain("Select the hashtags below that you wish to see more of. The hashtags you select will be pinned to the top bar of your feed. You can change these at anytime via your settings or by clicking on 'MORE' at the top of any feed");
  });

  it('should create a hashtag', () => {
    const subtitle = fixture.debugElement.query(By.css('.m-hashtags-selector--header .m-hashtags-selector--subtext'));
    expect(subtitle).not.toBeNull();

    comp.input = 'Newhastag';
    comp.addNew();
    fixture.detectChanges();

    expect(topbarHashtagsServiceMock.toggleSelection).toHaveBeenCalled();

    expect(subtitle.nativeElement.textContent).toContain("Select the hashtags below that you wish to see more of. The hashtags you select will be pinned to the top bar of your feed. You can change these at anytime via your settings or by clicking on 'MORE' at the top of any feed");
  });

  it('should create a hashtag and be case insensitive', () => {
    const subtitle = fixture.debugElement.query(By.css('.m-hashtags-selector--header .m-hashtags-selector--subtext'));
    expect(subtitle).not.toBeNull();

    comp.input = "UpperCaseDoesn'tMatter";
    comp.addNew();

    fixture.detectChanges();

    expect(comp.hashtags.findIndex((item) => item.value === "uppercasedoesntmatter")).not.toBe(-1);

    expect(topbarHashtagsServiceMock.toggleSelection).toHaveBeenCalled();

    expect(subtitle.nativeElement.textContent).toContain("Select the hashtags below that you wish to see more of. The hashtags you select will be pinned to the top bar of your feed. You can change these at anytime via your settings or by clicking on 'MORE' at the top of any feed");
  });

  it('should have a done button', () => {
    const button = fixture.debugElement.query(By.css('i.m-hashtag--creator--done'));
    console.warn(comp.inProgress);
    expect(button).not.toBeNull();
    expect(button.nativeElement.textContent).toContain('done');
  });

  it('clicking on done should close the modal', () => {
    const button = fixture.debugElement.query(By.css('i.m-hashtag--creator--close'));
    button.nativeElement.click();

    expect(comp.addingHashtag).toBeFalsy();
  });

});
