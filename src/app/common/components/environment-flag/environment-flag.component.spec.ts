import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockService } from '../../../utils/mock';
import { Session } from '../../../services/session';
import { EnvironmentFlagComponent } from './environment-flag.component';
import {
  CookieModule,
  CookieOptionsProvider,
  CookieService,
  COOKIE_OPTIONS,
} from '@gorniv/ngx-universal';

describe('EnvironmentFlagComponent', () => {
  let comp: EnvironmentFlagComponent;
  let fixture: ComponentFixture<EnvironmentFlagComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EnvironmentFlagComponent],
      imports: [CookieModule],
      providers: [
        { provide: Session, useValue: MockService(Session) },
        CookieService,
        { provide: COOKIE_OPTIONS, useValue: CookieOptionsProvider },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(EnvironmentFlagComponent);
    comp = fixture.componentInstance;
    (comp as any).cookies.removeAll();

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  it('should show no flag if neither environment is enabled', () => {
    expect(comp.getActiveFlag()).toBe('');
  });

  it('should show the canary flag when canary is enabled and staging is not', () => {
    (comp as any).session.getLoggedInUser.and.returnValue({ canary: true });
    expect(comp.getActiveFlag()).toBe('Canary');
  });

  it('should return to show the staging flag when staging is enabled and canary is not', () => {
    (comp as any).cookies.put('staging', '1');
    expect(comp.getActiveFlag()).toBe('Staging');
  });

  it('should show the staging flag when staging and canary are enabled', () => {
    (comp as any).cookies.put('staging', '1');
    (comp as any).session.getLoggedInUser.and.returnValue({ canary: true });
    expect(comp.getActiveFlag()).toBe('Staging');
  });
});
