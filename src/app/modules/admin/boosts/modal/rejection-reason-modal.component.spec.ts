import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  Component,
  DebugElement,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { RejectionReasonModalComponent } from './rejection-reason-modal.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../common/components/button/button.component';

@Component({
  selector: 'm-modal',
  template: '<ng-content></ng-content>',
})
class MindsModalMock {
  @Input() open: any;
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
}

describe('RejectionReasonModalComponent', () => {
  let comp: RejectionReasonModalComponent;
  let fixture: ComponentFixture<RejectionReasonModalComponent>;
  let confirmButton: DebugElement;

  function getNoButton(): DebugElement {
    return fixture.debugElement.query(
      By.css('.m-modal-reasons--no-button button')
    );
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MindsModalMock,
          RejectionReasonModalComponent,
          ButtonComponent,
        ], // declare the test component
        imports: [NgCommonModule, FormsModule],
      }).compileComponents(); // compile template and css
    })
  );

  // synchronous beforeEach
  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(RejectionReasonModalComponent);

    comp = fixture.componentInstance; // RejectionReasonModalComponent test instance

    comp.boost = {
      guid: '123',
      _id: '59ba98d3b13628293d705ff2',
      entity: {
        guid: '752893213072691218',
        type: 'activity',
        time_created: '1504879730',
        time_updated: '1504879730',
        container_guid: '732337264197111809',
        owner_guid: '732337264197111809',
        access_id: '2',
        title: false,
        blurb: false,
        perma_url: false,
        message: '',
        ownerObj: {
          guid: '732337264197111809',
          type: 'user',
          access_id: '2',
          name: 'minds',
          username: 'minds',
          mature: '0',
          boost_rating: '1',
        },
      },
      state: 'created',
      rejection_reason: -1,
    };

    comp.noButton = 'No';

    confirmButton = fixture.debugElement.query(
      By.css('.m-modal-confirm-buttons > m-button:first-child button')
    );

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

  it('should have a m-modal component', () => {
    expect(fixture.debugElement.query(By.css('m-modal'))).not.toBeNull();
  });

  it('should have a title', () => {
    const title: DebugElement = fixture.debugElement.query(
      By.css('h5.m-modal-reasons--title')
    );
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain(
      'Specify a reason for the rejection'
    );
  });

  it('should have a reasons list', () => {
    const list: DebugElement = fixture.debugElement.query(
      By.css('ul.m-modal-reasons--reasons')
    );
    expect(list).not.toBeNull();
  });

  it('clicking on a reason should select it', () => {
    spyOn(comp, 'selectReason').and.callThrough();
    const listItem: DebugElement = fixture.debugElement.query(
      By.css('ul.m-modal-reasons--reasons > li:first-child')
    );
    expect(listItem).not.toBeNull();

    listItem.nativeElement.click();
    fixture.detectChanges();

    expect(listItem.nativeElement.classList).toContain('selected');
    expect(comp.selectReason).toHaveBeenCalled();
  });

  it('should have a confirm button', () => {
    confirmButton = fixture.debugElement.query(
      By.css('.m-modal-confirm-buttons > m-button:first-child button')
    );

    expect(confirmButton).not.toBeNull();
  });
  it('confirm button should be disabled if no reason is selected', () => {
    confirmButton = fixture.debugElement.query(
      By.css('.m-modal-confirm-buttons > m-button:first-child button')
    );

    expect(confirmButton.nativeElement.disabled).toBeTruthy();
  });
  it('clicking on confirm button should call action()', () => {
    confirmButton = fixture.debugElement.query(
      By.css('.m-modal-confirm-buttons > m-button:first-child button')
    );
    const listItem: DebugElement = fixture.debugElement.query(
      By.css('ul.m-modal-reasons--reasons > li:first-child')
    );
    listItem.nativeElement.click();

    fixture.detectChanges();

    spyOn(comp, 'action').and.stub();
    confirmButton.nativeElement.click();
    fixture.detectChanges();

    expect(comp.action).toHaveBeenCalled();
  });
  it('should have a no button', () => {
    expect(getNoButton()).not.toBeNull();
  });
  it('clicking on no button should call close()', () => {
    spyOn(comp, 'close').and.stub();
    getNoButton().nativeElement.click();
    fixture.detectChanges();

    expect(comp.close).toHaveBeenCalled();
  });

  it('should filter out deprecated options', () => {
    expect(comp.reasons).toEqual([
      { code: 0, label: 'Illegal' },
      { code: 1, label: 'Explicit' },
      { code: 2, label: 'Encourages or incites violence' },
      {
        code: 3,
        label: 'Threatens, harasses, bullies or encourages others to do so',
      },
      { code: 4, label: 'Personal and confidential information' },
      {
        code: 5,
        label: 'Maliciously targets users (@name, links, images or videos)',
      },
      {
        code: 6,
        label: 'Impersonates someone in a misleading or deceptive manner',
      },
      { code: 7, label: 'Spam' },
      { code: 8, label: 'Appeals on Boost decisions' },
      { code: 13, label: 'Original post removed' },
      { code: 14, label: 'High Boost backlog' },
      { code: 15, label: 'Support Request' },
      { code: 16, label: 'Onchain payment failed' },
    ]);
  });
});
