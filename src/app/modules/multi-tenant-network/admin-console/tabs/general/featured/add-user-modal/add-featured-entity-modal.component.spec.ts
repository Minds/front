import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  AbstractControl,
  DefaultValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { ChannelsV2Service } from '../../../../../../channels/v2/channels-v2.service';
import { AddFeaturedEntityModalEntityType } from './add-featured-entity-modal.types';
import { AddFeaturedEntityModalComponent } from './add-featured-entity-modal.component';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import userMock from '../../../../../../../mocks/responses/user.mock';
import { Component, Input } from '@angular/core';
import {
  MindsGroup,
  MindsUser,
} from '../../../../../../../interfaces/entities';
import { groupMock } from '../../../../../../../mocks/responses/group.mock';

@Component({
  selector: 'm-formInput__autocompleteEntityInput',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MockAutocompleteEntityInputComponent,
      multi: true,
    },
  ],
  template: '',
})
export class MockAutocompleteEntityInputComponent extends DefaultValueAccessor {
  @Input() entityType: any;
  @Input() placeholder: string;
  @Input() allowEmpty: boolean = false;
  @Input() limit: number = 8;
  @Input() clearAfterSelection: boolean = false;
  @Input() excludeGuids: string[] = [];
}

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
        MockAutocompleteEntityInputComponent,
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
    comp.entityType = AddFeaturedEntityModalEntityType.User;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
    expect(comp.formGroup).toBeDefined();
  });

  describe('entity input', () => {
    it('should have an entity input', () => {
      const entityInput = fixture.debugElement.query(
        By.css('m-formInput__autocompleteEntityInput')
      );
      expect(entityInput).toBeTruthy();
    });

    it('should require an entity', () => {
      const entityInput: AbstractControl<string> = comp.formGroup.get('entity');
      entityInput.setValue(null);
      expect(entityInput.valid).toBeFalsy();
    });

    it('should allow a valid entity', () => {
      const usernameInput: AbstractControl<string> = comp.formGroup.get(
        'entity'
      );
      usernameInput.setValue(userMock);
      expect(usernameInput.valid).toBeTruthy();
    });
  });

  describe('onConfirmClick', () => {
    it('should warn if no entity is set', fakeAsync(() => {
      comp.formGroup.get('entity').setValue(null);
      comp.onConfirmClick();

      tick();
      expect((comp as any).toaster.warn).toHaveBeenCalledWith(
        'An entity must be selected'
      );
    }));

    it('should call onSaveIntent when entity is set to a user', fakeAsync(() => {
      const entity: MindsUser = userMock;
      comp.onSaveIntent = jasmine.createSpy('onSaveIntent');
      comp.formGroup.get('entity').setValue(entity);

      comp.onConfirmClick();
      tick();

      expect((comp as any).toaster.warn).not.toHaveBeenCalled();
      expect(comp.onSaveIntent).toHaveBeenCalledWith(entity);
    }));

    it('should call onSaveIntent when entity is set to a group', fakeAsync(() => {
      const entity: MindsGroup = groupMock as any;
      comp.onSaveIntent = jasmine.createSpy('onSaveIntent');
      comp.formGroup.get('entity').setValue(entity);

      comp.onConfirmClick();
      tick();

      expect((comp as any).toaster.warn).not.toHaveBeenCalled();
      expect(comp.onSaveIntent).toHaveBeenCalledWith(entity);
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
