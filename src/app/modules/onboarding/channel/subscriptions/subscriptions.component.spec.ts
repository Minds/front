import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriptionsOnboardingComponent } from './subscriptions.component';
import { MockComponent } from '../../../../utils/mock';
import { Client } from '../../../../services/api/client';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { Upload } from '../../../../services/api/upload';
import { uploadMock } from '../../../../../tests/upload-mock.spec';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('SubscriptionsOnboardingComponent', () => {
  let comp: SubscriptionsOnboardingComponent;
  let fixture: ComponentFixture<SubscriptionsOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        MockComponent({
          selector: 'm-suggestions__sidebar',
          inputs: [],
          outputs: [],
        }),
        SubscriptionsOnboardingComponent,
      ],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: Upload, useValue: uploadMock },
        { provide: Session, useValue: sessionMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(SubscriptionsOnboardingComponent);

    clientMock.response = {};

    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have a title', () => {
    expect(
      fixture.debugElement.query(By.css('h2')).nativeElement.textContent
    ).toBe('Subscribe to some popular channels');
  });

  it('should have an instance of m-suggestions__sidebar', () => {
    expect(
      fixture.debugElement.query(By.css('m-suggestions__sidebar'))
    ).not.toBeNull();
  });
});
