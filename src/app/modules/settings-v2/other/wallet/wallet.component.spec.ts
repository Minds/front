import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Session } from '../../../../services/session';
import { MockComponent, MockService } from '../../../../utils/mock';
import { SettingsV2WalletComponent } from './wallet.component';
import { SettingsV2WalletService } from './wallet.service';

let routerMock = new (function () {
  this.navigate = jasmine.createSpy('navigate');
})();

describe('SettingsV2WalletComponent', () => {
  let comp: SettingsV2WalletComponent;
  let fixture: ComponentFixture<SettingsV2WalletComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SettingsV2WalletComponent,
        MockComponent({
          selector: 'm-button',
        }),
        MockComponent({
          selector: 'm-formInput__checkbox',
        }),
      ],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Router, useValue: routerMock },
        {
          provide: SettingsV2WalletService,
          useValue: MockService(SettingsV2WalletService),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(SettingsV2WalletComponent);
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

  afterEach(() => {
    jasmine.clock().uninstall();
    sessionMock.loggedIn = true;
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should redirect if not logged in', () => {
    sessionMock.loggedIn = false;
    comp.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalled();
  });

  it('should correctly init the form control', () => {
    expect(comp.form).toBeTruthy();
  });

  it('should set inProgress to false when done initing', () => {
    comp.inProgress = true;
    comp.ngOnInit();
    expect(comp.inProgress).toBeFalsy();
  });

  it('should call to the service to submit and relay a success response when done', () => {
    comp.submit();
    expect((comp as any).service.setShouldHideWalletBalance).toHaveBeenCalled();
    expect((comp as any).toast.success).toHaveBeenCalledWith(
      'Successfully changed wallet privacy settings.'
    );
  });

  it('should have header', () => {
    const submitButton = fixture.debugElement.nativeElement.querySelector(
      '.m-settingsV2__headerLabel'
    );
    expect(submitButton).toBeTruthy();
  });

  it('should have back button', () => {
    const element = fixture.debugElement.nativeElement.querySelector(
      '.m-settingsV2__backButton'
    );
    expect(element).toBeTruthy();
  });

  it('should have title', () => {
    const element = fixture.debugElement.nativeElement.querySelector(
      '.m-settingsV2__backButton'
    );
    expect(element).toBeTruthy();
  });

  it('should have description', () => {
    const element = fixture.debugElement.nativeElement.querySelector(
      '.m-settingsV2Wallet__description'
    );
    expect(element).toBeTruthy();
  });
});
