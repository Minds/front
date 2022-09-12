import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UpdateTagsNoticeComponent } from './update-tags-notice.component';
import { FeedNoticeService } from '../../services/feed-notice.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ContentSettingsModalService } from '../../../content-settings/content-settings-modal.service';

export let injectorMock = new (function() {
  this.get = jasmine.createSpy('get');
})();

describe('UpdateTagsNoticeComponent', () => {
  let comp: UpdateTagsNoticeComponent;
  let fixture: ComponentFixture<UpdateTagsNoticeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          UpdateTagsNoticeComponent,
          MockComponent({
            selector: 'm-feedNotice',
            inputs: ['icon'],
            outputs: ['dismissClick'],
          }),
          MockComponent({
            selector: 'm-button',
            inputs: ['color', 'solid', 'size'],
            outputs: ['onAction'],
          }),
        ],
        providers: [
          {
            provide: FeedNoticeService,
            useValue: MockService(FeedNoticeService),
          },
          {
            provide: ContentSettingsModalService,
            useValue: MockService(ContentSettingsModalService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(UpdateTagsNoticeComponent);
    comp = fixture.componentInstance;
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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to open modal on primary option click', () => {
    comp.onPrimaryOptionClick(null);

    expect((comp as any).contentSettingsModal.open).toHaveBeenCalledWith({
      hideCompass: true,
      onSave: jasmine.any(Function),
    });
  });

  it('should dismiss notice on dismiss function call', () => {
    comp.dismiss();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'update-tags'
    );
  });
});
