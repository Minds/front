///<reference path="../../../../../../../node_modules/@types/jasmine/index.d.ts"/>
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  Component,
  DebugElement,
  Directive,
  EventEmitter,
  Input,
  Output,
  NO_ERRORS_SCHEMA,
  Pipe,
  PipeTransform,
} from '@angular/core';

import { Activity } from './activity';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { clientMock } from '../../../../../../tests/client-mock.spec';
import { sessionMock } from '../../../../../../tests/session-mock.spec';
import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';
import { MaterialMock } from '../../../../../../tests/material-mock.spec';
import { scrollServiceMock } from '../../../../../../tests/scroll-service-mock.spec';
import { ScrollService } from '../../../../../services/ux/scroll';
import { AttachmentService } from '../../../../../services/attachment';
import { attachmentServiceMock } from '../../../../../../tests/attachment-service-mock.spec';
import { translationServiceMock } from '../../../../../../tests/translation-service-mock.spec';
import { TranslationService } from '../../../../../services/translation';
import { overlayModalServiceMock } from '../../../../../../tests/overlay-modal-service-mock.spec';
import { OverlayModalService } from '../../../../../services/ux/overlay-modal';
import { TagsPipe } from '../../../../../common/pipes/tags';
import { MindsRichEmbed } from '../../../../../common/components/rich-embed/rich-embed';
import { DomainPipe } from '../../../../../common/pipes/domain';
import { AbbrPipe } from '../../../../../common/pipes/abbr';
import { ChannelBadgesComponent } from '../../../../../common/components/badges/badges.component';
import { TooltipComponentMock } from '../../../../../mocks/common/components/tooltip/tooltip.component';
import { TokenPipe } from '../../../../../common/pipes/token.pipe';
import { ExcerptPipe } from '../../../../../common/pipes/excerpt';
import { NewsfeedService } from '../../../../newsfeed/services/newsfeed.service';
import { EntitiesService } from '../../../../../common/services/entities.service';
import { entitiesServiceMock } from '../../../../../../tests/entities-service-mock.spec';
import {
  MockComponent,
  MockDirective,
  MockService,
} from '../../../../../utils/mock';
import { IfFeatureDirective } from '../../../../../common/directives/if-feature.directive';
import { NSFWSelectorConsumerService } from '../../../../../common/components/nsfw-selector/nsfw-selector.service';
import { FeaturesService } from '../../../../../services/features.service';
import { BlockListService } from '../../../../../common/services/block-list.service';
import { ClientMetaService } from '../../../../../common/services/client-meta.service';
import { clientMetaServiceMock } from '../../../../../../tests/client-meta-service-mock.spec';
import { AutocompleteSuggestionsService } from '../../../../suggestions/services/autocomplete-suggestions.service';
import { SiteService } from '../../../../../common/services/site.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { TagsPipeMock } from '../../../../../mocks/pipes/tagsPipe.mock';
import { RedirectService } from '../../../../../common/services/redirect.service';

/* tslint:disable */
// START MOCKS
@Component({
  selector: 'm-wire--lock-screen',
  template: '',
})
export class WireLockScreenComponentMock {
  @Input() entity: any;
  @Output('entityChange') update: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'm-translate',
  inputs: ['_open: open', '_entity: entity', '_translateEvent: translateEvent'],
  outputs: ['onTranslateInit', 'onTranslate', 'onTranslateError'],
  exportAs: 'translate',
  template: '',
})
export class TranslateMock {
  onTranslateInit: EventEmitter<any> = new EventEmitter();
  onTranslate: EventEmitter<any> = new EventEmitter();
  onTranslateError: EventEmitter<any> = new EventEmitter();

  languagesInProgress: boolean = false;
  languagesError: boolean = false;

  preferredLanguages: any[] = [];
  languages: any[] = [];

  open: boolean = false;
  entity: any = {};
  translateEvent: EventEmitter<any> = new EventEmitter();

  translation = {
    translated: false,
    target: '',
    error: false,
    message: '',
    title: '',
    description: '',
    source: '',
  };

  set _entity(value: any) {}

  select(language: string) {}

  translate($event: any = {}) {}
}

@Component({
  selector: 'm-wire-threshold-input',
  template: '',
})
export class WireThresholdInputComponentMock {
  threshold: any;

  @Input('enabled') enabled: boolean = false;

  @Input('threshold')
  set _threshold(threshold: any) {}

  @Output('thresholdChange') thresholdChangeEmitter: EventEmitter<
    any
  > = new EventEmitter<any>();

  toggle() {}

  setType(type: any) {}
}

@Component({
  selector: 'minds-newsfeed-poster',
  inputs: ['_container_guid: containerGuid', 'accessId', 'message'],
  outputs: ['load'],
  template: '',
})
export class PosterMock {
  load: EventEmitter<any> = new EventEmitter();

  set accessId(access_id: any) {}

  set message(value: any) {}

  post() {}

  uploadAttachment(file: HTMLInputElement, event) {}

  removeAttachment(file: HTMLInputElement) {}

  getPostPreview(message) {}
}

@Component({
  selector: 'm-video',
  template: '',
})
export class VideoComponentMock {
  @Input('thumbnail') thumbnail: string;
  @Input('muted') muted: boolean;
  @Input('loop') loop: boolean;

  @Input('analyticsGuid') analyticsGuid: any;

  @Input('preview')
  set _preview(value) {}

  @Input('previewPlayback')
  set _previewPlayback(value) {}

  @Input('src')
  set _src(value: string | any[]) {}

  @Input('torrent')
  set _torrent(value: string | any[]) {}

  @Input('autoplay')
  set _autoplay(value: any) {}

  @Input('poster') poster: any;
  @Input('guid') guid: any;
  @Input('playCount') playCount: any;

  listen() {}

  unListen() {}

  trigger(type: string, ev: Event) {}

  exitFullScreen() {}
}

@Component({
  selector: 'video-ads',
  template: '',
})
export class VideoAdsMock {
  @Input() player;
}

@Component({
  selector: 'm-post-menu',
  template: '',
})
export class PostMenuComponentMock {
  @Input() entity;
  @Input() options;
  @Output() optionSelected: EventEmitter<any> = new EventEmitter<any>();
  @Input() canDelete;
  @Input() isTranslatable;
}

@Component({
  selector: 'minds-remind',
  template: '',
})
export class RemindMock {
  @Input() object;
  @Input() events;
  @Input() boosted;
  @Output() matureVisibilityChange: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'minds-button-thumbs-up',
  template: '',
})
export class ThumbsUpButtonMock {
  @Input() object;
  @Input() events;
}

@Component({
  selector: 'minds-button-thumbs-down',
  template: '',
})
export class ThumbsDownButtonMock {
  @Input() object;
  @Input() events;
}

@Component({
  selector: 'minds-button-comment',
  template: '',
})
export class ButtonCommentMock {
  @Input() object;
  @Output() click: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'minds-button-remind',
  template: '',
})
export class ButtonRemindMock {
  @Input() object;
}

@Component({
  selector: 'minds-comments',
  template: '',
})
export class MindsCommentsMock {
  @Input() object;
  @Input() focusOnInit;
  @Input() focusedCommentGuid: string;
  @Input() canEdit: boolean;
}

@Component({
  selector: 'm-wire-button',
  template: '',
})
export class WireButtonMock {
  @Input() object;
}

@Component({
  selector: 'm-modal-share',
  template: '',
})
export class ModalShareMock {
  @Input() open;
  @Input() url;
  @Input() embed;
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'm-modal-report',
  template: '',
})
export class ModalReportMock {
  @Input() open;
  @Input() object;
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'm-modal-confirm',
  template: '',
})
export class ModalConfirmMock {
  @Input() open;
  @Input() closeAfterAction;
  @Input() yesButton;
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @Output() actioned: EventEmitter<any> = new EventEmitter<any>();
}

@Directive({
  selector: '[hovercard]',
  inputs: ['_hovercard: hovercard', '_hovercardAnchor: hovercardAnchor'],
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(click)': 'hideForcefully()',
  },
})
export class HovercardMock {
  set _hovercard(value: any) {}

  set _hovercardAnchor(value: any) {}

  show() {}

  hide() {}

  hideForcefully() {}
}

@Component({
  selector: 'm-read-more--button',
  template: '',
})
export class ReadMoreButtonComponentMock {}

@Component({
  selector: 'm--crypto-token-symbol',
  template: '',
})
class CryptoTokenSymbolMock {}

@Directive({
  selector: '[autoGrow]',
  inputs: ['autoGrow', '_model: ngModel'],
  host: {
    '(keydown)': 'grow()',
    '(paste)': 'grow()',
    '(change)': 'grow()',
    '(ngModelChange)': 'grow()',
  },
})
export class AutoGrowMock {
  autoGrow: any;

  set _model(value: any) {}

  grow() {}
}

@Component({
  selector: 'm-post-menu',
  template: '',
  inputs: ['entity', 'canDelete', 'isTranslatable', 'options'],
})
export class PostMenuMock {}

@Component({
  selector: 'm-safe-toggle',
  template: '',
})
export class SafeToggleComponentMock {
  @Input('entity') entity: any;
  @Output('entityChange') entityChange: EventEmitter<any> = new EventEmitter<
    any
  >();
}
// END MOCKS

describe('Activity', () => {
  let comp: Activity;
  let fixture: ComponentFixture<Activity>;
  const defaultActivity = {
    ownerObj: {
      username: 'minds',
    },
    wire_threshold: {
      type: 'points',
      min: '10',
    },
    wire_totals: {
      points: 10,
      money: 3,
      tokens: 1,
    },
    impressions: 100,
    paywall: true,
    message: 'test',
  };

  function getActivityMetrics(): DebugElement {
    return fixture.debugElement.query(
      By.css('.impressions-tag.m-activity--metrics')
    );
  }

  function getActivityMetric(i: number): DebugElement {
    return fixture.debugElement.query(
      By.css(
        `.m-activity--metrics .m-activity--metrics-metric:nth-child(${i}) > span`
      )
    );
  }

  let NSFWSelectorServiceMock: any = MockService(
    NSFWSelectorConsumerService,
    {}
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TagsPipeMock,
        DomainPipe,
        AbbrPipe,
        ExcerptPipe,
        MindsRichEmbed,
        ChannelBadgesComponent,
        MaterialMock,
        HovercardMock,
        WireLockScreenComponentMock,
        TranslateMock,
        WireThresholdInputComponentMock,
        PosterMock,
        VideoComponentMock,
        VideoAdsMock,
        RemindMock,
        ThumbsUpButtonMock,
        ThumbsDownButtonMock,
        ButtonCommentMock,
        ButtonRemindMock,
        MindsCommentsMock,
        WireButtonMock,
        ModalShareMock,
        ModalReportMock,
        ModalConfirmMock,
        ReadMoreButtonComponentMock,
        AutoGrowMock,
        PostMenuMock,
        TooltipComponentMock,
        CryptoTokenSymbolMock,
        Activity,
        TokenPipe,
        SafeToggleComponentMock,
        MockComponent({
          selector: 'm-nsfw-selector',
          inputs: ['selected'],
          outputs: ['selected'],
        }),
        MockComponent({
          selector: 'm-poster-date-selector',
          inputs: ['date', 'dateFormat'],
          outputs: ['dateChange'],
        }),
        MockDirective({
          selector: '[mIfFeature]',
          inputs: ['mIfFeature'],
        }),
        MockDirective({
          selector: '[mIfFeatureElse]',
          inputs: ['mIfFeatureElse'],
        }),
      ], // declare the test component
      imports: [RouterTestingModule, FormsModule /*, CommonModule*/],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: Session, useValue: sessionMock },
        { provide: ScrollService, useValue: scrollServiceMock },
        { provide: AttachmentService, useValue: attachmentServiceMock },
        { provide: TranslationService, useValue: translationServiceMock },
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
        { provide: EntitiesService, useValue: entitiesServiceMock },
        { provide: ClientMetaService, useValue: clientMetaServiceMock },
        {
          provide: NSFWSelectorConsumerService,
          useValue: NSFWSelectorServiceMock,
        },
        {
          provide: FeaturesService,
          useValue: MockService(FeaturesService),
        },
        NewsfeedService,
        {
          provide: BlockListService,
          useValue: MockService(BlockListService),
        },
        {
          provide: AutocompleteSuggestionsService,
          useValue: MockService(AutocompleteSuggestionsService),
        },
        {
          provide: SiteService,
          useValue: MockService(SiteService, {
            props: {
              isProDomain: { get: () => false },
            },
          }),
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
        RedirectService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(Activity);

    comp = fixture.componentInstance; // LoginForm test instance
    comp.activity = defaultActivity;

    fixture.detectChanges();
    comp.detectChanges();
  });

  it('should show m-wire--lock-screen if activity.paywall == true', () => {
    expect(
      fixture.debugElement.query(By.css('m-wire--lock-screen'))
    ).not.toBeNull();
  });
  it("shouldn't show m-wire--lock-screen if activity.paywall == false", () => {
    const activity = {
      ownerObj: {
        username: 'minds',
      },
      wire_threshold: {
        type: 'points',
        min: '10',
      },
      wire_totals: {
        points: 10,
        money: 3,
        tokens: 1,
      },
      impressions: 100,
      paywall: false,
    };
    comp.activity = activity;

    fixture.detectChanges();
    comp.detectChanges();

    expect(
      fixture.debugElement.query(By.css('m-wire--lock-screen'))
    ).toBeNull();
  });

  it('should have activity metrics', () => {
    expect(getActivityMetrics()).toBeDefined();
  });

  it('activity metrics should have token metric', () => {
    let tokens = getActivityMetric(1);
    expect(tokens).not.toBeNull();
    expect(tokens.nativeElement.textContent).toContain(1);
  });
  it('activity metrics should have views metric', () => {
    let views = getActivityMetric(2);
    expect(views).not.toBeNull();
    expect(views.nativeElement.textContent).toContain(100);
  });

  it('should default disableReminding to FALSE', () => {
    expect(comp.disableReminding).toBeFalsy();
  });

  it('should not show remind button if disableReminding set to true', () => {
    spyOn(comp, 'isScheduled').and.callFake(function() {
      return false;
    });
    comp.disableReminding = true;
    comp.activity.time_created = 999999999999999999999;
    expect(comp.showRemindButton()).toBeFalsy();
  });

  it('should show remind button if disableReminding set to false', () => {
    spyOn(comp, 'isScheduled').and.callFake(function() {
      return false;
    });
    comp.disableReminding = false;
    comp.activity.time_created = 999999999999999999999;
    expect(comp.showRemindButton()).toBeTruthy();
  });

  it('should default disableBoosting to FALSE', () => {
    expect(comp.disableBoosting).toBeFalsy();
  });

  it('should not show boost button if disableReminding set to true', () => {
    spyOn(comp, 'isScheduled').and.callFake(function() {
      return false;
    });
    spyOn(comp.session, 'getLoggedInUser').and.callFake(function() {
      return { guid: '123' };
    });
    comp.disableBoosting = true;
    comp.activity.time_created = 999999999999999999999;
    comp.activity.owner_guid = '123';
    expect(comp.showBoostButton()).toBeFalsy();
  });

  it('should show boost button if disableReminding set to false', () => {
    spyOn(comp, 'isScheduled').and.callFake(function() {
      return false;
    });
    spyOn(comp.session, 'getLoggedInUser').and.callFake(function() {
      return { guid: '123' };
    });
    comp.disableBoosting = false;
    comp.activity.time_created = 999999999999999999999;
    comp.activity.owner_guid = '123';
    expect(comp.showBoostButton()).toBeTruthy();
  });
  // TODO test the rest of the features
});
