import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogEditorBottomBarComponent } from './bottom-bar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { MockService } from '../../../../../utils/mock';
import { BlogsEditService } from '../blog-edit.service';
import { BehaviorSubject } from 'rxjs';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { OverlayModalService } from '../../../../../services/ux/overlay-modal';

const content$ = new BehaviorSubject<string>('');

const title$ = new BehaviorSubject<string>('');

const banner$ = new BehaviorSubject<string>('');

const tags$ = new BehaviorSubject<string[]>([]);

const blogsEditServiceMock: any = MockService(BlogsEditService, {
  has: ['content$', 'title$', 'banner$', 'tags$'],
  props: {
    title$: { get: () => title$ },
    content$: { get: () => content$ },
    banner$: { get: () => banner$ },
    tags$: { get: () => tags$ },
  },
});

const overlayModalServiceMock: any = MockService(OverlayModalService, {
  create: {
    present() {
      return true;
    },
  },
});

describe('BlogEditorBottomBarComponent', () => {
  let comp: BlogEditorBottomBarComponent;
  let fixture: ComponentFixture<BlogEditorBottomBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlogEditorBottomBarComponent],
      imports: [RouterTestingModule, NgCommonModule, FormsModule],
      providers: [
        { provide: BlogsEditService, useValue: blogsEditServiceMock },
        { provide: FormToastService, useValue: MockService(FormToastService) },
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(BlogEditorBottomBarComponent);

    comp = fixture.componentInstance; // BlogEditorBottomBarComponent test instance

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

  it('should validate', async () => {
    comp.service.content$.next('123');
    comp.service.title$.next('123');
    comp.service.banner$.next('img/123');
    expect(await (comp as any).validate()).toBeTruthy();
  });

  it('should not validate if no content', async () => {
    comp.service.banner$.next('img/123');
    comp.service.content$.next('');
    comp.service.title$.next('123');
    expect(await (comp as any).validate()).toBeFalsy();
    expect((comp as any).toast.error).toHaveBeenCalledWith(
      'Your blog must have content'
    );
  });

  it('should not validate if no title', async () => {
    comp.service.banner$.next('img/123');
    comp.service.title$.next('');
    comp.service.content$.next('123');
    expect(await (comp as any).validate()).toBeFalsy();
    expect((comp as any).toast.error).toHaveBeenCalledWith(
      'You must provide a title'
    );
  });

  it('should not validate if no banner', async () => {
    comp.service.banner$.next('');
    comp.service.title$.next('234');
    comp.service.content$.next('123');

    expect(await (comp as any).validate()).toBeFalsy();
    expect((comp as any).toast.error).toHaveBeenCalledWith(
      'You must upload a banner'
    );
  });

  it('should open captcha modal on save', async () => {
    comp.service.banner$.next('img/banner');
    comp.service.title$.next('234');
    comp.service.content$.next('123');

    await comp.save();
    expect((comp as any).overlay.create).toHaveBeenCalled();
  });

  it('should have no activeTab initially', async () => {
    expect(comp.activeTab$.getValue()).toBeFalsy();
  });

  it('should have toggle activeTab on and off', async () => {
    comp.toggleActiveTab('');
    expect(comp.activeTab$.getValue()).toBeFalsy();
    comp.toggleActiveTab('tags');
    expect(comp.activeTab$.getValue()).toBeTruthy();
    comp.toggleActiveTab('tags');
    expect(comp.activeTab$.getValue()).toBeFalsy();
  });
});
