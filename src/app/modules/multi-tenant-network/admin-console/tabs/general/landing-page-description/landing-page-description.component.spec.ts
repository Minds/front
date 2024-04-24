import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NetworkAdminConsoleLandingPageDescriptionComponent } from './landing-page-description.component';
import { MultiTenantNetworkConfigService } from '../../../../services/config.service';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { MultiTenantConfig } from '../../../../../../../graphql/generated.engine';
import { multiTenantConfigMock } from '../../../../../../mocks/responses/multi-tenant-config.mock';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('NetworkAdminConsoleLandingPageDescriptionComponent', () => {
  let comp: NetworkAdminConsoleLandingPageDescriptionComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleLandingPageDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        NetworkAdminConsoleLandingPageDescriptionComponent,
        MockComponent({ selector: 'm-formError', inputs: ['errors'] }),
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'size', 'disabled', 'saving', 'solid'],
          outputs: ['onAction'],
        }),
      ],
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
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    fixture = TestBed.createComponent(
      NetworkAdminConsoleLandingPageDescriptionComponent
    );
    comp = fixture.componentInstance;

    (comp as any).multiTenantConfigService.config$.next(multiTenantConfigMock);
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set description from config on init', () => {
      const description: string = 'Hello world';
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        customHomePageDescription: description,
      });

      comp.ngOnInit();

      expect((comp as any).formGroup.get('description').value).toBe(
        description
      );
    });

    it('should set null description from config on init', () => {
      const description: string = null;
      (comp as any).multiTenantConfigService.config$.next({
        ...multiTenantConfigMock,
        customHomePageDescription: description,
      });

      comp.ngOnInit();

      expect((comp as any).formGroup.get('description').value).toBe('');
    });
  });

  describe('onSubmit', () => {
    it('should submit changes', () => {
      const description: string = 'Test description';
      comp.ngOnInit();

      (comp as any).getDescriptionFormControl().setValue(description);

      (comp as any).multiTenantConfigService.updateConfig.and.returnValue(
        of(true)
      );

      (comp as any).onSubmit();

      expect(
        (comp as any).multiTenantConfigService.updateConfig
      ).toHaveBeenCalledWith({
        customHomePageDescription: description,
      });
    });
  });
});
