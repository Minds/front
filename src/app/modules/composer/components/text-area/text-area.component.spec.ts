import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  MockComponent,
  MockService,
  MockDirective,
} from '../../../../utils/mock';
import {
  BOOST_PLACEHOLDER_TEXT,
  DEFAULT_PLACEHOLDER_TEXT,
  TextAreaComponent,
} from './text-area.component';
import { ComposerService } from '../../services/composer.service';
import { FormsModule } from '@angular/forms';
import { AutocompleteSuggestionsService } from '../../../suggestions/services/autocomplete-suggestions.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { ComposerBoostService } from '../../services/boost.service';
import { PLATFORM_ID } from '@angular/core';

describe('Composer Text Area', () => {
  let comp: TextAreaComponent;
  let fixture: ComponentFixture<TextAreaComponent>;

  const message$ = jasmine.createSpyObj('message$', {
    next: () => {},
    subscribe: { unsubscribe: () => {} },
  });

  const title$ = jasmine.createSpyObj('title$', {
    next: () => {},
    subscribe: { unsubscribe: () => {} },
    getValue: '',
  });

  const composerServiceMock: any = MockService(ComposerService, {
    has: ['message$', 'title$', 'data$', 'attachmentPreviews$'],
    props: {
      message$: { get: () => message$ },
      title$: { get: () => title$ },
      data$: { get: () => new Subject() },
      attachmentPreviews$: { get: () => null },
    },
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        MockDirective({
          selector: 'mTextInputAutocomplete',
          inputs: [
            'triggerCharacters',
            'findChoices',
            'getChoiceLabel',
            'itemTemplate',
            'adjustForScrollOffset',
          ],
        }),
        TextAreaComponent,
        MockComponent({
          selector: 'm-icon',
          inputs: ['from', 'iconId', 'sizeFactor'],
        }),
        MockComponent({
          selector: 'm-text-input--autocomplete-container',
        }),
      ],
      providers: [
        {
          provide: ComposerService,
          useValue: composerServiceMock,
        },
        {
          provide: AutocompleteSuggestionsService,
          useValue: MockService(AutocompleteSuggestionsService),
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
        {
          provide: ComposerBoostService,
          useValue: MockService(ComposerBoostService, {
            has: ['isBoostMode$'],
            props: {
              isBoostMode$: { get: () => new BehaviorSubject<boolean>(false) },
            },
          }),
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(TextAreaComponent);
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

  it('should emit on message', () => {
    comp.onMessageChange('test message');
    expect(message$.next).toHaveBeenCalledWith('test message');
  });

  it('should emit on title', () => {
    comp.onTitleChange('test title');
    expect(title$.next).toHaveBeenCalledWith('test title');
  });

  it('should toggle title on without anything on cache', () => {
    title$.getValue.and.returnValue(null);
    comp.titleInput = { nativeElement: null }; // Disable auto-focus and its test
    comp.titleCache = void 0;
    fixture.detectChanges();

    comp.toggleTitle();
    expect(title$.next).toHaveBeenCalledWith('');
  });

  it('should toggle title on using cache', () => {
    title$.getValue.and.returnValue(null);
    comp.titleInput = { nativeElement: null }; // Disable auto-focus and its test
    comp.titleCache = 'test title';
    fixture.detectChanges();

    comp.toggleTitle();
    expect(title$.next).toHaveBeenCalledWith('test title');
  });

  it('should toggle title off', () => {
    title$.getValue.and.returnValue('test title');
    comp.titleInput = { nativeElement: null }; // Disable auto-focus and its test
    comp.titleCache = '';
    fixture.detectChanges();

    comp.toggleTitle();
    expect(title$.next).toHaveBeenCalledWith(null);
  });

  describe('textAreaPlaceholderText$', () => {
    it('should return default placeholder text when not in boost mode', (done: DoneFn) => {
      (comp as any).isModal = true;
      (comp as any).composerBoostService.isBoostMode$.next(false);

      (comp as any).textAreaPlaceholderText$.subscribe((text: string) => {
        expect(text).toBe(DEFAULT_PLACEHOLDER_TEXT);
        done();
      });
    });

    it('should return default placeholder text when in boost mode but not in a modal', (done: DoneFn) => {
      (comp as any).isModal = false;
      (comp as any).composerBoostService.isBoostMode$.next(true);

      (comp as any).textAreaPlaceholderText$.subscribe((text: string) => {
        expect(text).toBe(DEFAULT_PLACEHOLDER_TEXT);
        done();
      });
    });

    it('should return boost placeholder text when isBoostMode$ is true and in a modal', (done: DoneFn) => {
      (comp as any).isModal = true;
      (comp as any).composerBoostService.isBoostMode$.next(true);

      (comp as any).textAreaPlaceholderText$.subscribe((text: string) => {
        expect(text).toBe(BOOST_PLACEHOLDER_TEXT);
        done();
      });
    });
  });
});
