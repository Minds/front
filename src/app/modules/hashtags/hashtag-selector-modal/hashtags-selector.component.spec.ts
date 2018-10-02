///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { HashtagsSelectorModalComponent } from './hashtags-selector.component';
import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { AbbrPipe } from '../../../common/pipes/abbr';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';

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
        { provide: Client, useValue: clientMock },
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
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
    clientMock.response = {};
    clientMock.response[`api/v2/hashtags/suggested`] = [{
      value: 'Thegreatmigration',
      selected: true,
    },
      {
        value: 'Thegreatmigration',
        selected: true,
      },
      {
        value: 'Thegreatmigration',
        selected: true,
      },
      {
        value: 'Thegreatmigration',
        selected: true,
      }];

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
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
    expect(title.nativeElement.textContent).toContain('Hashtags');
  });

  it('should have subtext', () => {
    const subtitle = fixture.debugElement.query(By.css('.m-hashtags-selector--header .m-hashtags-selector--subtext'));
    expect(subtitle).not.toBeNull();

    const call = clientMock.get.calls.mostRecent();
    expect(call.args[0]).toBe('api/v2/hashtags/suggested');

    comp.toggleSelection({
      selected: true,
      value: '22'
    });
    fixture.detectChanges();


    expect(clientMock.delete).toHaveBeenCalled();
    const deleteArgs = clientMock.delete.calls.mostRecent();
    expect(deleteArgs.args[0]).toBe('api/v2/hashtags/user/22');

    comp.toggleSelection({
      selected: false,
      value: '22'
    });
    fixture.detectChanges();


    expect(clientMock.post).toHaveBeenCalled();
    const putArgs = clientMock.post.calls.mostRecent();
    expect(putArgs.args[0]).toBe('api/v2/hashtags/user/22');

    expect(subtitle.nativeElement.textContent).toContain('Select the hashtags below that you wish to see more of. You can change these at anytime via your settings or by clicking on \'MORE\' at the top of any feed.');
  });

  it('should have a done button', () => {
    const button = fixture.debugElement.query(By.css('.m-hashtag-selector-section--last button.m-btn'));
    expect(button).not.toBeNull();
    expect(button.nativeElement.textContent).toContain('DONE');
  });

  it('clicking on done should close the modal', () => {
    const button = fixture.debugElement.query(By.css('.m-hashtag-selector-section--last button.m-btn'));
    button.nativeElement.click();

    expect(overlayModalServiceMock.dismiss).toHaveBeenCalled();
  });

});
