import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogEdit } from './edit';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ChangeDetectorRef,
  Component,
  Directive,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Hovercard } from '../../../common/directives/hovercard';
import { uploadMock } from '../../../../tests/upload-mock.spec';
import { Upload } from '../../../services/api/upload';
import { HovercardService } from '../../../services/hovercard';
import { hovercardServiceMock } from '../../../mocks/services/hovercard-mock.spec';
import { By } from '@angular/platform-browser';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { MockComponent, MockDirective, MockService } from '../../../utils/mock';
import { InMemoryStorageService } from '../../../services/in-memory-storage.service';
import { inMemoryStorageServiceMock } from '../../../../tests/in-memory-storage-service-mock.spec';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'minds-banner',
  inputs: [
    '_object: object',
    '_src: src',
    '_top: top',
    'overlay',
    '_editMode: editMode',
    '_done: done',
  ],
  outputs: ['added'],
  template: ``,
})
class MindsBannerMock {
  object;
  editing: boolean = false;
  src: string = '';
  index: number = 0;

  file: any;
  top: number = 0;
  added: EventEmitter<any> = new EventEmitter();
  overlay: any; // @todo: ??

  set _object(value: any) {
    if (!value) return;
    this.object = value;
    this.src =
      '/fs/v1/banners/' +
      this.object.guid +
      '/' +
      this.top +
      '/' +
      this.object.banner;
  }

  set _src(value: any) {
    this.src = value;
  }

  set _top(value: number) {
    if (!value) return;
    this.top = value;
  }

  set _editMode(value: boolean) {
    this.editing = value;
  }

  add(e) {}

  cancel() {}

  /**
   * An upstream done event, which triggers the export process. Usually called from carousels
   */
  set _done(value: boolean) {
    if (value) this.done();
  }

  done() {}

  onClick(e) {
    e.target.parentNode.parentNode.getElementsByTagName('input')[0].click();
  }
}

@Directive({
  selector: '[mdl]',
  inputs: ['mdl'],
})
export class MDLMock {}

@Component({
  selector: 'minds-textarea',
  template: ``,
  exportAs: 'Textarea',
})
class TextareaMock {
  @Input('mModel') model: string = '';
  @Output('mModelChange') update: EventEmitter<any> = new EventEmitter();

  @Input('disabled') disabled: boolean = false;
  @Input('placeholder') placeholder: string = '';

  focus() {}

  blur() {}

  change() {}

  paste(e: any) {}
}

@Component({
  selector: 'm-wire-threshold-input',
  template: '',
})
class WireThresholdInputComponentMock {
  threshold: any;

  @Input('threshold')
  set _threshold(threshold: any) {}

  @Input('disabled') disabled: boolean = false;
  @Input('enabled') enabled: boolean = false;

  @Output('thresholdChange') thresholdChangeEmitter: EventEmitter<
    any
  > = new EventEmitter<any>();

  toggle() {}

  setType(type: any) {}
}

export const MEDIUM_EDITOR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InlineEditorComponentMock),
  multi: true,
};

@Component({
  moduleId: module.id,
  selector: 'm-inline-editor',
  template: `
    <div #host></div>
  `,
  host: {
    change: 'propagateChange($event.target.value)',
  },
  providers: [MEDIUM_EDITOR_VALUE_ACCESSOR],
})
class InlineEditorComponentMock {
  @Input() options: any;
  @Input() placeholder: string;
  @ViewChild('host', { static: false }) host: HTMLDivElement;

  @Input()
  reset() {
    this.host.innerHTML = '';
    this.ngOnChanges('');
  }

  propagateChange = (_: any) => {};

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.options =
      typeof this.options === 'string'
        ? JSON.parse(this.options)
        : typeof this.options === 'object'
        ? this.options
        : {};
    if (this.placeholder && this.placeholder !== '') {
      Object.assign(this.options, {
        placeholder: { text: this.placeholder },
      });
    }
  }

  prepareForSave(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      });
    });
  }

  ngOnChanges(changes: any) {
    this.propagateChange(changes);
  }

  writeValue(value: any) {
    if (value && value !== '') {
      this.host.innerHTML = value;
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {}
}

describe('BlogEdit', () => {
  let comp: BlogEdit;
  let fixture: ComponentFixture<BlogEdit>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        Hovercard,
        MindsBannerMock,
        TextareaMock,
        InlineEditorComponentMock,
        WireThresholdInputComponentMock,
        MockComponent({
          selector: 'minds-form-tags-input',
          inputs: ['tags', 'additionalTags'],
          outputs: ['change', 'tagsChange'],
        }),
        MockComponent({
          selector: 'm-hashtags-selector',
          inputs: ['tags', 'alignLeft'],
          outputs: ['tagsChange', 'tagsAdded', 'tagsRemoved'],
        }),
        MockComponent({
          selector: 'm-poster-date-selector',
          inputs: ['date', 'dateFormat'],
          outputs: ['dateChange'],
        }),
        MockComponent({
          selector: 'm-nsfw-selector',
          outputs: ['selectedChanged'],
          inputs: ['selected'],
        }),
        MockDirective({
          selector: '[mIfFeature]',
          inputs: ['mIfFeature'],
        }),
        BlogEdit,
        MDLMock,
      ], // declare the test component
      imports: [RouterTestingModule, NgCommonModule, FormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: Upload, useValue: uploadMock },
        { provide: HovercardService, useValue: hovercardServiceMock },
        {
          provide: InMemoryStorageService,
          useValue: inMemoryStorageServiceMock,
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
      ],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(BlogEdit);

    comp = fixture.componentInstance; // BlogEdit test instance

    spyOn(comp.session, 'isLoggedIn').and.returnValue(true);

    clientMock.response = [];

    clientMock.response[`api/v1/admin/boosts/newsfeed`] = {
      status: 'success',
    };

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have an instance of minds-textarea used for the title', () => {
    expect(fixture.debugElement.query(By.css('.m-h1-input'))).not.toBeNull();
  });

  it('should have an instance of m-inline-editor used for the description', () => {
    expect(
      fixture.debugElement.query(
        By.css('.minds-blog-descriptions > m-inline-editor')
      )
    ).not.toBeNull();
  });

  /*it('should have a list of categories', () => {
    expect(fixture.debugElement.query(By.css('ul.m-blog--categories-list'))).not.toBeNull();
  });

  it('clicking on a category should select it', () => {
    spyOn(comp, 'onCategoryClick').and.callThrough();

    const category = fixture.debugElement.query(By.css('ul.m-blog--categories-list > li.m-blog--categories-list-item'));
    expect(category).not.toBeNull();
    category.nativeElement.click();
    fixture.detectChanges();

    expect(comp.onCategoryClick).toHaveBeenCalled();

    expect(comp.blog.categories.length).toBe(1);
  });*/

  it('should have a save draft button', () => {
    const draft = fixture.debugElement.query(
      By.css('.m-button.m-button--draft')
    );
    expect(draft).not.toBeNull();
    expect(draft.nativeElement.innerText).toContain('Save draft');
  });

  it('clicking on save draft button should call save()', () => {
    spyOn(comp, 'save').and.stub();
    const draft = fixture.debugElement.query(
      By.css('.m-button.m-button--draft')
    );
    draft.nativeElement.click();
    fixture.detectChanges();

    expect(comp.blog.published).toBe(0);

    expect(comp.save).toHaveBeenCalled();
  });

  it('should have a publish button', () => {
    const publish = fixture.debugElement.query(
      By.css('.m-button.m-button--submit')
    );
    expect(publish).not.toBeNull();
    expect(publish.nativeElement.innerText).toContain('Publish');
  });

  it('clicking on publish button should set blog.published to 1 and then call publish()', () => {
    spyOn(comp, 'save').and.stub();
    const publish = fixture.debugElement.query(
      By.css('.m-button.m-button--submit')
    );
    publish.nativeElement.click();
    fixture.detectChanges();

    expect(comp.blog.published).toBe(1);
    expect(comp.save).toHaveBeenCalled();
  });

  it('should have a m-wire-threshold-input', () => {
    const threshold = fixture.debugElement.query(
      By.css('m-wire-threshold-input')
    );
    expect(threshold).not.toBeNull();
    expect(threshold.nativeElement.disabled).toBeFalsy();
  });

  it('should know if a banner already exists', () => {
    expect(comp.existingBanner).toBeFalsy();
  });

  it('should not allow initial submission without a banner', () => {
    const publish = fixture.debugElement.query(
      By.css('.m-button.m-button--submit')
    );
    publish.nativeElement.click();
    expect(comp.existingBanner).toBeFalsy();
  });
});
