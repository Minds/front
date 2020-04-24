import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { TextAreaComponent } from './text-area.component';
import { ComposerService } from '../../services/composer.service';
import { FormsModule } from '@angular/forms';
import { ComposerBlogsService } from '../../services/blogs.service';

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

  const contentType$ = jasmine.createSpyObj('contentType$', {
    next: () => {},
    subscribe: { unsubscribe: () => {} },
    getValue: () => '',
  });

  const composerServiceMock: any = MockService(ComposerService, {
    has: ['message$', 'title$', 'contentType$'],
    props: {
      message$: { get: () => message$ },
      title$: { get: () => title$ },
      contentType$: { get: () => contentType$ },
    },
  });

  const content$ = jasmine.createSpyObj('content$', {
    next: () => {},
    subscribe: { unsubscribe: () => {} },
    getValue: () => '',
  });

  const composerBlogsServiceMock: any = MockService(ComposerService, {
    has: ['content$', 'title$'],
    props: {
      content$: { get: () => content$ },
      title$: { get: () => title$ },
    },
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        TextAreaComponent,
        MockComponent({
          selector: 'm-icon',
          inputs: ['from', 'iconId', 'sizeFactor'],
        }),
        MockComponent({
          selector: 'm-composer__banner',
        }),
        MockComponent({
          selector: 'm-blog__editor',
          inputs: ['content'],
        }),
      ],
      providers: [
        {
          provide: ComposerService,
          useValue: composerServiceMock,
        },
        {
          provide: ComposerBlogsService,
          useValue: composerBlogsServiceMock,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(TextAreaComponent);
    comp = fixture.componentInstance;

    contentType$.getValue.and.returnValue('post');

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

  it('should call composer service when content type is post on message change', () => {
    contentType$.getValue.and.returnValue('post');

    comp.onMessageChange('Hello world');
    // @ts-ignore
    expect(comp.service.message$.next).toHaveBeenCalledWith('Hello world');
  });

  it('should call blogs service when content type is blog on message change', () => {
    contentType$.getValue.and.returnValue('blog');

    comp.onMessageChange('Hello world');
    expect(comp.blogsService.content$.next).toHaveBeenCalledWith('Hello world');
  });

  it('should call composer service when content type is post on title change', () => {
    contentType$.getValue.and.returnValue('post');

    comp.onTitleChange('Hello world');
    // @ts-ignore
    expect(comp.service.title$.next).toHaveBeenCalledWith('Hello world');
  });

  it('should call blogs service when content type is blog on title change', () => {
    contentType$.getValue.and.returnValue('blog');

    comp.onTitleChange('Hello world');
    expect(comp.blogsService.title$.next).toHaveBeenCalledWith('Hello world');
  });
});
