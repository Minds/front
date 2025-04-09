import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelAboutComponent } from './about.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ChannelsV2Service } from '../channels-v2.service';
import { Session } from '../../../../services/session';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import userMock from '../../../../mocks/responses/user.mock';
import { TagsPipeMock } from '../../../../mocks/pipes/tagsPipe.mock';
import { ChangeDetectionStrategy } from '@angular/core';

describe('ChannelAboutComponent', () => {
  let comp: ChannelAboutComponent;
  let fixture: ComponentFixture<ChannelAboutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChannelAboutComponent,
        TagsPipeMock,
        MockComponent({
          selector: 'm-channel__nostr',
        }),
        MockComponent({
          selector: 'm-channel__socialLinks',
          inputs: ['socialLinks'],
        }),
        MockComponent({
          selector: 'm-channelAbout__extraInfo',
        }),
      ],
      providers: [
        {
          provide: ChannelsV2Service,
          useValue: MockService(ChannelsV2Service, {
            has: ['channel$'],
            props: {
              channel$: {
                get: () => new BehaviorSubject<boolean>(userMock),
              },
            },
          }),
        },
        { provide: Session, useValue: MockService(Session) },
        { provide: IS_TENANT_NETWORK, useValue: false },
      ],
    }).overrideComponent(ChannelAboutComponent, {
      // at the time of making this testbed, change detection does NOT
      // need to be manually run. when it does, this should be removed.
      set: { changeDetection: ChangeDetectionStrategy.Default },
    });

    fixture = TestBed.createComponent(ChannelAboutComponent);
    comp = fixture.componentInstance;

    Object.defineProperty(comp, 'isTenantNetwork', {
      writable: true,
      value: false,
    });

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  xdescribe('m-channel__nostr', () => {
    it('should have nostr component when NOT on a tenant network ', () => {
      (comp as any).isTenantNetwork = false;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-channel__nostr'))
      ).toBeTruthy();
    });

    it('should NOT have nostr component when on tenant networks', () => {
      (comp as any).isTenantNetwork = true;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-channel__nostr'))
      ).toBeFalsy();
    });
  });
});
