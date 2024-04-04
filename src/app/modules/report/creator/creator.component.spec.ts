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
import { ToasterService } from '../../../common/services/toaster.service';
import { MockComponent, MockService } from '../../../utils/mock';
import { ButtonComponent } from '../../../common/components/button/button.component';
import { ModalService } from '../../../services/ux/modal.service';
import { modalServiceMock } from '../../../../tests/modal-service-mock.spec';
import { PlusTierUrnService } from '../../../common/services/plus-tier-urn.service';
import { GraphQLReportCreatorService } from './services/graphql-report-creator.service';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import {
  IllegalSubReasonEnum,
  ReportReasonEnum,
} from '../../../../graphql/generated.engine';
import { of } from 'rxjs';
import { WINDOW } from '../../../common/injection-tokens/common-injection-tokens';

/* tslint:disable */
@Directive({
  selector: '[mdlRadio]',
  inputs: ['mdlRadio', 'checked', 'mdlRadioValue'],
})
export class MdlRadioMock {}

describe('ReportCreatorComponent', () => {
  let comp: ReportCreatorComponent;
  let fixture: ComponentFixture<ReportCreatorComponent>;
  let isTenantNetwork: boolean = false;

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
          MockComponent({
            selector: 'm-modalCloseButton',
          }),
        ], // declare the test component
        imports: [FormsModule],
        providers: [
          { provide: Session, useValue: MockService(Session) },
          { provide: Client, useValue: clientMock },
          { provide: ModalService, useValue: modalServiceMock },
          {
            provide: ToasterService,
            useValue: MockService(ToasterService),
          },
          {
            provide: ReportService,
            useValue: {
              reasons: FAKE_REASONS,
            },
          },
          {
            provide: PlusTierUrnService,
            useValue: MockService(PlusTierUrnService),
          },
          {
            provide: GraphQLReportCreatorService,
            useValue: MockService(GraphQLReportCreatorService),
          },
          {
            provide: IS_TENANT_NETWORK,
            useValue: isTenantNetwork,
          },
          {
            provide: WINDOW,
            useValue: {
              open: jasmine.createSpy('open'),
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

    comp = fixture.componentInstance;
    comp.setModalData({
      entity: {
        guid: '1',
      },
    });
    (comp as any).session.isAdmin.and.returnValue(false);
    (comp as any).graphQLReportCreatorService.createNewReport.calls.reset();
    (comp as any).isTenantNetwork = true;

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
    (comp as any).isTenantNetwork = false;
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
      entity_urn: null,
      reason_code: 4,
      sub_reason_code: null,
      note: '',
    });
    expect(comp.success).toBe(true);
    expect(comp.inProgress).toBe(false);
  }));

  it('should not show success if param is not true', fakeAsync(() => {
    (comp as any).isTenantNetwork = false;
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
      entity_urn: null,
      reason_code: 4,
      sub_reason_code: null,
      note: '',
    });
    expect(comp.success).toBe(false);
    expect(comp.inProgress).toBe(false);
  }));

  it('should show error msg after submission, calling with the expected params', fakeAsync(() => {
    (comp as any).isTenantNetwork = false;
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
      entity_urn: null,
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
    (comp as any).session.isAdmin.and.returnValue(false);
    (comp as any).isTenantNetwork = false;
    fixture.detectChanges();

    const item = getSubjectItem(7);
    item.nativeElement.click();

    fixture.detectChanges();
    const next = fixture.debugElement.query(
      By.css('.m-reportCreator__button--dmca button')
    );
    expect(next).not.toBeNull();

    spyOn(window, 'open').and.callFake(function(url, tss) {
      return window;
    });
    next.nativeElement.click();

    expect((comp as any).window.open).toHaveBeenCalledWith('/p/dmca', '_blank');
    expect((comp as any).modalService.dismissAll).toHaveBeenCalled();
  });

  it('admins should see next button for copyright', () => {
    (comp as any).session.isAdmin.and.returnValue(true);
    fixture.detectChanges();

    const item = getSubjectItem(7);
    item.nativeElement.click();

    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(
      By.css('.m-reportCreator__button--submit button')
    );

    expect(submitButton).not.toBeNull();
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

  it('should get default footer category name if no reason is selected', () => {
    (comp as any).subject = {
      label: '',
      description: '',
    };
    (comp as any).subReason = {
      label: '',
      description: '',
    };

    expect(comp.getFooterCategoryName()).toBe('Report Reasons');
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

  it('should get default category description if no reason is selected', () => {
    (comp as any).subject = {
      label: '',
      description: '',
    };
    (comp as any).subReason = {
      label: '',
      description: '',
    };

    expect(comp.getFooterCategoryDescription()).toBe(
      'Select a reason above to complete your report'
    );
  });

  it('should get default category description if a reason is selected without a selected subreason', () => {
    (comp as any).subject = {
      label: '~label~',
      description: '',
      hasMore: true,
    };
    (comp as any).subReason = {
      label: '',
      description: '',
    };

    expect(comp.getFooterCategoryDescription()).toBe(
      'Select a sub-reason to complete your report'
    );
  });

  it('should have plus policy violation reason for plus entity', () => {
    const entityUrn: string = 'plus:entity:urn';
    (comp as any).plusTierUrn.isPlusTierUrn.and.returnValue(true);

    comp.setModalData({
      entity: {
        guid: '1',
        wire_threshold: {
          support_tier: {
            urn: entityUrn,
          },
        },
      },
    });

    fixture.detectChanges();

    const spans = fixture.debugElement.queryAll(
      By.css(`.m-reportCreatorSubjects__subject span`)
    );
    const span = spans.find(span =>
      span.nativeElement.textContent.includes('Violates Premium Content policy')
    );
    expect((comp as any).plusTierUrn.isPlusTierUrn).toHaveBeenCalledWith(
      entityUrn
    );
    expect(span).toBeDefined();
  });

  it('should NOT have plus policy violation reason for NON plus membership entity', () => {
    const entityUrn: string = 'plus:entity:urn';

    comp.setModalData({
      entity: {
        guid: '1',
        wire_threshold: {
          support_tier: {
            urn: `non:${entityUrn}`,
          },
        },
      },
    });
    fixture.detectChanges();

    const spans = fixture.debugElement.queryAll(
      By.css(`.m-reportCreatorSubjects__subject span`)
    );
    const span = spans.find(span =>
      span.nativeElement.textContent.includes('Violates Premium Content policy')
    );
    expect(span).toBeUndefined();
  });

  it('should NOT have plus policy violation reason for NON membership entity', () => {
    comp.setModalData({
      entity: {
        guid: '1',
      },
    });
    fixture.detectChanges();

    const spans = fixture.debugElement.queryAll(
      By.css(`.m-reportCreatorSubjects__subject span`)
    );
    const span = spans.find(span =>
      span.nativeElement.textContent.includes('Violates Premium Content policy')
    );
    expect(span).toBeUndefined();
  });

  it('should report for a tenant network', fakeAsync(() => {
    (comp as any).subject = { value: 1 };
    (comp as any).subReason = { value: 2 };
    (comp as any).urn = 'urn:activity:123';
    (comp as any).isTenantNetwork = true;
    (comp as any).graphQLReportCreatorService.mapLegacyReasonToEnums.and.returnValue(
      {
        reason: ReportReasonEnum.Illegal,
        illegalSubReason: IllegalSubReasonEnum.Extortion,
      }
    );
    (comp as any).graphQLReportCreatorService.createNewReport.and.returnValue(
      of(true)
    );
    fixture.detectChanges();

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

    expect(
      (comp as any).graphQLReportCreatorService.mapLegacyReasonToEnums
    ).toHaveBeenCalledWith(4, 2);
    expect(
      (comp as any).graphQLReportCreatorService.createNewReport
    ).toHaveBeenCalledWith({
      entityUrn: 'urn:activity:123',
      reason: ReportReasonEnum.Illegal,
      illegalSubReason: IllegalSubReasonEnum.Extortion,
    });
    expect(comp.success).toBe(true);
    expect(comp.inProgress).toBe(false);
  }));
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
    label: 'Intellectual property violation',
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
  {
    value: 18,
    label: 'Violates Premium Content policy',
    hasMore: false,
  },
];
