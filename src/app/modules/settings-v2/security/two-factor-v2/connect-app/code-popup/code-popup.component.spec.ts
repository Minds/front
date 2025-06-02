import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../../common/components/button/button.component';
import { SettingsTwoFactorCodePopupComponent } from './code-popup.component';

xdescribe('SettingsTwoFactorCodePopupComponent', () => {
  let comp: SettingsTwoFactorCodePopupComponent;
  let fixture: ComponentFixture<SettingsTwoFactorCodePopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SettingsTwoFactorCodePopupComponent, ButtonComponent],
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
    comp.setModalData({
      code: '123',
    });
    expect(comp.code).toBe('123');
  });
});
