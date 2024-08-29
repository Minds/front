import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { NetworkAdminConsoleEditDomainModalComponent } from './edit-domain-modal.component';
import { MultiTenantDomainService } from '../../../../services/domain.service';
import { MockComponent } from '../../../../../../utils/mock';

describe('NetworkAdminConsoleEditDomainModalComponent', () => {
  let component: NetworkAdminConsoleEditDomainModalComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleEditDomainModalComponent>;

  const mockDomainService = jasmine.createSpyObj('MultiTenantDomainService', [
    'updateDomain',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleEditDomainModalComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['type', 'color', 'solid', 'disabled', 'saving'],
          outputs: ['onAction'],
        }),
        MockComponent({
          selector: 'm-modalCloseButton',
        }),
      ],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        FormBuilder,
        { provide: MultiTenantDomainService, useValue: mockDomainService },
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

    hostnameControl.setValue('test.a-b.com');
    expect(hostnameControl.valid).toBeTruthy();

    // Invalid hostnames:

    // Contains a space
    hostnameControl.setValue('example .com');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
      invalidSubdomain: true,
    });

    // Too long
    hostnameControl.setValue('a'.repeat(264));
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
      invalidSubdomain: true,
    });

    // Special character
    hostnameControl.setValue('example!com');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
      invalidSubdomain: true,
    });

    // Starting with a hyphen
    hostnameControl.setValue('-example.com');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
      invalidSubdomain: true,
    });

    // Ending with a hyphen
    hostnameControl.setValue('example-.com');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
      invalidSubdomain: true,
    });

    // Invalid characters
    hostnameControl.setValue('example*com');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
      invalidSubdomain: true,
    });

    hostnameControl.setValue('ex@mple.com');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
      invalidSubdomain: true,
    });

    hostnameControl.setValue('example.com/');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
      invalidSubdomain: true,
    });

    // Leading spaces
    hostnameControl.setValue(' example.com');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
      invalidSubdomain: true,
    });

    // Trailing spaces
    hostnameControl.setValue('example.com ');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
      invalidSubdomain: true,
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
      invalidSubdomain: true,
    });

    // Multiple consecutive dots
    hostnameControl.setValue('example..com');
    expect(hostnameControl.errors).toEqual({
      invalidUrl: true,
      invalidSubdomain: true,
    });

    // No subdomain
    hostnameControl.setValue('example.com');
    expect(hostnameControl.errors).toEqual({
      invalidSubdomain: true,
    });

    hostnameControl.setValue('a-b.com');
    expect(hostnameControl.errors).toEqual({
      invalidSubdomain: true,
    });

    // Minds domain
    hostnameControl.setValue('subdomain.minds.com');
    expect(hostnameControl.errors).toEqual({
      mindsDomain: true,
    });

    hostnameControl.setValue('other.subdomain.minds.com');
    expect(hostnameControl.errors).toEqual({
      mindsDomain: true,
    });

    hostnameControl.setValue('minds.com');
    expect(hostnameControl.errors).toEqual({
      mindsDomain: true,
      invalidSubdomain: true,
    });

    hostnameControl.setValue('minds.com/123');
    expect(hostnameControl.errors).toEqual({
      mindsDomain: true,
      invalidSubdomain: true,
      invalidUrl: true,
    });
  });

  it('should show prioritised error text', () => {
    const hostnameControl = component.hostnameFormControl;

    hostnameControl.setValue('minds.com');
    expect(hostnameControl.errors).toEqual({
      mindsDomain: true,
      invalidSubdomain: true,
    });
    expect((component as any).getFirstFormErrorText()).toBe(
      'Please use your own domain.'
    );

    hostnameControl.setValue('a-b.com');
    expect(hostnameControl.errors).toEqual({
      invalidSubdomain: true,
    });
    expect((component as any).getFirstFormErrorText()).toBe(
      'Root (Apex) domains require a business plan and custom configuration. Please use a subdomain at this time.'
    );

    hostnameControl.setValue('minds.com/123');
    expect(hostnameControl.errors).toEqual({
      mindsDomain: true,
      invalidSubdomain: true,
      invalidUrl: true,
    });
    expect((component as any).getFirstFormErrorText()).toBe(
      'This is an invalid domain name.'
    );
  });
});
