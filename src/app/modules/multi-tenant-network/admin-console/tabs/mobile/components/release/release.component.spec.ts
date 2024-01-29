import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminConsoleMobileReleaseComponent } from './release.component';
import { MockComponent } from '../../../../../../../utils/mock';
import { ConfigsService } from '../../../../../../../common/services/configs.service';

describe('NetworkAdminConsoleMobileReleaseComponent', () => {
  let comp: NetworkAdminConsoleMobileReleaseComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleMobileReleaseComponent>;

  const tenantId: number = 3;
  const siteName: string = 'siteName';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleMobileReleaseComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['solid', 'stretch', 'color'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        {
          provide: ConfigsService,
          useValue: new (function() {
            this.get = (value: string) => {
              if (value === 'tenant_id') {
                return tenantId;
              } else if (value === 'site_name') {
                return siteName;
              }
            };
          })(),
        },
      ],
    });

    fixture = TestBed.createComponent(
      NetworkAdminConsoleMobileReleaseComponent
    );
    comp = fixture.componentInstance;
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should get correct contact support URL', () => {
    expect(comp.contactSupportUrl).toBe(
      `https://mindsdotcom.typeform.com/networks-vip#tenant_id=${tenantId}&tenant_name=${siteName}`
    );
  });
});
