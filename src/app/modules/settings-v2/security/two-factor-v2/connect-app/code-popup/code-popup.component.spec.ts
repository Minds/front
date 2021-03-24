import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsTwoFactorCodePopupComponent } from './code-popup.component';

describe('SettingsTwoFactorCodePopupComponent', () => {
  let comp: SettingsTwoFactorCodePopupComponent;
  let fixture: ComponentFixture<SettingsTwoFactorCodePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsTwoFactorCodePopupComponent],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsTwoFactorCodePopupComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should set code when opts passed in', () => {
    comp.opts = {
      code: '123',
    };
    expect(comp.code).toBe('123');
  });
});
