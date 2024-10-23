import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { ContentGenerationCompletedModalComponent } from './content-generation-completed-modal.component';
import { MockComponent, MockService } from '../../../../../utils/mock';

describe('ContentGenerationCompletedModalComponent', () => {
  let comp: ContentGenerationCompletedModalComponent;
  let fixture: ComponentFixture<ContentGenerationCompletedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentGenerationCompletedModalComponent],
      providers: [
        { provide: Router, useValue: MockService(Router) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    })
      .overrideComponent(ContentGenerationCompletedModalComponent, {
        set: {
          imports: [
            MockComponent({
              selector: 'm-button',
              outputs: ['onAction'],
              standalone: true,
            }),
            MockComponent({
              selector: 'm-modalCloseButton',
              standalone: true,
            }),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ContentGenerationCompletedModalComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('setModalData', () => {
    it('should set onDismissIntent and onSaveIntent', () => {
      const onDismissIntent = jasmine.createSpy('onDismissIntent');
      const onSaveIntent = jasmine.createSpy('onSaveIntent');

      comp.setModalData({ onDismissIntent, onSaveIntent });

      expect(comp.onDismissIntent).toBe(onDismissIntent);
      expect(comp.onSaveIntent).toBe(onSaveIntent);
    });

    it('should set default functions if not provided', () => {
      comp.setModalData({});

      expect(comp.onDismissIntent).toEqual(jasmine.any(Function));
      expect(comp.onSaveIntent).toEqual(jasmine.any(Function));
    });
  });

  describe('onShowMeClick', () => {
    it('should call onSaveIntent and navigate to root', () => {
      const onSaveIntent = jasmine.createSpy('onSaveIntent');
      comp.setModalData({ onSaveIntent });

      comp.onShowMeClick();

      expect(onSaveIntent).toHaveBeenCalled();
      expect((comp as any).router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('onLaterClick', () => {
    it('should call onDismissIntent and show toaster message', () => {
      const onDismissIntent = jasmine.createSpy('onDismissIntent');
      comp.setModalData({ onDismissIntent });

      comp.onLaterClick();

      expect(onDismissIntent).toHaveBeenCalled();
      expect((comp as any).toaster.inform).toHaveBeenCalledWith(
        'Use the menu to navigate to the newsfeed at any time.'
      );
    });
  });
});
