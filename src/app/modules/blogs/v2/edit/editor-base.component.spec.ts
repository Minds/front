import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Session } from '../../../../services/session';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { BlogsEditService } from './blog-edit.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { BlogEditorV2Component } from './editor-base.component';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { composerMockService } from '../../../../mocks/modules/composer/services/composer.service.mock';
import { ComposerService } from '../../../composer/services/composer.service';
import { ButtonComponent } from '../../../../common/components/button/button.component';
import { FormsModule } from '@angular/forms';

const content$ = new BehaviorSubject<string>('');

const title$ = new BehaviorSubject<string>('');

const banner$ = new BehaviorSubject<string>('');

const error$ = new BehaviorSubject<string>('');

const blogsEditServiceMock: any = MockService(BlogsEditService, {
  has: ['content$', 'title$', 'nsfw$', 'error$'],
  props: {
    content$: { get: () => content$ },
    title$: { get: () => title$ },
    banner$: { get: () => banner$ },
    error$: { get: () => error$ },
  },
});

const params$ = new BehaviorSubject<string>('');

const activatedRouteMock: any = MockService(ActivatedRoute, {
  has: ['params'],
  props: {
    params: { get: () => params$ },
  },
});

describe('BlogEditorV2Component', () => {
  let comp: BlogEditorV2Component;
  let fixture: ComponentFixture<BlogEditorV2Component>;

  beforeEach(() => {
    TestBed.overrideProvider(ComposerService, {
      useValue: composerMockService,
    });
    TestBed.configureTestingModule({
      declarations: [
        BlogEditorV2Component,
        ButtonComponent,
        MockComponent({ selector: 'm-blog__editor', inputs: ['content'] }),
        MockComponent({ selector: 'm-blogEditor__bottomBar' }),
        MockComponent({ selector: 'm-blogEditor__dropdown' }),
      ],
      imports: [RouterTestingModule, FormsModule],
      providers: [
        {
          provide: Session,
          useValue: MockService(Session, {
            getLoggedInUser: () => {
              return {
                username: 'test',
                email_confirmed: true,
              };
            },
            isLoggedIn: () => true,
          }),
        },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: DialogService, useValue: MockService(DialogService) },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: Location, useValue: MockService(Location) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: BlogsEditService, useValue: blogsEditServiceMock },
        { provide: ComposerService, useValue: composerMockService },
      ],
    }).compileComponents();
  });

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    TestBed.overrideComponent(BlogEditorV2Component, {
      set: {
        providers: [
          { provide: BlogsEditService, useValue: blogsEditServiceMock },
          { provide: ComposerService, useValue: composerMockService },
        ],
      },
    });

    fixture = TestBed.createComponent(BlogEditorV2Component);

    comp = fixture.componentInstance; // BlogEditorV2Component test instance

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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should detect whether a user is verified when determining whether they can create a blog', () => {
    expect(comp.canCreateBlog()).toBeTruthy();
  });

  it('should dispatch content changes to service', () => {
    comp.onContentChange('1');
    expect(comp.service.content$.getValue()).toBe('1');
  });

  it('should dispatch title changes to service', () => {
    comp.onTitleChange('1');
    expect(comp.service.title$.getValue()).toBe('1');
  });
});
