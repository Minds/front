import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { NetworkAdminConsoleEditDomainModalComponent } from './edit-domain-modal.component';
import { MultiTenantDomainService } from '../../../../services/domain.service';
import { ToasterService } from '../../../../../../common/services/toaster.service';

describe('NetworkAdminConsoleEditDomainModalComponent', () => {
  let component: NetworkAdminConsoleEditDomainModalComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleEditDomainModalComponent>;

  const mockDomainService = jasmine.createSpyObj('MultiTenantDomainService', [
    'updateDomain',
  ]);
  const mockToasterService = jasmine.createSpyObj('ToasterService', ['error']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkAdminConsoleEditDomainModalComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        FormBuilder,
        { provide: MultiTenantDomainService, useValue: mockDomainService },
        { provide: ToasterService, useValue: mockToasterService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      NetworkAdminConsoleEditDomainModalComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate hostname correctly', () => {
    const hostnameControl = component.hostnameFormControl;

    // Valid hostnames:
    hostnameControl.setValue('example.com');
    expect(hostnameControl.valid).toBeTruthy();

    hostnameControl.setValue('blog.mysite.org');
    expect(hostnameControl.valid).toBeTruthy();

    hostnameControl.setValue('123.example.com');
    expect(hostnameControl.valid).toBeTruthy();

    hostnameControl.setValue('first.second.third.example.com');
    expect(hostnameControl.valid).toBeTruthy();

    hostnameControl.setValue('example.co.uk');
    expect(hostnameControl.valid).toBeTruthy();

    hostnameControl.setValue('a.b.c');
    expect(hostnameControl.valid).toBeTruthy();

    hostnameControl.setValue('a-b.com');
    expect(hostnameControl.valid).toBeTruthy();

    // Invalid hostnames:

    // Contains a space
    hostnameControl.setValue('example .com');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
    });

    // Too long
    hostnameControl.setValue('a'.repeat(264));
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
    });

    // Special character
    hostnameControl.setValue('example!com');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
    });

    // Starting with a hyphen
    hostnameControl.setValue('-example.com');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
    });

    // Ending with a hyphen
    hostnameControl.setValue('example-.com');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
    });

    // Invalid characters
    hostnameControl.setValue('example*com');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
    });

    hostnameControl.setValue('ex@mple.com');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
    });

    hostnameControl.setValue('example.com/');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
    });

    // Leading spaces
    hostnameControl.setValue(' example.com');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
    });

    // Trailing spaces
    hostnameControl.setValue('example.com ');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
    });

    // Subdomain too long
    hostnameControl.setValue('a'.repeat(64) + '.example.com');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
    });

    // Numerical TLD
    hostnameControl.setValue('example.123');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
    });

    // Multiple consecutive dots
    hostnameControl.setValue('example..com');
    expect(hostnameControl.errors).toEqual({ invalidUrl: true });
  });
});
