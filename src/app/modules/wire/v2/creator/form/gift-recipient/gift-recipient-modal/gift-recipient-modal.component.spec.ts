import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { GiftRecipientModalComponent } from './gift-recipient-modal.component';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { GiftCardProductIdEnum } from '../../../../../../../../graphql/generated.engine';
import { GiftRecipientGiftDuration } from './gift-recipient-modal.types';

describe('GiftRecipientModalComponent', () => {
  let comp: GiftRecipientModalComponent;
  let fixture: ComponentFixture<GiftRecipientModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GiftRecipientModalComponent,
        MockComponent({
          selector: 'm-formInput__autocompleteUserInput',
          inputs: ['id', 'formControlName'],
        }),
        MockComponent({
          selector: 'm-toggle',
          inputs: ['mModel', 'leftValue', 'rightValue', 'offstate'],
          outputs: ['mModelChange'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['solid', 'color', 'size', 'stretch'],
          outputs: ['onAction'],
        }),
      ],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });
    fixture = TestBed.createComponent(GiftRecipientModalComponent);
    comp = fixture.componentInstance;

    comp.formGroup.get('username').setValue('');
    comp.sendShareableLink$.next(false);
    comp.product = GiftCardProductIdEnum.Plus;
    comp.duration = GiftRecipientGiftDuration.MONTH;
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('setModalData', () => {
    it('should set modal data correctly when self gift', () => {
      const mockData = {
        onDismissIntent: jasmine.createSpy('onDismissIntent'),
        onSaveIntent: jasmine.createSpy('onSaveIntent'),
        product: GiftCardProductIdEnum.Plus,
        duration: GiftRecipientGiftDuration.YEAR,
        recipientUsername: null,
        isSelfGift: true,
      };

      comp.setModalData(mockData);

      expect(comp.product).toEqual(mockData.product);
      expect(comp.duration).toEqual(mockData.duration);
      expect(comp.onDismissIntent).toEqual(mockData.onDismissIntent);
      expect(comp.onSaveIntent).toEqual(mockData.onSaveIntent);
      expect(comp.formGroup.get('username').value).toEqual('');
      expect(comp.sendShareableLink$.getValue()).toBeTrue();
    });

    it('should set modal data correctly when NOT self gift', () => {
      const mockData = {
        onDismissIntent: jasmine.createSpy('onDismissIntent'),
        onSaveIntent: jasmine.createSpy('onSaveIntent'),
        product: GiftCardProductIdEnum.Plus,
        duration: GiftRecipientGiftDuration.YEAR,
        recipientUsername: 'testuser',
        isSelfGift: false,
      };

      comp.setModalData(mockData);

      expect(comp.product).toEqual(mockData.product);
      expect(comp.duration).toEqual(mockData.duration);
      expect(comp.onDismissIntent).toEqual(mockData.onDismissIntent);
      expect(comp.onSaveIntent).toEqual(mockData.onSaveIntent);
      expect(comp.formGroup.get('username').value).toEqual(
        mockData.recipientUsername
      );
      expect(comp.sendShareableLink$.getValue()).toBeFalse();
    });
  });

  describe('onConfirmRecipientClick', () => {
    it('should handle confirm recipient click when username is present', () => {
      spyOn(comp, 'onSaveIntent');
      (comp as any).sendShareableLink$.next(false);
      comp.formGroup.get('username').setValue('testuser');

      comp.onConfirmRecipientClick();

      expect(comp.onSaveIntent).toHaveBeenCalledWith('testuser', false);
    });

    it('should handle confirm recipient click when username is present and strip any prefixed @', () => {
      spyOn(comp, 'onSaveIntent');
      (comp as any).sendShareableLink$.next(false);
      comp.formGroup.get('username').setValue('@testuser');

      comp.onConfirmRecipientClick();

      expect(comp.onSaveIntent).toHaveBeenCalledWith('testuser', false);
    });

    it('should handle confirm recipient click when self gift', () => {
      spyOn(comp, 'onSaveIntent');
      (comp as any).sendShareableLink$.next(true);
      comp.formGroup.get('username').setValue('');

      comp.onConfirmRecipientClick();

      expect(comp.onSaveIntent).toHaveBeenCalledWith(null, true);
    });

    it('should handle confirm recipient click negatively when neither username is present or it is a self gift', () => {
      spyOn(comp, 'onSaveIntent');
      (comp as any).sendShareableLink$.next(false);
      comp.formGroup.get('username').setValue('');

      comp.onConfirmRecipientClick();

      expect((comp as any).toast.error).toHaveBeenCalledOnceWith(
        'You must enter either a username or send yourself a shareable link'
      );
      expect(comp.onSaveIntent).not.toHaveBeenCalled();
    });

    it('should handle strip username on recipient click when username is present for a self gift', () => {
      spyOn(comp, 'onSaveIntent');
      (comp as any).sendShareableLink$.next(true);
      comp.formGroup.get('username').setValue('testUser');

      comp.onConfirmRecipientClick();

      expect(comp.onSaveIntent).toHaveBeenCalledWith(null, true);
    });
  });

  describe('getSubtitle', () => {
    it('should get title for a year of plus', () => {
      comp.product = GiftCardProductIdEnum.Plus;
      comp.duration = GiftRecipientGiftDuration.YEAR;

      expect(comp.getSubtitle()).toEqual(
        'Give the gift of a Minds+ subscription for 1 year.'
      );
    });

    it('should get title for a month of plus', () => {
      comp.product = GiftCardProductIdEnum.Plus;
      comp.duration = GiftRecipientGiftDuration.MONTH;

      expect(comp.getSubtitle()).toEqual(
        'Give the gift of a Minds+ subscription for 1 month.'
      );
    });

    it('should get title for a year of pro', () => {
      comp.product = GiftCardProductIdEnum.Pro;
      comp.duration = GiftRecipientGiftDuration.YEAR;

      expect(comp.getSubtitle()).toEqual(
        'Give the gift of a Minds Pro subscription for 1 year.'
      );
    });

    it('should get title for a month of pro', () => {
      comp.product = GiftCardProductIdEnum.Pro;
      comp.duration = GiftRecipientGiftDuration.MONTH;

      expect(comp.getSubtitle()).toEqual(
        'Give the gift of a Minds Pro subscription for 1 month.'
      );
    });
  });

  it('should handle shareable link toggle change', () => {
    comp.sendShareableLink$.next(true);
    comp.onShareableLinkToggleChange(false);
    expect(comp.sendShareableLink$.getValue()).toBeFalse();

    comp.sendShareableLink$.next(false);
    comp.onShareableLinkToggleChange(true);
    expect(comp.sendShareableLink$.getValue()).toBeTrue();
  });
});
