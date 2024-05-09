import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SettingsV2ApiKeysComponent } from './api-keys.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { PersonalApiKeysService } from './service/api-keys.service';
import { CreateApiKeyModalService } from './create-api-key-modal/create-api-key-modal.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { CopyToClipboardService } from '../../../../common/services/copy-to-clipboard.service';
import { ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PersonalApiKey } from '../../../../../graphql/generated.engine';

describe('SettingsV2ApiKeysComponent', () => {
  let comp: SettingsV2ApiKeysComponent;
  let fixture: ComponentFixture<SettingsV2ApiKeysComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        SettingsV2ApiKeysComponent,
        MockComponent({
          selector: 'm-settingsV2__header',
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['overlay', 'iconOnly', 'size', 'color', 'disabled'],
          outputs: ['onAction'],
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'm-icon',
          inputs: ['iconId', 'size'],
        }),
      ],
      providers: [
        {
          provide: PersonalApiKeysService,
          useValue: MockService(PersonalApiKeysService, {
            has: ['keys$'],
            props: {
              keys$: {
                get: () => new BehaviorSubject<PersonalApiKey[]>([]),
              },
            },
          }),
        },
        {
          provide: CreateApiKeyModalService,
          useValue: MockService(CreateApiKeyModalService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: CopyToClipboardService,
          useValue: MockService(CopyToClipboardService),
        },
        { provide: ChangeDetectorRef, useValue: ChangeDetectorRef },
      ],
    });

    fixture = TestBed.createComponent(SettingsV2ApiKeysComponent);
    comp = fixture.componentInstance;

    (comp as any).lastCreatedSecret$.next(null);

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

  describe('onCreateClick', () => {
    it('should handle create click when modal returns a key as a result', fakeAsync(() => {
      const secretKey: string = 'secret';
      (comp as any).createApiKeyModalService.open.and.returnValue(
        Promise.resolve({ secret: secretKey })
      );
      (comp as any).lastCreatedSecret$.next(null);

      (comp as any).onCreateClick();
      tick();

      expect((comp as any).createApiKeyModalService.open).toHaveBeenCalled();
      expect((comp as any).lastCreatedSecret$.getValue()).toBe(secretKey);
      expect((comp as any).toasterService.success).toHaveBeenCalledWith(
        'Personal API key created'
      );
      expect((comp as any).personalApiKeysService.refetch).toHaveBeenCalled();
    }));

    it('should handle create click when modal returns null as a result', fakeAsync(() => {
      (comp as any).createApiKeyModalService.open.and.returnValue(
        Promise.resolve(null)
      );
      (comp as any).lastCreatedSecret$.next(null);

      (comp as any).onCreateClick();
      tick();

      expect((comp as any).createApiKeyModalService.open).toHaveBeenCalled();
      expect((comp as any).lastCreatedSecret$.getValue()).toBe(null);
      expect((comp as any).toasterService.success).not.toHaveBeenCalled();
      expect(
        (comp as any).personalApiKeysService.refetch
      ).not.toHaveBeenCalled();
    }));
  });

  describe('onDeleteClick', () => {
    it('should handle delete success', fakeAsync(() => {
      (comp as any).deleteInProgress$.next(false);
      (comp as any).personalApiKeysService.delete.and.returnValue(
        Promise.resolve(true)
      );

      (comp as any).onDeleteClick('keyId');
      tick();

      expect((comp as any).personalApiKeysService.delete).toHaveBeenCalledWith(
        'keyId'
      );
      expect((comp as any).personalApiKeysService.refetch).toHaveBeenCalled();
      expect((comp as any).deleteInProgress$.getValue()).toBe(false);
    }));

    it('should handle delete error', fakeAsync(() => {
      (comp as any).deleteInProgress$.next(false);
      (comp as any).personalApiKeysService.delete.and.returnValue(
        Promise.reject('error')
      );

      (comp as any).onDeleteClick('keyId');
      tick();

      expect((comp as any).personalApiKeysService.delete).toHaveBeenCalledWith(
        'keyId'
      );
      expect(
        (comp as any).personalApiKeysService.refetch
      ).not.toHaveBeenCalled();
      expect((comp as any).deleteInProgress$.getValue()).toBe(false);
      expect((comp as any).toasterService.error).toHaveBeenCalledWith(
        'Failed to delete personal API key'
      );
    }));
  });

  describe('onCopySecretToClipboardClick', () => {
    it('should handle copy to clipboard', fakeAsync(() => {
      (comp as any).copyToClipboardService.copyToClipboard.and.returnValue(
        Promise.resolve(true)
      );
      (comp as any).lastCreatedSecret$.next('secret');

      (comp as any).onCopySecretToClipboardClick();
      tick();

      expect(
        (comp as any).copyToClipboardService.copyToClipboard
      ).toHaveBeenCalledWith('secret');
      expect((comp as any).toasterService.success).toHaveBeenCalledWith(
        'Secret copied to clipboard'
      );
    }));
  });
});
