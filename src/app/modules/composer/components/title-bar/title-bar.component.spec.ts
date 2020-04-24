import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { TitleBarComponent } from './title-bar.component';
import { ComposerService } from '../../services/composer.service';
import { ComposerBlogsService } from '../../services/blogs.service';
import { PopupService } from '../popup/popup.service';
import { Router } from '@angular/router';

describe('Composer Title Bar', () => {
  let comp: TitleBarComponent;
  let fixture: ComponentFixture<TitleBarComponent>;

  const accessId$ = jasmine.createSpyObj('accessId$', ['next']);
  const license$ = jasmine.createSpyObj('license$', ['next']);

  let containerGuid;

  const contentType$ = jasmine.createSpyObj('contentType$', {
    next: () => {},
    subscribe: { unsubscribe: () => {} },
    getValue: () => '',
  });

  const composerServiceMock: any = MockService(ComposerService, {
    getContainerGuid: () => containerGuid,
    has: ['accessId$', 'license$', 'contentType$'],
    props: {
      accessId$: { get: () => accessId$ },
      license$: { get: () => license$ },
      contentType$: { get: () => contentType$ },
    },
  });

  const composerBlogServiceMock: any = MockService(ComposerBlogsService, {
    getContainerGuid: () => containerGuid,
    saveDraft: () => true,
    has: ['accessId$', 'license$', 'contentType$'],
    props: {
      accessId$: { get: () => accessId$ },
      license$: { get: () => license$ },
      contentType$: { get: () => contentType$ },
    },
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TitleBarComponent,
        MockComponent({
          selector: 'm-dropdownMenu',
          inputs: ['menu', 'triggerClass', 'menuClass'],
        }),
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
          provide: ComposerBlogsService,
          useValue: composerBlogServiceMock,
        },
        {
          provide: PopupService,
          useValue: MockService(PopupService),
        },
        {
          provide: Router,
          useValue: MockService(Router),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(TitleBarComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    contentType$.getValue.and.returnValue('post');

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should emit on visibility change', () => {
    containerGuid = '';
    accessId$.next.calls.reset();
    fixture.detectChanges();

    comp.onVisibilityClick('2');
    expect(accessId$.next).toHaveBeenCalledWith('2');
  });

  it('should not emit visibility change if disabled', () => {
    containerGuid = '100000';
    accessId$.next.calls.reset();
    fixture.detectChanges();

    comp.onVisibilityClick('2');
    expect(accessId$.next).not.toHaveBeenCalled();
  });

  it('should emit on license change', () => {
    license$.next.calls.reset();
    fixture.detectChanges();

    comp.onLicenseClick('spec-test');
    expect(license$.next).toHaveBeenCalledWith('spec-test');
  });

  it('should call composer blogs service on visibility change when content type is blog', () => {
    contentType$.getValue.and.returnValue('blog');
    containerGuid = '';
    accessId$.next.calls.reset();
    fixture.detectChanges();

    comp.onVisibilityClick('2');
    expect(accessId$.next).toHaveBeenCalledWith('2');
  });

  it('should call composer service on visibility change when content type is post', () => {
    contentType$.getValue.and.returnValue('post');

    comp.onVisibilityClick('1');
    expect(comp.service.accessId$.next).toHaveBeenCalledWith('1');
  });

  it('should call composer blogs service on license change when content type is blog', () => {
    contentType$.getValue.and.returnValue('blog');
    license$.next.calls.reset();
    fixture.detectChanges();

    comp.onLicenseClick('2');
    expect(license$.next).toHaveBeenCalledWith('2');
  });

  it('should call composer service on license change when content type is post', () => {
    contentType$.getValue.and.returnValue('post');

    comp.onLicenseClick('1');
    expect(comp.service.license$.next).toHaveBeenCalledWith('1');
  });

  it('should trigger onCreatePostEmitter on post click', () => {
    spyOn(comp.onCreatePostEmitter, 'emit').and.callFake(() => {});
    fixture.detectChanges();

    comp.onCreatePostClick();
    expect(comp.onCreatePostEmitter.emit).toHaveBeenCalled();
  });

  it('should trigger onCreateBlogEmitter on blog post click', () => {
    spyOn(comp.onCreateBlogEmitter, 'emit').and.callFake(() => {});
    fixture.detectChanges();

    comp.onCreateBlogClick();
    expect(comp.onCreateBlogEmitter.emit).toHaveBeenCalled();
  });
});
