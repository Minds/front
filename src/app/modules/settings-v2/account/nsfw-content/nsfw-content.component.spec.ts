import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { SettingsV2NsfwContentComponent } from './nsfw-content.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ChangeDetectorRef } from '@angular/core';
import { Session } from '../../../../services/session';
import { SettingsV2Service } from '../../settings-v2.service';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { BehaviorSubject } from 'rxjs';
import userMock from '../../../../mocks/responses/user.mock';
import { ReactiveFormsModule } from '@angular/forms';

describe('SettingsV2NsfwContentComponent', () => {
  let comp: SettingsV2NsfwContentComponent;
  let fixture: ComponentFixture<SettingsV2NsfwContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        SettingsV2NsfwContentComponent,
        MockComponent({
          selector: 'm-settingsV2__header',
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'disabled', 'saving'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        { provide: ChangeDetectorRef, useValue: ChangeDetectorRef },
        { provide: Session, useValue: MockService(Session) },
        {
          provide: SettingsV2Service,
          useValue: MockService(SettingsV2Service, {
            has: ['settings$'],
            props: {
              settings$: {
                get: () => new BehaviorSubject<any>({ mature: 0 }),
              },
            },
          }),
        },
        { provide: DialogService, useValue: MockService(DialogService) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsV2NsfwContentComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('submit', () => {
    it('should submit a truthy value', fakeAsync(() => {
      (comp as any).session.getLoggedInUser.and.returnValue(userMock);
      (comp as any).settingsService.updateSettings.and.returnValue(
        Promise.resolve({
          status: 'success',
        })
      );
      (comp as any).user = userMock;
      comp.inProgress = false;
      comp.form.get('mature').setValue(true);
      comp.form.get('mature').markAsDirty();

      comp.submit();
      tick();

      expect(
        (comp as any).settingsService.updateSettings
      ).toHaveBeenCalledOnceWith(userMock.guid, { mature: 1 });
      expect((comp as any).session.inject).toHaveBeenCalledOnceWith({
        ...userMock,
        mature: 1,
      });
    }));

    it('should submit a falsy value', fakeAsync(() => {
      (comp as any).session.getLoggedInUser.and.returnValue(userMock);
      (comp as any).settingsService.updateSettings.and.returnValue(
        Promise.resolve({
          status: 'success',
        })
      );
      (comp as any).user = userMock;
      comp.inProgress = false;
      comp.form.get('mature').setValue(false);
      comp.form.get('mature').markAsDirty();

      comp.submit();
      tick();

      expect(
        (comp as any).settingsService.updateSettings
      ).toHaveBeenCalledOnceWith(userMock.guid, { mature: 0 });
      expect((comp as any).session.inject).toHaveBeenCalledOnceWith({
        ...userMock,
        mature: 0,
      });
    }));
  });
});
