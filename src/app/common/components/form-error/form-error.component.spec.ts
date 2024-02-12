import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormErrorComponent } from './form-error.component';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { take } from 'rxjs';

describe('FormErrorComponent', () => {
  let fixture: ComponentFixture<FormErrorComponent>;
  let comp: FormErrorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [FormErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormErrorComponent);
    comp = fixture.componentInstance;
  });

  it('should create the FormErrorComponent', () => {
    expect(comp).toBeTruthy();
  });

  it('should not display error when there is no error', () => {
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('div'));
    expect(errorElement).toBeNull();
  });

  it('should display error for required field', (done: DoneFn) => {
    comp.errors = { required: true };

    (comp as any).errorString$
      .pipe(take(1))
      .subscribe((errorString: string) => {
        expect(errorString).toBe('Cannot be blank.');
        done();
      });
  });

  it('should display error for minlength', (done: DoneFn) => {
    comp.errors = { minlength: { requiredLength: 5 } };

    (comp as any).errorString$
      .pipe(take(1))
      .subscribe((errorString: string) => {
        expect(errorString).toBe('Must be at least 5 characters long.');
        done();
      });
  });

  it('should display error for maxlength', (done: DoneFn) => {
    comp.errors = { maxlength: { requiredLength: 10 } };

    (comp as any).errorString$
      .pipe(take(1))
      .subscribe((errorString: string) => {
        expect(errorString).toBe('Must be at most 10 characters long.');
        done();
      });
  });

  it('should display error for max', (done: DoneFn) => {
    comp.errors = { max: { max: 10 } };

    (comp as any).errorString$
      .pipe(take(1))
      .subscribe((errorString: string) => {
        expect(errorString).toBe('Must not be more than 10.');
        done();
      });
  });

  it('should display error for min', (done: DoneFn) => {
    comp.errors = { min: { min: 10 } };

    (comp as any).errorString$
      .pipe(take(1))
      .subscribe((errorString: string) => {
        expect(errorString).toBe('Must not be less than 10.');
        done();
      });
  });

  it('should display custom error message', (done: DoneFn) => {
    const errorMessage: string = 'Custom error message';
    comp.errors = { customMessage: errorMessage };

    (comp as any).errorString$
      .pipe(take(1))
      .subscribe((errorString: string) => {
        expect(errorString).toBe(errorMessage + '.');
        done();
      });
  });

  it('should display multiple error messages', (done: DoneFn) => {
    const customErrorMessage: string = 'Custom error message';
    comp.errors = {
      customMessage: customErrorMessage,
      minlength: { requiredLength: 5 },
      maxlength: { requiredLength: 10 },
    };

    (comp as any).errorString$
      .pipe(take(1))
      .subscribe((errorString: string) => {
        expect(errorString).toBe(
          'Must be at least 5 characters long. Must be at most 10 characters long. Custom error message.'
        );
        done();
      });
  });
});
