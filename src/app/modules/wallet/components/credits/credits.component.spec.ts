import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { WalletV2CreditsComponent } from './credits.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('WalletV2CreditsComponent', () => {
  let fixture: ComponentFixture<WalletV2CreditsComponent>;
  let comp: WalletV2CreditsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        WalletV2CreditsComponent,
        MockComponent({ selector: 'm-walletV2__creditsSummary' }),
        MockComponent({ selector: 'router-outlet' }),
      ],
    });

    fixture = TestBed.createComponent(WalletV2CreditsComponent);
    comp = fixture.componentInstance;
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should have send tab', () => {
    const element: DebugElement = fixture.debugElement.query(
      By.css('.m-walletCreditsTab__sendTab')
    );

    expect(element).toBeTruthy();
  });
});
