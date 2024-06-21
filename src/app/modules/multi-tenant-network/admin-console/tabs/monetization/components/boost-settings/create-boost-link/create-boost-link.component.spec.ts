import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminCreateBoostLinkComponent } from './create-boost-link.component';
import { CopyToClipboardService } from '../../../../../../../../common/services/copy-to-clipboard.service';
import { MockService } from '../../../../../../../../utils/mock';
import { ToasterService } from '../../../../../../../../common/services/toaster.service';
import { SITE_URL } from '../../../../../../../../common/injection-tokens/url-injection-tokens';

describe('NetworkAdminCreateBoostLinkComponent', () => {
  let comp: NetworkAdminCreateBoostLinkComponent;
  let fixture: ComponentFixture<NetworkAdminCreateBoostLinkComponent>;
  const mockSiteUrl: string = 'https://example.minds.com/';

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [NetworkAdminCreateBoostLinkComponent],
      providers: [
        {
          provide: CopyToClipboardService,
          useValue: MockService(CopyToClipboardService),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: SITE_URL,
          useValue: mockSiteUrl,
        },
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminCreateBoostLinkComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should copy to clipboard', () => {
    comp.copyToClipboard();

    expect(
      (comp as any).copyToClipboardService.copyToClipboard
    ).toHaveBeenCalledWith(mockSiteUrl + '#boost');
    expect((comp as any).toasterService.success).toHaveBeenCalledWith(
      'Copied to clipboard'
    );
  });
});
