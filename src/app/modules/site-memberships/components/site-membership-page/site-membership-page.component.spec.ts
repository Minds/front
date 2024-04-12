import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { SiteMembershipPageComponent } from './site-membership-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { SiteMembershipService } from '../../services/site-memberships.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SiteMembershipPageComponent', () => {
  let component: SiteMembershipPageComponent;
  let fixture: ComponentFixture<SiteMembershipPageComponent>;
  let mockSiteMembershipService: jasmine.SpyObj<SiteMembershipService>;
  let mockToasterService: jasmine.SpyObj<ToasterService>;
  let router: Router;

  beforeEach(async () => {
    mockSiteMembershipService = jasmine.createSpyObj(
      'SiteMembershipService',
      ['fetch', 'loadMembershipByGuid'],
      {
        siteMembershipSubscriptionGuids$: of(['123']),
        isMember$: of(true),
      }
    );
    mockToasterService = jasmine.createSpyObj('ToasterService', ['error']);

    await TestBed.configureTestingModule({
      declarations: [SiteMembershipPageComponent],
      providers: [
        { provide: SiteMembershipService, useValue: mockSiteMembershipService },
        { provide: ToasterService, useValue: mockToasterService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['membershipGuid', '123']])),
          },
        },
      ],
      imports: [RouterTestingModule.withRoutes([])],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteMembershipPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate to memberships page if membershipGuid not provided', fakeAsync(() => {
    mockSiteMembershipService.loadMembershipByGuid.and.returnValue(of(null));
    component.ngOnInit();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/memberships'], {
      queryParams: { membershipRedirect: 'true' },
    });

    flush();
  }));

  it('should display error and redirect if failed to load membership details', fakeAsync(() => {
    mockSiteMembershipService.loadMembershipByGuid.and.returnValue(of(null));
    component.ngOnInit();
    tick();
    expect(mockToasterService.error).toHaveBeenCalledWith(
      'Failed to load membership details'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/memberships'], {
      queryParams: { membershipRedirect: 'true' },
    });

    flush();
  }));

  it('should set isMember$ to false when membershipGuid does not match', fakeAsync(() => {
    const testMembershipGuid = '456';
    component.membershipGuid = testMembershipGuid;
    mockSiteMembershipService.siteMembershipSubscriptionGuids$ = of([
      testMembershipGuid,
    ]);

    component.ngOnInit();
    tick();

    component.isMember$.subscribe((isMember) => {
      expect(isMember).toBeFalse();
    });

    flush();
  }));

  it('should set isMember$ to true when membershipGuid matches', fakeAsync(() => {
    const testMembershipGuid = '123';
    component.membershipGuid = testMembershipGuid;
    mockSiteMembershipService.siteMembershipSubscriptionGuids$ = of([
      testMembershipGuid,
    ]);

    component.ngOnInit();
    tick();

    component.isMember$.subscribe((isMember) => {
      expect(isMember).toBeTrue();
    });

    flush();
  }));
});
