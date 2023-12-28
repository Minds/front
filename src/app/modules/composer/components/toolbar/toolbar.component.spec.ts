import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ToolbarComponent } from './toolbar.component';
import { ComposerService, ComposerSize } from '../../services/composer.service';
import { PopupService } from '../popup/popup.service';
import { NsfwComponent } from '../popup/nsfw/nsfw.component';
import { ComposerMonetizeV2Component } from '../popup/monetize/v2/components/monetize.component';
import { TagsComponent } from '../popup/tags/tags.component';
import { ScheduleComponent } from '../popup/schedule/schedule.component';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ButtonComponent } from '../../../../common/components/button/button.component';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { UploaderService } from '../../services/uploader.service';
import { AttachmentApiService } from '../../../../common/api/attachment-api.service';
import { ComposerSupermindComponent } from '../popup/supermind/supermind.component';
import { LivestreamService } from '../../../../modules/composer/services/livestream.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExperimentsService } from '../../../experiments/experiments.service';
import { PermissionsService } from '../../../../common/services/permissions.service';
import { NsfwEnabledService } from '../../../multi-tenant-network/services/nsfw-enabled.service';

describe('Composer Toolbar', () => {
  let comp: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let service: LivestreamService;

  const attachment$ = jasmine.createSpyObj('attachment$', {
    next: () => {},
    subscribe: { unsubscribe: () => {} },
  });

  const attachmentError$ = new BehaviorSubject<any>(null);

  const isEditing$ = jasmine.createSpyObj('isEditing$', {
    next: () => {},
    getValue: () => false,
    subscribe: { unsubscribe: () => {} },
  });

  const monetization$ = jasmine.createSpyObj('monetization$', {
    next: () => {},
    getValue: () => null,
    subscribe: { unsubscribe: () => {} },
  });

  const size$ = new BehaviorSubject<ComposerSize>('full');

  const remind$ = new BehaviorSubject(null);

  const canCreateSupermindRequest$ = new BehaviorSubject(true);

  const composerServiceMock: any = MockService(ComposerService, {
    has: [
      'attachment$',
      'isEditing$',
      'monetization$',
      'size$',
      'attachmentError$',
      'remind$',
      'canCreateSupermindRequest$',
      'isSupermindRequest$',
      'supermindRequest$',
      'isSupermindReply$',
      'supermindReply$',
    ],
    props: {
      attachment$: { get: () => attachment$ },
      isEditing$: { get: () => isEditing$ },
      monetization$: { get: () => monetization$ },
      size$: { get: () => size$ },
      attachmentError$: { get: () => attachmentError$ },
      remind$: { get: () => remind$ },
      canCreateSupermindRequest$: { get: () => canCreateSupermindRequest$ },
      isSupermindRequest$: { get: () => canCreateSupermindRequest$ },
      supermindRequest$: { get: () => canCreateSupermindRequest$ },
      isSupermindReply$: { get: () => canCreateSupermindRequest$ },
      supermindReply$: { get: () => canCreateSupermindRequest$ },
    },
  });

  const popupServiceMock: any = MockService(PopupService, {
    create: function() {
      return this;
    },
    present: { toPromise: () => {} },
  });

  let uploaderServiceMock;

  beforeEach(
    waitForAsync(() => {
      uploaderServiceMock = jasmine.createSpyObj<UploaderService>(
        'UploaderService',
        {},
        {
          file$$: new Subject(),
          files$: of([]),
          filesCount$: of(0),
        }
      );

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],

        declarations: [
          ToolbarComponent,
          ButtonComponent,
          MockComponent(
            {
              selector: 'm-file-upload',
              inputs: ['wrapperClass', 'disabled'],
              outputs: ['onSelect'],
            },
            ['reset']
          ),
          MockComponent({
            selector: 'm-icon',
            inputs: ['from', 'iconId', 'sizeFactor'],
          }),
        ],
        providers: [
          {
            provide: ComposerService,
            useValue: composerServiceMock,
          },
          {
            provide: PopupService,
            useValue: popupServiceMock,
          },
          {
            provide: ToasterService,
            useValue: MockService(ToasterService),
          },
          {
            provide: AttachmentApiService,
            useValue: MockService(AttachmentApiService),
          },
          {
            provide: UploaderService,
            useValue: uploaderServiceMock,
          },
          {
            provide: LivestreamService,
            useValue: MockService(LivestreamService),
          },
          {
            provide: ExperimentsService,
            useValue: MockService(ExperimentsService),
          },
          {
            provide: PermissionsService,
            useValue: MockService(PermissionsService),
          },
          {
            provide: PermissionsService,
            useValue: MockService(PermissionsService),
          },
          {
            provide: NsfwEnabledService,
            useValue: MockService(NsfwEnabledService),
          },
        ],
      }).compileComponents();
      service = TestBed.inject(LivestreamService);
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(ToolbarComponent);
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

  it('should should set narrow mode', () => {
    spyOnProperty(
      comp.toolbarWrapper.nativeElement,
      'clientWidth',
      'get'
    ).and.returnValue(100);
    fixture.detectChanges();

    comp.calcNarrow();
    expect(comp.narrow).toBe(true);
  });

  it('should should not set narrow mode', () => {
    spyOnProperty(
      comp.toolbarWrapper.nativeElement,
      'clientWidth',
      'get'
    ).and.returnValue(10000);
    fixture.detectChanges();

    comp.calcNarrow();
    expect(comp.narrow).toBe(false);
  });

  it('should emit on attachment select', () => {
    spyOn(uploaderServiceMock.file$$, 'next');

    const file = new File([], '');
    fixture.detectChanges();

    comp.onAttachmentSelect([file]);

    expect(uploaderServiceMock.file$$.next).toHaveBeenCalledWith(file);
  });

  it('should emit on NSFW popup', () => {
    comp.onNsfwClick();
    expect(popupServiceMock.create).toHaveBeenCalledWith(NsfwComponent);
    expect(popupServiceMock.present).toHaveBeenCalled();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit on monetize popup', () => {
    comp.onMonetizeClick();
    expect(popupServiceMock.create).toHaveBeenCalledWith(
      ComposerMonetizeV2Component
    );
    expect(popupServiceMock.present).toHaveBeenCalled();
  });

  it('should emit on tags popup', () => {
    comp.onTagsClick();
    expect(popupServiceMock.create).toHaveBeenCalledWith(TagsComponent);
    expect(popupServiceMock.present).toHaveBeenCalled();
  });

  it('should emit on schedule popup', () => {
    comp.onSchedulerClick();
    expect(popupServiceMock.create).toHaveBeenCalledWith(ScheduleComponent);
    expect(popupServiceMock.present).toHaveBeenCalled();
  });

  it('should emit on supermind popup', () => {
    comp.onSupermindClick();
    expect(popupServiceMock.create).toHaveBeenCalledWith(
      ComposerSupermindComponent
    );
    expect(popupServiceMock.present).toHaveBeenCalled();
  });
});
