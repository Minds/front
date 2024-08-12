import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminConsoleMobileAppTrackingMessageComponent } from './app-tracking-message.component';
import { MobileAppPreviewService } from '../../services/mobile-app-preview.service';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ToasterService } from '../../../../../../../common/services/toaster.service';

describe('NetworkAdminConsoleMobileAppTrackingMessageComponent', () => {
  let comp: NetworkAdminConsoleMobileAppTrackingMessageComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleMobileAppTrackingMessageComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        NetworkAdminConsoleMobileAppTrackingMessageComponent,
        MockComponent({
          selector: 'm-toggle',
          inputs: [
            'mModel',
            'mModelChange',
            'leftValue',
            'rightValue',
            'offState',
          ],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['disabled', 'saving', 'color', 'size'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        {
          provide: MobileAppPreviewService,
          useValue: MockService(MobileAppPreviewService, {
            has: [
              'initInProgress$',
              'appTrackingMessageEnabled$',
              'appTrackingMessage$',
              'setMobileConfigInProgress$',
            ],
            props: {
              initInProgress$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              setMobileConfigInProgress$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              appTrackingMessageEnabled$: {
                get: () => new BehaviorSubject<boolean>(true),
              },
              appTrackingMessage$: {
                get: () => new BehaviorSubject<string>('test'),
              },
            },
          }),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    fixture = TestBed.createComponent(
      NetworkAdminConsoleMobileAppTrackingMessageComponent
    );
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

  it('should set mobile config on enabled toggle ON', () => {
    comp.enabledToggleState = 'off';

    comp.onEnabledToggle('on');

    expect(comp.enabledToggleState).toBe('on');
    expect(
      (comp as any).mobileAppPreviewService.setMobileConfig
    ).toHaveBeenCalledWith({ appTrackingMessageEnabled: true });
  });

  it('should set mobile config on enabled toggle OFF', () => {
    comp.enabledToggleState = 'on';

    comp.onEnabledToggle('off');

    expect(comp.enabledToggleState).toBe('off');
    expect(
      (comp as any).mobileAppPreviewService.setMobileConfig
    ).toHaveBeenCalledWith({ appTrackingMessageEnabled: false });
  });

  it('should handle message saving', () => {
    (comp as any).message$.next('new message');

    comp.onMessageSave();

    expect(
      (comp as any).mobileAppPreviewService.setMobileConfig
    ).toHaveBeenCalledWith({ appTrackingMessage: 'new message' });
  });
});
