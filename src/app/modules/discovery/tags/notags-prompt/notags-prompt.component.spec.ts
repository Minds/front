import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { By } from '@angular/platform-browser';
import { MockService } from '../../../../utils/mock';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { Client } from '../../../../services/api';
import { ConfigsService } from '../../../../common/services/configs.service';
import { DiscoveryNoTagsPromptComponent } from './notags-prompt.component';
import { ButtonComponent } from '../../../../common/components/button/button.component';
import { DiscoveryTagsService } from '../tags.service';
import { ModalService } from '../../../../services/ux/modal.service';
import { modalServiceMock } from '../../../../../tests/modal-service-mock.spec';

describe('DiscoveryNoTagsPromptComponent', () => {
  let component: DiscoveryNoTagsPromptComponent;
  let fixture: ComponentFixture<DiscoveryNoTagsPromptComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveryNoTagsPromptComponent, ButtonComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: Client, useValue: clientMock },
        {
          provide: DiscoveryTagsService,
          useValue: MockService(DiscoveryTagsService),
        },
        { provide: ModalService, useValue: modalServiceMock },
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
    expect(modalServiceMock.present).toHaveBeenCalled();
  });
});
