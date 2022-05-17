import { ReportService } from './../../../common/services/report.service';
///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { Directive, DebugElement } from '@angular/core';

import { ReportCreatorComponent } from './creator.component';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { clientMock } from '../../../../tests/client-mock.spec';
import { AbbrPipe } from '../../../common/pipes/abbr';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { FormsModule } from '@angular/forms';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { FormToastService } from '../../../common/services/form-toast.service';
import { MockService } from '../../../utils/mock';
import { ButtonComponent } from '../../../common/components/button/button.component';
import { ModalService } from '../../../services/ux/modal.service';
import { modalServiceMock } from '../../../../tests/modal-service-mock.spec';

/* tslint:disable */
@Directive({
  selector: '[mdlRadio]',
  inputs: ['mdlRadio', 'checked', 'mdlRadioValue'],
})
export class MdlRadioMock {}

describe('ReportCreatorComponent', () => {
  let comp: ReportCreatorComponent;
  let fixture: ComponentFixture<ReportCreatorComponent>;

  function getSubjectItem(i: number): DebugElement {
    return fixture.debugElement.queryAll(
      By.css(`.m-reportCreatorSubjects__subject`)
    )[i];
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MaterialMock,
          MdlRadioMock,
          MaterialSwitchMock,
          AbbrPipe,
          ReportCreatorComponent,
          ButtonComponent,
        ], // declare the test component
        imports: [FormsModule],
        providers: [
          { provide: Session, useValue: sessionMock },
          { provide: Client, useValue: clientMock },
          { provide: ModalService, useValue: modalServiceMock },
          {
            provide: FormToastService,
            useValue: MockService(FormToastService),
          },
          {
            provide: ReportService,
            useValue: {
              reasons: FAKE_REASONS,
            },
          },
        ],
      }).compileComponents(); // compile template and css
    })
  );

  // synchronous beforeEach
  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(ReportCreatorComponent);
    clientMock.response = {};
    fixture.detectChanges();
    comp = fixture.componentInstance;
    comp.guid = '1';

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
    const title = fixture.debugElement.query(
      By.css('.m-reportCreator__header h2 span')
    );
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain('Report');
  });

  xit('should have a disabled send button and get the guid from the object', () => {
    const button = fixture.debugElement.query(
      By.css('.m-reportCreator__submit m-button button')
    );
    expect(button.properties.disabled).toBe(true);
  });

  it('should have a subject list with the expected items', () => {
    const subjectList = fixture.debugElement.query(
      By.css('.m-reportCreator__subjects')
    );
    const subjectListInputs = fixture.debugElement.queryAll(
      By.css('.m-reportCreatorSubjects__subject')
    );
    expect(subjectList).not.toBeNull();
    expect(subjectListInputs.length).toBeGreaterThan(0);
  });

  it('once a item is clicked submit shouldnt be disabled', () => {
    const item = getSubjectItem(3);
    item.nativeElement.click();
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('.m-reportCreator__submit m-button button')
    );
    expect(comp.subject.value).toEqual(4);
    expect(button.properties.disabled).toBe(false);
  });

  it('once a item is clicked and is not submittable, next button should appear, and 2nd step', () => {
    const item = getSubjectItem(1);
    item.nativeElement.click();
    fixture.detectChanges();
    const next = fixture.debugElement.query(
      By.css('.m-reportCreator__submit--next m-button button')
    );
    expect(next).not.toBeNull();
    next.nativeElement.click();
    fixture.detectChanges();
    expect(comp.next).toBe(true);

    const subItem = getSubjectItem(1);
    subItem.nativeElement.click();
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('.m-reportCreator__submit m-button button')
    );
    expect(button.properties.disabled).toBe(false);
  });

  it('should show success msg after submission, calling with the expected params', fakeAsync(() => {
    clientMock.post.calls.reset();
    clientMock.response[`api/v2/moderation/report`] = {
      status: 'success',
      done: true,
    };

    spyOn(window, 'confirm').and.returnValue(true);

    const item = getSubjectItem(3);
    item.nativeElement.click();
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('.m-reportCreator__button--submit button')
    );
    expect(button.properties.disabled).toBe(false);
    button.nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      entity_guid: '1',
      reason_code: 4,
      sub_reason_code: null,
      note: '',
    });
    expect(comp.success).toBe(true);
    expect(comp.inProgress).toBe(false);
  }));

  it('should not show success if param is not true', fakeAsync(() => {
    clientMock.post.calls.reset();
    clientMock.response[`api/v2/moderation/report`] = {
      status: 'error',
      done: false,
      message: 'There was a probem',
    };

    spyOn(window, 'confirm').and.returnValue(true);

    spyOn(window, 'alert').and.callFake(function() {
      return true;
    });

    const item = getSubjectItem(3);
    item.nativeElement.click();
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('.m-reportCreator__button--submit button')
    );
    expect(button.properties.disabled).toBe(false);
    button.nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      entity_guid: '1',
      reason_code: 4,
      sub_reason_code: null,
      note: '',
    });
    expect(comp.success).toBe(false);
    expect(comp.inProgress).toBe(false);
  }));

  it('should show error msg after submission, calling with the expected params', fakeAsync(() => {
    clientMock.post.calls.reset();
    clientMock.response[`api/v2/moderation/report`] = {
      status: 'error',
      done: false,
      message: 'error message',
    };

    spyOn(window, 'confirm').and.returnValue(true);

    spyOn(window, 'alert').and.callFake(function() {
      return true;
    });

    const item = getSubjectItem(3);
    item.nativeElement.click();
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('.m-reportCreator__button--submit button')
    );
    expect(button.properties.disabled).toBe(false);
    button.nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      entity_guid: '1',
      reason_code: 4,
      sub_reason_code: null,
      note: '',
    });
    expect(comp.success).toBe(false);
    expect(comp.inProgress).toBe(false);
  }));

  /*it('should show error msg after submission, calling with the expected params', fakeAsync(() => {
    clientMock.post.calls.reset();
    clientMock.response[ `api/v1/entities/report/1` ] = {
      'status': 'error',
      done: false,
      'message': 'error message',
    };

    const item = getSubjectItem(1);
    item.nativeElement.click();
    fixture.detectChanges();
    comp.showErrors();
    fixture.detectChanges();
    comp.subject = null;
    comp.showErrors();
    fixture.detectChanges();
    expect(comp.error).toBe('There was an error sending your report.');
  }));*/

  it('once a item is clicked and its copyright one, next button should appear, and 2nd step should allow closing', () => {
    const item = getSubjectItem(7);
    item.nativeElement.click();
    fixture.detectChanges();
    const next = fixture.debugElement.query(
      By.css('.m-reportCreator__button--next button')
    );
    expect(next).not.toBeNull();
    next.nativeElement.click();
    expect(comp.subject.value).toEqual(10);
    expect(comp.next).toBe(true);
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('.m-reportCreator__button--close button')
    );
    expect(button).not.toBeNull();
    button.nativeElement.click();
  });

  it('should show footer if there is a reason label and description', () => {
    (comp as any).subject = {
      label: 'label',
      description: 'description',
    };
    comp.subReason = null;

    expect(comp.shouldShowFooter()).toBeTrue();
  });

  it('should show footer if there is a sub-reason label and description', () => {
    (comp as any).subject = {
      label: '',
      description: '',
    };
    (comp as any).subReason = {
      label: 'label',
      description: 'description',
    };

    expect(comp.shouldShowFooter()).toBeTrue();
  });

  it('should NOT show footer if there is NO reason & subreason label OR description', () => {
    (comp as any).subject = {
      label: '',
      description: '',
    };
    (comp as any).subReason = {
      label: '',
      description: '',
    };

    expect(comp.shouldShowFooter()).toBeFalse();
  });

  it('should get footer category name if there is a reason label', () => {
    (comp as any).subject = {
      label: 'subjectLabel',
      description: 'subjectDescription',
    };
    (comp as any).subReason = {
      label: '',
      description: '',
    };

    expect(comp.getFooterCategoryName()).toBe('subjectLabel');
  });

  it('should get footer category name if there is a sub-reason label', () => {
    (comp as any).subject = {
      label: '',
      description: '',
    };
    (comp as any).subReason = {
      label: 'subreasonLabel',
      description: 'subreasonDescription',
    };

    expect(comp.getFooterCategoryName()).toBe('subreasonLabel');
  });

  it('should get footer category description if there is a reason description', () => {
    (comp as any).subject = {
      label: 'subjectLabel',
      description: 'subjectDescription',
    };
    (comp as any).subReason = {
      label: '',
      description: '',
    };

    expect(comp.getFooterCategoryDescription()).toBe('subjectDescription');
  });

  it('should get footer category description if there is a sub-reason description', () => {
    (comp as any).subject = {
      label: '',
      description: '',
    };
    (comp as any).subReason = {
      label: 'subreasonLabel',
      description: 'subreasonDescription',
    };

    expect(comp.getFooterCategoryDescription()).toBe('subreasonDescription');
  });
});

const FAKE_REASONS = [
  {
    value: 1,
    label: 'Illegal',
    hasMore: true,
    reasons: [
      {
        value: 1,
        label: 'Terrorism',
      },
      {
        value: 2,
        label: 'Sexualization of minors',
      },
      {
        value: 3,
        label: 'Extortion',
      },
      {
        value: 4,
        label: 'Fraud',
      },
      {
        value: 5,
        label: 'Revenge Porn',
      },
      {
        value: 6,
        label: 'Trafficking',
      },
    ],
  },
  {
    value: 2,
    label: 'NSFW (not safe for work)',
    hasMore: true,
    reasons: [
      {
        value: 1,
        label: 'Nudity',
      },
      {
        value: 2,
        label: 'Pornography',
      },
      {
        value: 3,
        label: 'Profanity',
      },
      {
        value: 4,
        label: 'Violance and Gore',
      },
      {
        value: 5,
        label: 'Race, Religion, Gender',
      },
    ],
  },
  {
    value: 3,
    label: 'Incitement to violence',
    hasMore: false,
  },
  {
    value: 4,
    label: 'Harassment',
    hasMore: false,
  },
  {
    value: 5,
    label: 'Personal and confidential information',
    hasMore: false,
  },
  {
    value: 7,
    label: 'Impersonation',
    hasMore: false,
  },
  {
    value: 8,
    label: 'Spam',
    hasMore: false,
  },
  {
    value: 10,
    label: 'Intellectual Property violation',
    hasMore: true,
  },
  {
    value: 13,
    label: 'Malware',
    hasMore: false,
  },
  {
    value: 16,
    label: 'Inauthentic engagement',
    hasMore: false,
  },
  {
    value: 17,
    label: 'Security',
    hasMore: true,
    reasons: [
      {
        value: 1,
        label: 'Hacked account',
      },
    ],
  },
  {
    value: 11,
    label: 'Another reason',
    hasMore: true,
  },
];
