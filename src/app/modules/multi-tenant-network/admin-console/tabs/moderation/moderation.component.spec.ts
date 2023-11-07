import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NetworkAdminConsoleModerationComponent } from './moderation.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('NetworkAdminConsoleModerationComponent', () => {
  let comp: NetworkAdminConsoleModerationComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleModerationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NetworkAdminConsoleModerationComponent],
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleModerationComponent);
    comp = fixture.componentInstance;
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should have a guidelines tab', () => {
    expect(
      fixture.debugElement.query(
        By.css('[data-ref=network-admin-console-tab-guidelines]')
      )
    ).toBeTruthy();
  });
});
