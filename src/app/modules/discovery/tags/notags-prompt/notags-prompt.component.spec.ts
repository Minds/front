import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { By } from '@angular/platform-browser';
import { MockService } from '../../../../utils/mock';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { Client } from '../../../../services/api';
import { ConfigsService } from '../../../../common/services/configs.service';
import { DiscoveryNoTagsPromptComponent } from './notags-prompt.component';
import { ShadowboxSubmitButtonComponent } from '../../../../common/components/shadowbox-submit-button/shadowbox-submit-button.component';
import { DiscoveryTagsService } from '../tags.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { overlayModalServiceMock } from '../../../../../tests/overlay-modal-service-mock.spec';

describe('DiscoveryNoTagsPromptComponent', () => {
  let component: DiscoveryNoTagsPromptComponent;
  let fixture: ComponentFixture<DiscoveryNoTagsPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DiscoveryNoTagsPromptComponent,
        ShadowboxSubmitButtonComponent,
      ],
      imports: [RouterTestingModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: Client, useValue: clientMock },
        DiscoveryTagsService,
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoveryNoTagsPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal', () => {
    component.openTagSettings(new MouseEvent('click'));
    expect(overlayModalServiceMock.create).toHaveBeenCalled();
    expect(overlayModalServiceMock.present).toHaveBeenCalled();
  });
});
