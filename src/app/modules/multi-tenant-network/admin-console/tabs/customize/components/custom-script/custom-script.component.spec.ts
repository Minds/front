import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NetworkAdminCustomScriptComponent } from './custom-script.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MultiTenantNetworkConfigService } from '../../../../../services/config.service';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { HeadElementInjectorService } from '../../../../../../../common/services/head-element-injector.service';
import { BehaviorSubject, of } from 'rxjs';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { MultiTenantCustomScriptInputService } from '../../../../../services/custom-script-input.service';

describe('NetworkAdminCustomScriptComponent', () => {
  let comp: NetworkAdminCustomScriptComponent;
  let fixture: ComponentFixture<NetworkAdminCustomScriptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NetworkAdminCustomScriptComponent],
      providers: [
        FormBuilder,
        {
          provide: MultiTenantNetworkConfigService,
          useValue: MockService(MultiTenantNetworkConfigService, {
            has: ['config$'],
            props: {
              config$: {
                get: () =>
                  new BehaviorSubject({
                    customScript: 'test script',
                  }),
              },
            },
          }),
        },
        {
          provide: MultiTenantCustomScriptInputService,
          useValue: MockService(MultiTenantCustomScriptInputService),
        },
        {
          provide: HeadElementInjectorService,
          useValue: MockService(HeadElementInjectorService),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
      ],
    })
      .overrideComponent(NetworkAdminCustomScriptComponent, {
        set: {
          imports: [
            ReactiveFormsModule,
            MockComponent({
              selector: 'm-button',
              inputs: ['color', 'size', 'solid', 'disabled', 'saving'],
              outputs: ['onAction'],
              standalone: true,
            }),
            MockComponent({
              selector: 'm-formError',
              inputs: ['errors'],
              standalone: true,
            }),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NetworkAdminCustomScriptComponent);
    comp = fixture.componentInstance;

    spyOn(console, 'error'); // mute manual error logs.

    fixture.detectChanges();
  });

  it('should init with form value from config', () => {
    expect(comp).toBeTruthy();
    expect((comp as any).formGroup.get('customScript').value).toBe(
      'test script'
    );
  });

  it('should save custom script successfully', fakeAsync(async () => {
    const customScript = '<script></script>';
    (comp as any).formGroup.get('customScript').setValue(customScript);

    (comp as any).customScriptInputService.updateCustomScript
      .withArgs(customScript)
      .and.returnValue(Promise.resolve(true));

    (comp as any).save();
    tick();

    expect(
      (comp as any).headElementInjectorService.injectFromString
    ).toHaveBeenCalledWith(customScript);
    expect((comp as any).toaster.success).toHaveBeenCalledWith(
      'Custom script saved successfully'
    );
  }));

  it('should handle save error', fakeAsync(() => {
    const customScript = '<script></script>';
    (comp as any).formGroup.get('customScript').setValue(customScript);

    (comp as any).customScriptInputService.updateCustomScript
      .withArgs(customScript)
      .and.throwError('Mock error');

    (comp as any).save();
    tick();

    expect((comp as any).toaster.error).toHaveBeenCalledWith(
      'Error saving custom script'
    );
  }));

  it('should not save if already in progress', fakeAsync(() => {
    (comp as any).inProgress.set(true);

    (comp as any).save();
    tick();

    expect(
      (comp as any).customScriptInputService.updateCustomScript
    ).not.toHaveBeenCalled();
  }));
});
