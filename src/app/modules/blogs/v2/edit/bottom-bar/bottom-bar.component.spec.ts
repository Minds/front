import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BlogEditorBottomBarComponent } from './bottom-bar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { MockService } from '../../../../../utils/mock';
import { BlogsEditService } from '../blog-edit.service';
import { BehaviorSubject } from 'rxjs';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { MonetizationSubjectValue } from '../../../../composer/services/composer.service';
import { ButtonComponent } from '../../../../../common/components/button/button.component';
import { ModalService } from '../../../../../services/ux/modal.service';
import { modalServiceMock } from '../../../../../../tests/modal-service-mock.spec';

const content$ = new BehaviorSubject<string>('');

const title$ = new BehaviorSubject<string>('');

const banner$ = new BehaviorSubject<string>('');

const tags$ = new BehaviorSubject<string[]>([]);

const monetize$ = new BehaviorSubject<MonetizationSubjectValue>(null);

const blogsEditServiceMock: any = MockService(BlogsEditService, {
  has: ['content$', 'title$', 'banner$', 'tags$', 'monetize$'],
  props: {
    title$: { get: () => title$ },
    content$: { get: () => content$ },
    banner$: { get: () => banner$ },
    tags$: { get: () => tags$ },
    monetize$: { get: () => monetize$ },
  },
});

describe('BlogEditorBottomBarComponent', () => {
  let comp: BlogEditorBottomBarComponent;
  let fixture: ComponentFixture<BlogEditorBottomBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BlogEditorBottomBarComponent, ButtonComponent],
      imports: [RouterTestingModule, NgCommonModule, FormsModule],
      providers: [
        { provide: BlogsEditService, useValue: blogsEditServiceMock },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        { provide: ModalService, useValue: modalServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
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
    expect((comp as any).modalService.present).toHaveBeenCalled();
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
