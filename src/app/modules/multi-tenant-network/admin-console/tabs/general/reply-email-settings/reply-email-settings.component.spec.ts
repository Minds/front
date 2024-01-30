import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MockService } from '../../../../../../utils/mock';
import { MultiTenantNetworkConfigService } from '../../../../services/config.service';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { MetaService } from '../../../../../../common/services/meta.service';
import { multiTenantConfigMock } from '../../../../../../mocks/responses/multi-tenant-config.mock';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { BehaviorSubject, of } from 'rxjs';
import { MultiTenantConfig } from '../../../../../../../graphql/generated.engine';
import { NetworkAdminConsoleReplyEmailSettingsComponent } from './reply-email-settings.component';

describe('NetworkAdminConsoleReplyEmailSettingsComponent', () => {
  let comp: NetworkAdminConsoleReplyEmailSettingsComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleReplyEmailSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkAdminConsoleReplyEmailSettingsComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: MultiTenantNetworkConfigService,
          useValue: MockService(MultiTenantNetworkConfigService, {
            has: ['config$'],
            props: {
              config$: {
                get: () =>
                  new BehaviorSubject<MultiTenantConfig>(multiTenantConfigMock),
              },
            },
          }),
        },
        FormBuilder,
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: MetaService, useValue: MockService(MetaService) },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    });

    fixture = TestBed.createComponent(
      NetworkAdminConsoleReplyEmailSettingsComponent
    );
    comp = fixture.componentInstance;

    (comp as any).multiTenantConfigService.config$.next(multiTenantConfigMock);
  });

  it('should create the component', fakeAsync(() => {
    expect(comp).toBeTruthy();
    comp.ngOnInit();
    tick();

    expect(comp.replyEmailFormControl.getRawValue()).toBe(
      multiTenantConfigMock.replyEmail
    );
  }));

  describe('onSubmit', () => {
    it('should submit changes', fakeAsync(() => {
      const replyEmail: string = 'some@email.com';
      comp.replyEmailFormControl.setValue(replyEmail);

      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      comp.onSubmit();
      tick();

      expect(
        (comp as any).multiTenantConfigService.updateConfig
      ).toHaveBeenCalledWith({ replyEmail: replyEmail });
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Updated reply-to email.'
      );
    }));
  });
});
