import { fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import {
  ContentSettingsModalService,
  ModalOptions,
} from './content-settings-modal.service';
import { ContentSettingsComponent } from './content-settings/content-settings.component';

const emailConfirmationMock = new (function() {
  this.success$ = new BehaviorSubject<boolean>(false);
})();

const feedNoticeDismissalServiceMock = new (function() {
  this.dismissNotice = jasmine.createSpy('dismissNotice');
})();

const discoveryTagsServiceMock = new (function() {
  this.hasSetTags = jasmine.createSpy('hasSetTags');
})();

const modalServiceMock = new (function() {
  this.present = jasmine.createSpy('present');
})();

let injectorMock = new (function() {})();

describe('ContentSettingsModalService', () => {
  let service: ContentSettingsModalService;

  beforeEach(() => {
    service = new ContentSettingsModalService(
      emailConfirmationMock,
      feedNoticeDismissalServiceMock,
      discoveryTagsServiceMock,
      modalServiceMock,
      injectorMock
    );

    (service as any).modal = undefined;
    (service as any).emailConfirmationSubscription = undefined;

    (service as any).feedNoticeDismissal.dismissNotice.calls.reset();
    (service as any).tagsService.hasSetTags.calls.reset();
    (service as any).modalService.present.calls.reset();
  });

  it('should be init', () => {
    expect(service).toBeTruthy();
  });

  it('should open the modal and pass options', () => {
    let options: ModalOptions = {
      onSave: () => void 0,
      hideCompass: false,
    };

    service.open(options);

    expect((service as any).modalService.present).toHaveBeenCalledWith(
      ContentSettingsComponent,
      {
        data: options,
        injector: (service as any).injector,
      }
    );
  });

  it('should dismiss the modal and update feed notices', () => {
    (service as any).modal = new (function() {
      this.dismiss = jasmine.createSpy('dismiss');
    })();

    service.dismiss();

    expect((service as any).modal.dismiss).toHaveBeenCalled();
    expect(
      (service as any).feedNoticeDismissal.dismissNotice
    ).toHaveBeenCalledWith('update-tags');
  });

  it('should setup email confirmation subscription and open modal when success fires if user has selected no tags', fakeAsync(() => {
    (service as any).setupEmailConfirmationSubscription();
    (service as any).tagsService.hasSetTags.and.returnValue(
      Promise.resolve(false)
    );

    emailConfirmationMock.success$.next(true);
    tick();

    expect((service as any).modalService.present).toHaveBeenCalled();
  }));

  it('should teardown subscription onDestroy', () => {
    (service as any).emailConfirmationSubscription = new (function() {
      this.unsubscribe = jasmine.createSpy('unsubscribe');
    })();

    service.ngOnDestroy();

    expect(
      (service as any).emailConfirmationSubscription.unsubscribe
    ).toHaveBeenCalled();
  });
});
