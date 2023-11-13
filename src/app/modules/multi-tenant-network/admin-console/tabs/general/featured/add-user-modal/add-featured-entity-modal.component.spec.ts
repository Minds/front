import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { ChannelsV2Service } from '../../../../../../channels/v2/channels-v2.service';
import { AddFeaturedEntityModalEntityType } from './add-featured-entity-modal.types';
import { AddFeaturedEntityModalComponent } from './add-featured-entity-modal.component';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import userMock from '../../../../../../../mocks/responses/user.mock';

describe('AddFeaturedEntityModalComponent', () => {
  let comp: AddFeaturedEntityModalComponent;
  let fixture: ComponentFixture<AddFeaturedEntityModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddFeaturedEntityModalComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['disabled', 'saving'],
          outputs: ['onAction'],
        }),
        MockComponent({
          selector: 'm-formInput__autocompleteUserInput',
          outputs: ['keyup.enter'],
        }),
      ],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: ChannelsV2Service,
          useValue: MockService(ChannelsV2Service),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddFeaturedEntityModalComponent);
    comp = fixture.componentInstance;
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
    expect(comp.formGroup).toBeDefined();
  });

  describe('username input', () => {
    it('should have a username input', () => {
      const usernameInput = fixture.debugElement.query(
        By.css('m-formInput__autocompleteUserInput[name="username"]')
      );
      expect(usernameInput).toBeTruthy();
    });

    it('should require a username', () => {
      const usernameInput: AbstractControl<string> = comp.formGroup.get(
        'username'
      );
      usernameInput.setValue('');
      expect(usernameInput.valid).toBeFalsy();
    });

    it('should allow a valid username', () => {
      const usernameInput: AbstractControl<string> = comp.formGroup.get(
        'username'
      );
      usernameInput.setValue('testuser');
      expect(usernameInput.valid).toBeTruthy();
    });
  });

  describe('onConfirmClick', () => {
    it('should warn that group support is not implemented', fakeAsync(() => {
      comp.entityType = AddFeaturedEntityModalEntityType.Group;

      comp.onConfirmClick();
      tick();

      expect((comp as any).toaster.warn).toHaveBeenCalledWith(
        'Group support is not yet implemented.'
      );
    }));

    it('should warn if no username is entered', fakeAsync(() => {
      comp.formGroup.get('username').setValue('');
      comp.onConfirmClick();

      tick();
      expect((comp as any).toaster.warn).toHaveBeenCalledWith(
        'You must enter a username.'
      );
    }));

    it('should warn if no user is found with the entered username', fakeAsync(() => {
      const identifier: string = 'testuser';
      comp.onSaveIntent = jasmine.createSpy('onSaveIntent');
      (comp as any).channelService.getChannelByIdentifier.and.returnValue(
        Promise.resolve(null)
      );
      comp.formGroup.get('username').setValue(identifier);

      comp.onConfirmClick();
      tick();

      expect(
        (comp as any).channelService.getChannelByIdentifier
      ).toHaveBeenCalledWith(identifier);
      expect((comp as any).toaster.warn).toHaveBeenCalledWith(
        'No user found with this username.'
      );
      expect(comp.onSaveIntent).not.toHaveBeenCalled();
    }));

    it('should call onSaveIntent with the found user', fakeAsync(() => {
      const identifier: string = 'testuser';
      comp.onSaveIntent = jasmine.createSpy('onSaveIntent');
      (comp as any).channelService.getChannelByIdentifier.and.returnValue(
        Promise.resolve(userMock)
      );
      comp.formGroup.get('username').setValue(identifier);

      comp.onConfirmClick();
      tick();

      expect(
        (comp as any).channelService.getChannelByIdentifier
      ).toHaveBeenCalledWith(identifier);
      expect((comp as any).toaster.warn).not.toHaveBeenCalled();
      expect(comp.onSaveIntent).toHaveBeenCalledWith(userMock);
    }));
  });

  describe('setModalData', () => {
    it('should set modal data', () => {
      const onDismissIntent = jasmine.createSpy('onDismissIntent');
      const onSaveIntent = jasmine.createSpy('onDismissIntent');
      const entityType: AddFeaturedEntityModalEntityType =
        AddFeaturedEntityModalEntityType.User;

      comp.setModalData({
        onDismissIntent: onDismissIntent,
        onSaveIntent: onSaveIntent,
        entityType: entityType,
      });

      expect(comp.onDismissIntent).toBe(onDismissIntent);
      expect(comp.onSaveIntent).toBe(onSaveIntent);
      expect(comp.entityType).toBe(entityType);
    });
  });
});
