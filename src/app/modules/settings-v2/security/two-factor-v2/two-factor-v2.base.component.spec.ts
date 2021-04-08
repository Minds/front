import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from '../../../../utils/mock';
import { SettingsTwoFactorV2Service } from './two-factor-v2.service';
import { SettingsTwoFactorV2BaseComponent } from './two-factor-v2-base.component';

describe('SettingsTwoFactorV2BaseComponent', () => {
  let comp: SettingsTwoFactorV2BaseComponent;
  let fixture: ComponentFixture<SettingsTwoFactorV2BaseComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SettingsTwoFactorV2BaseComponent],
        providers: [
          {
            provide: SettingsTwoFactorV2Service,
            useValue: MockService(SettingsTwoFactorV2Service),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsTwoFactorV2BaseComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should reset service on popstate event firing', () => {
    window.dispatchEvent(new Event('popstate'));
    expect((comp as any).service.reset).toHaveBeenCalled();
  });
});
