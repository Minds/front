import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockService } from '../../../utils/mock';
import { MultiFactorAuthBaseComponent } from './multi-factor-auth.component';
import { ConfigsService } from '../../../common/services/configs.service';
import { BehaviorSubject } from 'rxjs';
import {
  MultiFactorAuthService,
  MultiFactorRootPanel,
} from './services/multi-factor-auth-service';

describe('MultiFactorAuthBaseComponent', () => {
  let comp: MultiFactorAuthBaseComponent;
  let fixture: ComponentFixture<MultiFactorAuthBaseComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MultiFactorAuthBaseComponent],
        providers: [
          {
            provide: MultiFactorAuthService,
            useValue: MockService(MultiFactorAuthService),
          },
          {
            provide: ConfigsService,
            useValue: MockService(ConfigsService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiFactorAuthBaseComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should set auth type in service', () => {
    (comp as any).service.activePanel$ = new BehaviorSubject<
      MultiFactorRootPanel
    >('totp');

    comp.authType = 'sms';

    (comp as any).service.activePanel$.subscribe(val => {
      expect(val).toBe('sms');
    });
  });

  it('should set opts', () => {
    (comp as any).service.activePanel$ = new BehaviorSubject<
      MultiFactorRootPanel
    >('totp');

    comp.opts = {
      onDismissIntent: () => {},
      onSaveIntent: () => {},
      authType: 'sms',
    };

    const sub = (comp as any).service.activePanel$.subscribe(val => {
      expect(val).toBe('sms');
    });
  });
});
