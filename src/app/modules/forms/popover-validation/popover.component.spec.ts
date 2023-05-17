import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { PopoverComponent } from './popover.component';
import { Client } from '../../../services/api';
import { MockComponent, MockService } from '../../../utils/mock';

describe('PopoverComponent', () => {
  let comp: PopoverComponent;
  let fixture: ComponentFixture<PopoverComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          PopoverComponent,
          MockComponent({
            selector: 'm-loadingSpinner',
            inputs: ['inProgress'],
          }),
          MockComponent({
            selector: 'm-tooltip',
          }),
          MockComponent({
            selector: 'm-sizeableLoadingSpinner',
            inputs: ['inProgress', 'spinnerHeight', 'spinnerWidth'],
          }),
        ],
        providers: [
          {
            provide: ChangeDetectorRef,
            useValue: MockService(ChangeDetectorRef),
          },
          {
            provide: Client,
            useValue: MockService(Client),
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(PopoverComponent);
      comp = fixture.componentInstance;

      fixture.detectChanges();
    })
  );

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  it('should call checkSynchronousValidators when the password is set', () => {
    spyOn(comp, 'checkSynchronousValidators');
    comp.password = 'TestPassword';
    expect(comp.checkSynchronousValidators).toHaveBeenCalled();
  });

  it('should not call checkSynchronousValidators when the password is empty', () => {
    spyOn(comp, 'checkSynchronousValidators');
    comp.password = '';
    expect(comp.checkSynchronousValidators).not.toHaveBeenCalled();
  });

  it('should update riskCheck and riskCheckInProgress based on the input value', () => {
    comp.riskCheckStatus = 'PENDING';
    expect(comp.riskCheck).toBeFalse();
    expect(comp.riskCheckInProgress).toBeTrue();

    comp.riskCheckStatus = 'VALID';
    expect(comp.riskCheck).toBeTrue();
    expect(comp.riskCheckInProgress).toBeFalse();

    comp.riskCheckStatus = 'INVALID';
    expect(comp.riskCheck).toBeFalse();
    expect(comp.riskCheckInProgress).toBeFalse();
  });

  it('should reset riskCheck and riskCheckInProgress when input is undefined', () => {
    comp.riskCheckStatus = undefined;
    expect(comp.riskCheck).toBeFalse();
    expect(comp.riskCheckInProgress).toBeFalse();
  });

  it('should add the visible class when show is called', () => {
    comp.password = 'TestPassword';
    fixture.detectChanges();

    comp.show();
    expect(
      comp.content.nativeElement.classList.contains(
        'm-popover__content--visible'
      )
    ).toBeTrue();
  });

  it('should remove the visible class when hide is called', () => {
    comp.password = 'TestPassword';
    fixture.detectChanges();

    comp.show();
    comp.hide();
    expect(
      comp.content.nativeElement.classList.contains(
        'm-popover__content--visible'
      )
    ).toBeFalse();
  });

  it('should remove the visible class when hideWithDelay is called', fakeAsync(() => {
    comp.password = 'TestPassword';
    fixture.detectChanges();

    comp.show();
    comp.hideWithDelay();
    tick(800);

    expect(
      comp.content.nativeElement.classList.contains(
        'm-popover__content--visible'
      )
    ).toBeFalse();
  }));

  it('should update synchronous validation checks based on the password', () => {
    comp.password = 'TestPassword1!';

    comp.checkSynchronousValidators();
    expect(comp.lengthCheck).toBeTrue();
    expect(comp.specialCharCheck).toBeTrue();
    expect(comp.mixedCaseCheck).toBeTrue();
    expect(comp.numbersCheck).toBeTrue();
    expect(comp.spacesCheck).toBeTrue();
  });

  it('should return true when all synchronous checks are valid', () => {
    comp.password = 'TestPassword1!';
    comp.checkSynchronousValidators();
    expect(comp.synchronousChecksValid).toBeTrue();
  });

  it('should return false when any synchronous check is invalid', () => {
    comp.password = 'testpassword';
    comp.checkSynchronousValidators();
    expect(comp.synchronousChecksValid).toBeFalse();
  });

  it('should return true when all synchronous checks and risk check are valid', () => {
    comp.password = 'TestPassword1!';
    comp.checkSynchronousValidators();
    comp.riskCheckStatus = 'VALID';
    expect(comp.allChecksValid).toBeTrue();
  });

  it('should return false when any synchronous check or risk check is invalid', () => {
    comp.password = 'testpassword';
    comp.checkSynchronousValidators();
    comp.riskCheckStatus = 'INVALID';
    expect(comp.allChecksValid).toBeFalse();
  });
});
