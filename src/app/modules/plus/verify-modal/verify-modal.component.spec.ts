///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { PlusVerifyModalComponent } from './verify-modal.component';
import { TooltipComponentMock } from '../../../mocks/common/components/tooltip/tooltip.component';
import { ModalMock } from '../../../mocks/common/components/modal/modal';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '../../../common/components/button/button.component';
import { ToasterService } from '../../../common/services/toaster.service';
import { MockService } from '../../../utils/mock';

describe('PlusVerifyModalComponent', () => {
  let comp: PlusVerifyModalComponent;
  let fixture: ComponentFixture<PlusVerifyModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          PlusVerifyModalComponent,
          TooltipComponentMock,
          ModalMock,
          ButtonComponent,
        ],
        imports: [RouterTestingModule, FormsModule, ReactiveFormsModule],
        providers: [
          { provide: Client, useValue: clientMock },
          { provide: ToasterService, useValue: MockService(ToasterService) },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(PlusVerifyModalComponent);
    comp = fixture.componentInstance;

    // Set up mock HTTP client
    clientMock.response = {};

    clientMock.response['api/v1/plus/verify'] = {
      status: 'success',
      channel: {
        guid: 'guidguid',
        name: 'name',
        username: 'username',
        icontime: 11111,
        subscribers_count: 182,
        impressions: 18200,
      },
    };

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
    // reset jasmine clock after each test
    jasmine.clock().uninstall();
  });

  it('Should load correctly', () => {
    const modal = fixture.debugElement.query(By.css('.m-plus--verify'));
    expect(modal).not.toBeNull();
    expect(comp.form).not.toBeNull();
  });

  it('Should load correctly and call endpoint', () => {
    comp.submit({});
    fixture.detectChanges();
    expect(clientMock.post.calls.mostRecent().args[0]).toEqual(
      'api/v1/plus/verify'
    );
  });
});
