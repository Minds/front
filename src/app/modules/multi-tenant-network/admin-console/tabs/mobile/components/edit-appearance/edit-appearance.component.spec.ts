import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminConsoleMobileEditAppearanceComponent } from './edit-appearance.component';

describe('NetworkAdminConsoleMobileEditAppearanceComponent', () => {
  let comp: NetworkAdminConsoleMobileEditAppearanceComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleMobileEditAppearanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkAdminConsoleMobileEditAppearanceComponent],
    });

    fixture = TestBed.createComponent(
      NetworkAdminConsoleMobileEditAppearanceComponent
    );
    comp = fixture.componentInstance;
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });
});
