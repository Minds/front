import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { MockService } from '../../../utils/mock';
import { clientMock } from '../../../../tests/client-mock.spec';
import { Client } from '../../../services/api';
import { ConfigsService } from '../../../common/services/configs.service';
import { DiscoveryTagsService } from '../tags/tags.service';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { DiscoverySettingsButtonComponent } from './settings-button.component';
import { TooltipComponent } from '../../../common/components/tooltip/tooltip.component';
import { DiscoveryFeedsService } from '../feeds/feeds.service';

describe('DiscoverySettingsButtonComponent', () => {
  let component: DiscoverySettingsButtonComponent;
  let fixture: ComponentFixture<DiscoverySettingsButtonComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DiscoverySettingsButtonComponent, TooltipComponent],
        imports: [RouterTestingModule],
        providers: [
          { provide: Session, useValue: sessionMock },
          { provide: ConfigsService, useValue: MockService(ConfigsService) },
          { provide: Client, useValue: clientMock },
          {
            provide: DiscoveryTagsService,
            useValue: MockService(DiscoveryTagsService),
          },
          { provide: OverlayModalService, useValue: overlayModalServiceMock },
          {
            provide: DiscoveryFeedsService,
            useValue: MockService(DiscoveryFeedsService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverySettingsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open tags modal', () => {
    component.modalType = 'tags';
    component.openSettingsModal(new MouseEvent('click'));
    expect(overlayModalServiceMock.create).toHaveBeenCalled();
    expect(overlayModalServiceMock.present).toHaveBeenCalled();
  });

  it('should open feeds modal', () => {
    component.modalType = 'tags';
    component.openSettingsModal(new MouseEvent('click'));
    expect(overlayModalServiceMock.create).toHaveBeenCalled();
    expect(overlayModalServiceMock.present).toHaveBeenCalled();
  });
});
