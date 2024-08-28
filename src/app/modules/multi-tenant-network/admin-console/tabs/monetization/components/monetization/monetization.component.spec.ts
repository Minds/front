import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminMonetizationComponent } from './monetization.component';
import { MockComponent } from '../../../../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('NetworkAdminMonetizationComponent', () => {
  let comp: NetworkAdminMonetizationComponent;
  let fixture: ComponentFixture<NetworkAdminMonetizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        NetworkAdminMonetizationComponent,
        MockComponent({
          selector: 'm-networkAdminConsole__stripeCredentials',
        }),
        MockComponent({
          selector: 'm-networkAdminMonetization__tabs',
        }),
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminMonetizationComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });
});
